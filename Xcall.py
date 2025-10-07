import requests
import base64
import json
import os
import whisper
from datetime import datetime
from openai import OpenAI
from .env import OPENAI_KEY, API_ID, API_TOKEN

# Configuration

credentials = f"{API_ID}:{API_TOKEN}"
encoded_credentials = base64.b64encode(credentials.encode()).decode()
headers = {"Authorization": f"Basic {encoded_credentials}"}

print("🔄 Chargement Whisper...")
model = whisper.load_model("base")
client = OpenAI(api_key=OPENAI_KEY)
print("✅ Prêt !\n")

# Business context
BUSINESS_CONTEXT = """
VOTRE BUSINESS: Ce que vous faites : Cabinet de recrutement spécialisé qui connecte les meilleurs talents tech aux entreprises ambitieuses.
Proposition de valeur : Expertise sectorielle, approche humaine et placements durables fondés sur la confiance.
Un bon business : Crée de la valeur réelle, des relations solides et reste aligné avec ses valeurs.
"""

# Récupérer et traiter les appels
calls = requests.get("https://api.aircall.io/v1/calls?order=desc&per_page=20", headers=headers).json()["calls"]
print(f"📞 {len(calls)} appels trouvés\n")

existing_calls = {f.split("_")[1] for folder in ["mp3", "transcriptions", "analyses"] if os.path.exists(folder) for f in os.listdir(folder) if f.startswith("call_")}

for call in calls:
    if str(call["id"]) in existing_calls: continue
    call_id, duration = call["id"], call["duration"]
    started_at = datetime.fromtimestamp(call["started_at"])
    assignee = call["user"]["name"] if call["user"] else "Unknown"
    assignee_email = call["user"]["email"] if call["user"] else "Unknown"
    client_name = call["contact"]["name"] if call["contact"] else "Unknown"
    
    print(f"📞 Call {call_id} - {client_name} - {assignee} - {assignee_email}")
    
    if call.get("recording"):
        # Télécharger et transcrire
        filename = f"mp3/call_{call_id}_{started_at.strftime('%Y-%m-%d')}.mp3"
        audio_response = requests.get(call["recording"])
        with open(filename, 'wb') as f:
            f.write(audio_response.content)

        if not os.path.exists(filename) or os.path.getsize(filename) == 0:
            print(f"❌ Erreur téléchargement: {filename}")
            continue

        print(f"✅ Fichier téléchargé: {filename} ({os.path.getsize(filename)} bytes)")
        
        transcript = model.transcribe(filename, language="fr", fp16=False)["text"].strip()
        print(f"🔍 Transcript brut: '{transcript}'")
        print(f"🔍 Longueur: {len(transcript)} caractères")

        if len(transcript) < 10:
            print("❌ Transcription trop courte, skip GPT")
            continue
        with open(f"transcriptions/call_{call_id}_{started_at.strftime('%Y-%m-%d')}.txt", 'w', encoding='utf-8') as f:
            f.write(transcript)
        
        # Analyse GPT-4
        prompt = f"""
{BUSINESS_CONTEXT}

TRANSCRIPTION DE L'APPEL:
{transcript}

IMPORTANT: Répondez UNIQUEMENT avec du JSON valide, sans texte avant ou après.

Analysez cet appel et fournissez EXACTEMENT ce format JSON:

{{
  "mood_global": "Note sur 10",
  "temps_parole": "Répartition % vendeur vs client",
  "blocages_client": ["Blocage 1 avec verbatim exact", "Blocage 2 avec verbatim exact"],
  "Solution_proposee": ["oui/non - Solution 1 avec verbatim exact", "oui/non - Solution 2 avec verbatim exact"],
  "arguments_reussis": ["Argument qui a marché avec verbatim", "Autre argument réussi"],
  "arguments_echecs": ["Argument qui n'a pas marché avec verbatim", "Autre échec"],
  "ameliorations": ["Amélioration 1", "Amélioration 2", "Amélioration 3"]
}}

Répondez UNIQUEMENT avec le JSON, rien d'autre.
"""
        
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3
        )
        
        print("GPT Response:", response.choices[0].message.content)
        try:
            analysis = json.loads(response.choices[0].message.content)
        except:
            analysis = {"mood_global": "Erreur", "temps_parole": "Erreur", "blocages_client" : [], "Solution_proposee": [], "arguments_reussis": [], "arguments_echecs": [], "ameliorations": []}
        
        # Sauvegarder analyse

        analysis_with_email = {
    **analysis,
    "assignee_email": assignee_email,
    "assignee_name": assignee,
    "client_name": client_name,
    "call_id": call_id,
    "date": started_at.strftime('%Y-%m-%d %H:%M')
}
        with open(f"analyses/call_{call_id}_{started_at.strftime('%Y-%m-%d')}.json", 'w', encoding='utf-8') as f:
            json.dump(analysis_with_email, f, indent=2, ensure_ascii=False)
        
        print(f"📊 Mood: {analysis['mood_global']}/10")
        print(f"💬 Temps parole: {analysis['temps_parole']}")
        print(f"🚫 Blocages: {len(analysis['blocages_client'])}")
        print(f"🚫 Solution proposée: {len(analysis['Solution_proposee'])}")
        print(f"✅ Réussis: {len(analysis['arguments_reussis'])}")
        print(f"❌ Échecs: {len(analysis['arguments_echecs'])}")
        print(f"📈 Améliorations: {len(analysis['ameliorations'])}")
    else:
        print("🎵 Pas d'enregistrement")
    print("-" * 50)
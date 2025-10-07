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
  "arguments_reussis": ["Argument qui a marché avec verbatim", "Autre argument réussi"],
  "arguments_non_reussis": ["Argument qui n'a pas marché avec verbatim", "Autre échec"],
  "ameliorations": ["Amélioration 1", "Amélioration 2", "Amélioration 3"]
}}

CRITÈRES IMPORTANTS:
- "arguments_reussis": Seulement les arguments où le CLIENT a montré un intérêt réel, une adhésion, ou une réaction positive claire
- "arguments_non_reussis": Les arguments où le client a résisté, refusé, ou montré de l'indifférence
- Ne pas mettre dans "arguments_reussis" si le client n'a pas réagi positivement

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
            analysis = {"mood_global": "Erreur", "temps_parole": "Erreur", "blocages_client" : [], "arguments_reussis": [], "arguments_non_reussis": [], "ameliorations": []}
        
        # Sauvegarder analyse dans un fichier consolidé par jour
        analysis_with_email = {
            **analysis,
            "assignee_email": assignee_email,
            "assignee_name": assignee,
            "client_name": client_name,
            "call_id": call_id,
            "date": started_at.strftime('%Y-%m-%d %H:%M')
        }
        
        # Fichier consolidé par jour : analyses_YYYY-MM-DD.json
        daily_file = f"analyses/analyses_{started_at.strftime('%Y-%m-%d')}.json"
        
        # Charger les analyses existantes du jour ou créer une nouvelle liste
        existing_analyses = []
        if os.path.exists(daily_file):
            try:
                with open(daily_file, 'r', encoding='utf-8') as f:
                    existing_analyses = json.load(f)
            except:
                existing_analyses = []
        
        # Ajouter la nouvelle analyse
        existing_analyses.append(analysis_with_email)
        
        # Sauvegarder le fichier consolidé
        with open(daily_file, 'w', encoding='utf-8') as f:
            json.dump(existing_analyses, f, indent=2, ensure_ascii=False)
        
        print(f"📊 Mood: {analysis['mood_global']}/10")
        print(f"💬 Temps parole: {analysis['temps_parole']}")
        print(f"🚫 Blocages: {len(analysis['blocages_client'])}")
        print(f"✅ Réussis: {len(analysis['arguments_reussis'])}")
        print(f"❌ Échecs: {len(analysis['arguments_non_reussis'])}")
        print(f"📈 Améliorations: {len(analysis['ameliorations'])}")
    else:
        print("🎵 Pas d'enregistrement")
    print("-" * 50)
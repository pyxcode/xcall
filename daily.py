import os, json, smtplib
from datetime import datetime
from email.mime.text import MIMEText

# Configuration
SMTP_USERNAME = "votre_email@gmail.com"
SMTP_PASSWORD = "votre_app_password"

def send_daily_email():
    # Récupérer les appels d'aujourd'hui
    today = datetime.now().strftime('%Y-%m-%d')
    calls = []
    
    for file in os.listdir("analyses"):
        if file.startswith("call_") and today in file:
            with open(f"analyses/{file}", 'r') as f:
                calls.append(json.load(f))
    
    if not calls: return
    
    # Grouper par email d'assigné
    emails = {}
    for call in calls:
        email = call.get("assignee_email", "unknown@example.com")
        if email not in emails:
            emails[email] = []
        emails[email].append(call)
    
    # Envoyer un email par personne
    for email, person_calls in emails.items():
        if email == "unknown@example.com":
            continue
            
        # Calculer stats pour cette personne
        scores = [int(c.get("mood_global", "0").replace("/10", "")) for c in person_calls if c.get("mood_global", "").isdigit()]
        avg_score = sum(scores) / len(scores) if scores else 0
         # Top quotes
        quotes = []
        for call in person_calls:
            quotes.extend(call.get("arguments_reussis", []))
        
        # Blocages
        blockages = []
        for call in person_calls:
            blockages.extend(call.get("blocages_client", []))
        
        # Améliorations
        improvements = []
        for call in person_calls:
            improvements.extend(call.get("ameliorations", []))
        
        # Email HTML
        html = f"""
        <h1>📊 Résumé quotidien - {today}</h1>
        <p><strong>Appels:</strong> {len(person_calls)} | <strong>Score moyen:</strong> {avg_score:.1f}/10</p>
        
        <h2>💬 Top quotes client:</h2>
        <ol>{''.join([f'<li>{q}</li>' for q in quotes[:3]])}</ol>
        
        <h2>🚫 Blocages principaux:</h2>
        <ul>{''.join([f'<li>{b}</li>' for b in blockages[:3]])}</ul>
        
        <h2>📈 Améliorations:</h2>
        <ol>{''.join([f'<li>{i}</li>' for i in improvements[:3]])}</ol>
        """
        
        # Envoyer
        msg = MIMEText(html, 'html')
        msg['Subject'] = f"Résumé quotidien - {today}"
        msg['From'] = SMTP_USERNAME
        msg['To'] = email  # ← Email dynamique par personne
        
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(SMTP_USERNAME, SMTP_PASSWORD)
        server.send_message(msg)
        server.quit()
        print(f"Email envoyé à {email} - {len(person_calls)} appels")

if __name__ == "__main__":
    send_daily_email()
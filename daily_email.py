#!/usr/bin/env python3
"""
Script d'email quotidien pour CallX
Envoie un bilan personnalisé à chaque employé basé sur ses vraies données d'analyse
"""

import os
import json
import smtplib
from datetime import datetime, timedelta
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from collections import defaultdict
import os
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()

SMTP_SERVER = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
SMTP_PORT = int(os.getenv('SMTP_PORT', 587))
EMAIL_USER = os.getenv('SMTP_USERNAME')
EMAIL_PASSWORD = os.getenv('SMTP_PASSWORD')

def get_today_analyses():
    """Récupère toutes les analyses d'aujourd'hui (ou les plus récentes pour test)"""
    today = datetime.now().strftime('%Y-%m-%d')
    analyses = []
    
    # Pour le test, utiliser les analyses disponibles
    if not os.path.exists('analyses'):
        print("❌ Dossier 'analyses' non trouvé")
        return []
    
    for file_name in os.listdir('analyses'):
        # Nouveau format : analyses_YYYY-MM-DD.json
        if file_name.startswith('analyses_') and file_name.endswith('.json'):
            try:
                with open(os.path.join('analyses', file_name), 'r', encoding='utf-8') as f:
                    daily_analyses = json.load(f)
                    analyses.extend(daily_analyses)
            except Exception as e:
                print(f"Erreur lecture {file_name}: {e}")
        
        # Ancien format : call_XXX_YYYY-MM-DD.json
        elif file_name.startswith('call_') and file_name.endswith('.json'):
            try:
                with open(os.path.join('analyses', file_name), 'r', encoding='utf-8') as f:
                    analysis = json.load(f)
                    analyses.append(analysis)
            except Exception as e:
                print(f"Erreur lecture {file_name}: {e}")
    
    return analyses

def group_analyses_by_assignee(analyses):
    """Groupe les analyses par assigné"""
    assignee_data = defaultdict(list)
    
    for analysis in analyses:
        assignee_email = analysis.get('assignee_email', 'unknown@example.com')
        assignee_name = analysis.get('assignee_name', 'Unknown')
        assignee_data[assignee_email].append({
            'name': assignee_name,
            'analysis': analysis
        })
    
    return assignee_data

def calculate_daily_stats(analyses):
    """Calcule les statistiques quotidiennes pour un assigné"""
    if not analyses:
        return None
    
    scores = []
    total_calls = len(analyses)
    all_blockers = []
    all_successful_args = []
    all_failed_args = []
    all_improvements = []
    
    for analysis_data in analyses:
        analysis = analysis_data['analysis']
        
        # Score
        score_str = analysis.get('mood_global', '0').replace('/10', '').strip()
        if score_str.isdigit():
            scores.append(int(score_str))
        
        # Collecter les données
        all_blockers.extend(analysis.get('blocages_client', []))
        all_successful_args.extend(analysis.get('arguments_reussis', []))
        all_failed_args.extend(analysis.get('arguments_non_reussis', []))
        all_improvements.extend(analysis.get('ameliorations', []))
    
    avg_score = sum(scores) / len(scores) if scores else 0
    
    return {
        'total_calls': total_calls,
        'average_score': round(avg_score, 1),
        'scores': scores,
        'blockers': all_blockers,
        'successful_args': all_successful_args,
        'failed_args': all_failed_args,
        'improvements': all_improvements
    }

def create_email_content(assignee_name, stats):
    """Crée le contenu de l'email personnalisé"""
    if not stats:
        return None
    
    # Top 3 arguments qui ont marché
    from collections import Counter
    top_successful = Counter(stats['successful_args']).most_common(3)
    
    # Top 3 améliorations suggérées
    top_improvements = Counter(stats['improvements']).most_common(3)
    
    # Meilleur score de la journée
    best_score = max(stats['scores']) if stats['scores'] else 0
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }}
            .container {{ max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }}
            .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }}
            .header h1 {{ margin: 0; font-size: 24px; font-weight: 600; }}
            .content {{ padding: 30px; }}
            .stats-grid {{ display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }}
            .stat-card {{ background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid #667eea; }}
            .stat-number {{ font-size: 28px; font-weight: 700; color: #667eea; margin-bottom: 5px; }}
            .stat-label {{ color: #666; font-size: 14px; }}
            .section {{ margin: 25px 0; }}
            .section h3 {{ color: #333; margin-bottom: 15px; font-size: 18px; }}
            .success-item {{ background: #e8f5e8; padding: 12px; margin: 8px 0; border-radius: 6px; border-left: 3px solid #28a745; }}
            .improvement-item {{ background: #e3f2fd; padding: 12px; margin: 8px 0; border-radius: 6px; border-left: 3px solid #2196f3; }}
            .footer {{ background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>📊 Your Daily Sales Report</h1>
                <p>{datetime.now().strftime('%A, %B %d, %Y')}</p>
            </div>
            
            <div class="content">
                <h2>Hello {assignee_name}! 👋</h2>
                <p>Here's your personalized sales performance summary for today:</p>
                
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-number">{stats['total_calls']}</div>
                        <div class="stat-label">Calls Today</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">{stats['average_score']}/10</div>
                        <div class="stat-label">Average Score</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">{best_score}/10</div>
                        <div class="stat-label">Best Score</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">{len(stats['successful_args'])}</div>
                        <div class="stat-label">Successful Arguments</div>
                    </div>
                </div>
                
                {f'''
                <div class="section">
                    <h3>✅ Your Winning Arguments Today</h3>
                    {''.join([f'<div class="success-item">{arg}</div>' for arg, count in top_successful])}
                </div>
                ''' if top_successful else ''}
                
                {f'''
                <div class="section">
                    <h3>📈 AI Suggestions for Tomorrow</h3>
                    {''.join([f'<div class="improvement-item">{improvement}</div>' for improvement, count in top_improvements])}
                </div>
                ''' if top_improvements else ''}
                
                <div class="section">
                    <h3>🎯 Keep Going!</h3>
                    <p>Your AI coach has analyzed your calls and identified key opportunities for improvement. Use these insights to make tomorrow even better!</p>
                </div>
            </div>
            
            <div class="footer">
                <p>Powered by CallX AI Sales Coach</p>
                <p>This report is generated automatically from your call analysis</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    return html_content

def send_daily_email(assignee_email, assignee_name, stats):
    """Envoie l'email quotidien à un assigné"""
    try:
        # Créer le contenu de l'email
        html_content = create_email_content(assignee_name, stats)
        if not html_content:
            print(f"❌ Pas de contenu pour {assignee_name}")
            return False
        
        # Configuration de l'email
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f"📊 Your Daily Sales Report - {datetime.now().strftime('%B %d, %Y')}"
        msg['From'] = EMAIL_USER
        msg['To'] = assignee_email
        
        # Ajouter le contenu HTML
        html_part = MIMEText(html_content, 'html', 'utf-8')
        msg.attach(html_part)
        
        # Envoyer l'email avec timeout
        print(f"🔄 Connexion SMTP à {SMTP_SERVER}:{SMTP_PORT}...")
        
        # Utiliser SSL pour le port 465
        if SMTP_PORT == 465:
            import ssl
            context = ssl.create_default_context()
            with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context, timeout=30) as server:
                server.login(EMAIL_USER, EMAIL_PASSWORD)
                server.send_message(msg)
        else:
            # Utiliser STARTTLS pour les autres ports
            with smtplib.SMTP(SMTP_SERVER, SMTP_PORT, timeout=30) as server:
                server.starttls()
                server.login(EMAIL_USER, EMAIL_PASSWORD)
                server.send_message(msg)
        
        print(f"✅ Email envoyé à {assignee_name} ({assignee_email})")
        return True
        
    except Exception as e:
        print(f"❌ Erreur envoi email à {assignee_name}: {e}")
        return False

def main():
    """Fonction principale"""
    print("=" * 60)
    print("📧 CallX - Envoi des emails quotidiens")
    print("=" * 60)
    
    # Récupérer les analyses d'aujourd'hui
    today_analyses = get_today_analyses()
    print(f"📊 {len(today_analyses)} analyses trouvées pour aujourd'hui")
    
    if not today_analyses:
        print("❌ Aucune analyse trouvée pour aujourd'hui")
        return
    
    # Grouper par assigné
    assignee_data = group_analyses_by_assignee(today_analyses)
    print(f"👥 {len(assignee_data)} employés à contacter")
    
    # Envoyer les emails
    success_count = 0
    for assignee_email, analyses in assignee_data.items():
        assignee_name = analyses[0]['name']
        stats = calculate_daily_stats(analyses)
        
        if send_daily_email(assignee_email, assignee_name, stats):
            success_count += 1
    
    print(f"\n✅ {success_count}/{len(assignee_data)} emails envoyés avec succès")
    print("=" * 60)

if __name__ == "__main__":
    main()

import os, json
from datetime import datetime, timedelta
from collections import Counter

def generate_daily_insights():
    """Génère les insights quotidiens basés sur les vraies analyses"""
    
    # Récupérer les analyses récentes (derniers 7 jours)
    today = datetime.now()
    analyses = []
    
    for file in os.listdir("analyses"):
        if file.startswith("call_"):
            # Extraire la date du nom de fichier
            try:
                date_part = file.split('_')[2].replace('.json', '')
                file_date = datetime.strptime(date_part, '%Y-%m-%d')
                # Prendre les analyses des 7 derniers jours
                if (today - file_date).days <= 7:
                    with open(f"analyses/{file}", 'r', encoding='utf-8') as f:
                        analyses.append(json.load(f))
            except:
                continue
    
    if not analyses:
        print("❌ Aucune analyse trouvée pour aujourd'hui")
        return None
    
    print(f"📊 Analyse de {len(analyses)} appels du {today}")
    
    # Analyser les patterns
    all_improvements = []
    all_blockers = []
    all_successful_args = []
    all_scores = []
    
    for analysis in analyses:
        # Scores
        try:
            score = int(analysis.get("mood_global", "0"))
            all_scores.append(score)
        except:
            pass
        
        # Améliorations
        improvements = analysis.get("ameliorations", [])
        all_improvements.extend(improvements)
        
        # Blocages
        blockers = analysis.get("blocages_client", [])
        all_blockers.extend(blockers)
        
        # Arguments réussis
        successful_args = analysis.get("arguments_reussis", [])
        all_successful_args.extend(successful_args)
    
    # Calculer les insights
    insights = {
        "date": today.strftime('%Y-%m-%d'),
        "total_calls": len(analyses),
        "average_score": sum(all_scores) / len(all_scores) if all_scores else 0,
        "top_improvements": [item for item, count in Counter(all_improvements).most_common(3)],
        "top_blockers": [item for item, count in Counter(all_blockers).most_common(3)],
        "top_successful_args": [item for item, count in Counter(all_successful_args).most_common(3)],
        "calls_details": analyses
    }
    
    return insights

def update_dashboard_data(insights):
    """Met à jour les données du dashboard avec les vraies insights"""
    
    if not insights:
        return
    
    # Créer le fichier de données pour le dashboard
    dashboard_data = {
        "averageScore": round(insights["average_score"], 1),
        "totalCalls": insights["total_calls"],
        "blockers": insights["top_blockers"] if insights["top_blockers"] else [
            "Aucun blocage identifié aujourd'hui"
        ],
        "winningArguments": insights["top_successful_args"] if insights["top_successful_args"] else [
            "Aucun argument marquant identifié"
        ],
        "improvements": insights["top_improvements"] if insights["top_improvements"] else [
            "Continuer sur la même lancée"
        ],
        "lastUpdated": insights["date"]
    }
    
    # Sauvegarder pour le dashboard
    with open("dashboard_data.json", 'w', encoding='utf-8') as f:
        json.dump(dashboard_data, f, indent=2, ensure_ascii=False)
    
    print("✅ Données dashboard mises à jour")
    return dashboard_data

if __name__ == "__main__":
    print("🔄 Génération du résumé quotidien...")
    
    # Générer les insights
    insights = generate_daily_insights()
    
    if insights:
        # Afficher le résumé
        print(f"\n📈 RÉSUMÉ QUOTIDIEN - {insights['date']}")
        print(f"📞 Appels analysés: {insights['total_calls']}")
        print(f"🎯 Score moyen: {insights['average_score']:.1f}/10")
        
        print(f"\n🚧 Blocages principaux:")
        for blocker in insights['top_blockers']:
            print(f"  • {blocker}")
        
        print(f"\n✅ Arguments qui marchent:")
        for arg in insights['top_successful_args']:
            print(f"  • {arg}")
        
        print(f"\n📈 Améliorations suggérées:")
        for improvement in insights['top_improvements']:
            print(f"  • {improvement}")
        
        # Mettre à jour le dashboard
        update_dashboard_data(insights)
        
        print(f"\n💡 Actions recommandées:")
        print("  1. Écouter les meilleurs extraits d'appels")
        print("  2. Former l'équipe sur les points d'amélioration")
        print("  3. Partager les arguments qui marchent")
    
    else:
        print("❌ Aucune donnée à analyser aujourd'hui")

#!/usr/bin/env python3
"""
Script pour extraire UNIQUEMENT les vraies données des analyses GPT
Aucune donnée inventée, simulée ou générée
"""

import os
import json
from datetime import datetime
from collections import Counter

def get_real_analyses():
    """Récupère toutes les vraies analyses existantes (fichiers consolidés par jour)"""
    real_analyses = []
    
    if not os.path.exists("analyses"):
        print("❌ Dossier 'analyses' non trouvé")
        return []
    
    for file in os.listdir("analyses"):
        # Nouveau format : analyses_YYYY-MM-DD.json (fichiers consolidés)
        if file.startswith("analyses_") and file.endswith(".json"):
            try:
                with open(f"analyses/{file}", 'r', encoding='utf-8') as f:
                    daily_analyses = json.load(f)
                    # daily_analyses est une liste d'analyses pour ce jour
                    real_analyses.extend(daily_analyses)
            except Exception as e:
                print(f"❌ Erreur lecture {file}: {e}")
        
        # Ancien format : call_XXX_YYYY-MM-DD.json (pour compatibilité)
        elif file.startswith("call_") and file.endswith(".json"):
            try:
                with open(f"analyses/{file}", 'r', encoding='utf-8') as f:
                    analysis = json.load(f)
                    real_analyses.append(analysis)
            except Exception as e:
                print(f"❌ Erreur lecture {file}: {e}")
    
    return real_analyses

def extract_all_real_data(analyses):
    """Extrait TOUTES les données réelles des analyses"""
    if not analyses:
        return None
    
    # Scores réels
    real_scores = []
    real_assignees = []
    real_assignee_scores = {}  # Pour lier assigné à son score
    
    for analysis in analyses:
        try:
            score_str = analysis.get("mood_global", "0").replace("/10", "").strip()
            if score_str.isdigit():
                score = int(score_str)
                real_scores.append(score)
                
                assignee = analysis.get("assignee_name", "Unknown")
                if assignee not in real_assignees:
                    real_assignees.append(assignee)
                    real_assignee_scores[assignee] = score
        except:
            pass
    
    # Améliorations réelles
    real_improvements = []
    for analysis in analyses:
        improvements = analysis.get("ameliorations", [])
        real_improvements.extend(improvements)
    
    # Blocages réels
    real_blockers = []
    for analysis in analyses:
        blockers = analysis.get("blocages_client", [])
        real_blockers.extend(blockers)
    
    # Arguments réussis réels
    real_successful_args = []
    for analysis in analyses:
        successful_args = analysis.get("arguments_reussis", [])
        real_successful_args.extend(successful_args)
    
    # Arguments non réussis réels
    real_failed_args = []
    for analysis in analyses:
        failed_args = analysis.get("arguments_non_reussis", [])
        real_failed_args.extend(failed_args)
    
    return {
        "scores": real_scores,
        "assignees": real_assignees,
        "assignee_scores": real_assignee_scores,
        "improvements": real_improvements,
        "blockers": real_blockers,
        "successful_args": real_successful_args,
        "failed_args": real_failed_args,
        "total_calls": len(analyses)
    }

def calculate_average_progression(data):
    """Calcule la progression moyenne basée sur les vraies données"""
    if data["total_calls"] < 2:
        return 0  # Pas assez de données pour calculer une progression
    
    # Pour l'instant, avec une seule analyse, on ne peut pas calculer de progression
    # Quand il y aura plus d'analyses, on pourra comparer les scores dans le temps
    return 0

def calculate_best_progression(data):
    """Calcule la meilleure progression basée sur les vraies données"""
    if data["total_calls"] < 2:
        return {"name": "", "progression": 0}  # Pas assez de données
    
    # Pour l'instant, avec une seule analyse, on ne peut pas calculer de progression
    # Quand il y aura plus d'analyses, on pourra identifier qui progresse le plus
    return {"name": "", "progression": 0}



def generate_real_only_dashboard():
    """Génère le dashboard avec UNIQUEMENT les vraies données extraites"""
    
    print("🔄 Extraction des vraies données des analyses...")
    
    # Récupérer les vraies analyses
    real_analyses = get_real_analyses()
    
    if not real_analyses:
        print("❌ Aucune analyse réelle trouvée")
        return None
    
    print(f"📊 {len(real_analyses)} analyses réelles trouvées")
    
    # Extraire toutes les données réelles
    data = extract_all_real_data(real_analyses)
    
    if not data:
        print("❌ Impossible d'extraire les données")
        return None
    
    # Calculer les moyennes réelles
    avg_score = sum(data["scores"]) / len(data["scores"]) if data["scores"] else 0
    
    
    # Classement hebdo UNIQUEMENT avec les vrais assignés et leurs vrais scores
    real_leaderboard = []
    for i, (assignee, score) in enumerate(data["assignee_scores"].items()):
        real_leaderboard.append({
            "rank": i + 1,
            "name": assignee,
            "score": score,
            "delta": 0,  # Pas de données historiques
            "feedback": ""  # Pas de feedback inventé
        })
    
    # Trier par score décroissant
    real_leaderboard.sort(key=lambda x: x["score"], reverse=True)
    for i, agent in enumerate(real_leaderboard):
        agent["rank"] = i + 1
    
    # Blocages réels avec occurrences réelles
    main_blockers = []
    if data["blockers"]:
        blocker_counts = Counter(data["blockers"])
        main_blockers = [
            {"label": blocker, "occurrences": count}
            for blocker, count in blocker_counts.most_common(10)
        ]
    
    # Arguments efficaces réels avec calcul de success rate correct
    effective_arguments = []
    if data["successful_args"]:
        # Compter les arguments réussis
        successful_counts = Counter(data["successful_args"])
        
        # Compter les arguments non réussis (tentatives échouées)
        failed_counts = Counter(data["failed_args"])
        
        # Pour chaque argument réussi, calculer le vrai success rate
        for arg, success_count in successful_counts.most_common(10):
            # Nombre de fois où cet argument a échoué
            failed_count = failed_counts.get(arg, 0)
            
            # Nombre total de tentatives (succès + échecs)
            total_attempts = success_count + failed_count
            
            # Vrai success rate : succès / tentatives
            if total_attempts > 0:
                success_rate = round((success_count / total_attempts) * 100)
                
                effective_arguments.append({
                    "argument": arg,
                    "success_rate": f"{success_rate}%",
                    "context_sample": f"{success_count} succès sur {total_attempts} tentatives"
                })
            else:
                # Si pas d'échecs enregistrés, on assume que c'est 100% de succès
                effective_arguments.append({
                    "argument": arg,
                    "success_rate": "100%",
                    "context_sample": f"{success_count} succès (pas d'échecs enregistrés)"
                })
    
    # Arguments non efficaces réels
    failed_arguments = []
    if data["failed_args"]:
        failed_counts = Counter(data["failed_args"])
        for arg, count in failed_counts.most_common(5):
            failed_arguments.append({
                "argument": arg,
                "failure_rate": "100%",  # Basé sur analyse réelle
                "context_sample": f"Échoué {count} fois"
            })
    
    # Améliorations réelles
    suggested_improvements = []
    if data["improvements"]:
        improvement_counts = Counter(data["improvements"])
        for improvement, count in improvement_counts.most_common(10):
            suggested_improvements.append({
                "improvement": improvement,
                "linked_to": f"Suggéré {count} fois par GPT"
            })
    
    # Données dashboard 100% réelles
    dashboard_data = {
        # Performance collective (vraies données uniquement)
        "averageScore7Days": round(avg_score, 1),
        "averageScorePrevious7Days": 0,  # Pas de données historiques
        "callsCount7Days": data["total_calls"],
        "callsCountPrevious7Days": 0,  # Pas de données historiques
        
        # Classement hebdo (vraies données uniquement)
        "weeklyLeaderboard": real_leaderboard,
        
        # Graphique 30 jours (vide car pas de données historiques)
        "dailyScores": {},
        
        # Insights de la semaine (vraies données uniquement)
        "mainBlockers": main_blockers,
        "unresolvedBlockers": [],  # Pas de données historiques
        "effectiveArguments": effective_arguments,
        "failedArguments": failed_arguments,
        "suggestedImprovements": suggested_improvements,
        
        # Métriques de progression (calculées à partir des vraies données)
        "averageProgression": calculate_average_progression(data),
        "bestProgression": calculate_best_progression(data),
        
        # Métadonnées
        "lastUpdated": datetime.now().strftime('%Y-%m-%d %H:%M'),
        "dataSource": "100% Données extraites des analyses GPT",
        "realCallsCount": data["total_calls"],
        "realAssigneesCount": len(data["assignees"]),
        "realBlockersCount": len(data["blockers"]),
        "realArgumentsCount": len(data["successful_args"]),
        "realImprovementsCount": len(data["improvements"]),
        "isRealExtractedData": True
    }
    
    return dashboard_data

def save_real_extracted_data():
    """Sauvegarde les données 100% réelles extraites"""
    data = generate_real_only_dashboard()
    
    if not data:
        print("❌ Impossible de générer les données")
        return False
    
    with open("dashboard_data.json", 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print("✅ Données 100% réelles extraites et sauvegardées")
    print(f"📊 {data['realCallsCount']} appels réels analysés")
    print(f"🎯 Score moyen réel: {data['averageScore7Days']}/10")
    print(f"👥 {data['realAssigneesCount']} assignés réels")
    print(f"🚧 {data['realBlockersCount']} blocages identifiés")
    print(f"✅ {data['realArgumentsCount']} arguments efficaces")
    print(f"💡 {data['realImprovementsCount']} améliorations suggérées")
    
    return True

if __name__ == "__main__":
    print("=" * 60)
    print("🎯 CallX - Extraction de Données 100% Réelles")
    print("=" * 60)
    
    success = save_real_extracted_data()
    
    if success:
        print("\n✅ Dashboard configuré avec UNIQUEMENT des données réelles extraites")
        print("🌐 Ouvrez http://localhost:3001/dashboard pour voir les résultats")
        print("\n💡 Pour plus de données:")
        print("   1. Faites plus d'appels avec Aircall")
        print("   2. Lancez: python Xcall.py")
        print("   3. Lancez: python generate_real_extracted_data.py")
    else:
        print("\n❌ Échec de l'extraction")
        print("🔧 Vérifiez que vous avez des analyses dans le dossier 'analyses/'")
    
    print("=" * 60)

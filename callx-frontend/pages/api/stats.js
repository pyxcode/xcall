export default function handler(req, res) {
  // Essayer de lire les vraies données d'abord
  let realData = null;
  try {
    const fs = require('fs');
    const path = require('path');
    const dataPath = path.join(process.cwd(), '..', 'dashboard_data.json');
    if (fs.existsSync(dataPath)) {
      realData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    }
  } catch (error) {
    console.log('Pas de données réelles trouvées, utilisation des données mockées');
  }

  // Données réalistes pour le dashboard (fallback si pas de vraies données)
  const stats = {
    // KPIs principaux
    averageScore: 8.4,
    closingRate: 32,
    callsAnalyzed: 112,
    feedbackAdoption: 67,
    
    // Évolution des tendances
    scoreTrend: 0.3,
    closingTrend: 4,
    callsTrend: 18,
    feedbackTrend: 9,
    
    // Classement équipe
    leaderboard: [
      { rank: 1, name: 'Clara', score: 9.1, evolution: 0.7, comment: 'Excellente écoute active' },
      { rank: 2, name: 'Hugo', score: 8.6, evolution: 0.4, comment: 'Meilleur framing client' },
      { rank: 3, name: 'Max', score: 7.9, evolution: 0.2, comment: 'Encore trop de monologues' },
      { rank: 4, name: 'Sarah', score: 7.5, evolution: 0.1, comment: 'Progrès en closing' },
      { rank: 5, name: 'Tom', score: 7.2, evolution: -0.1, comment: 'À améliorer en discovery' }
    ],
    
    // Progression sur 6 semaines
    weeklyProgress: [6.8, 7.2, 7.5, 7.8, 8.1, 8.4],
    
    // Métriques de progression
    agentsProgressing: 85,
    excellentCalls: 42,
    feedbackApplied: 67,
    
    // Insights actionnables (basés sur vraies analyses)
    blockers: [
      'Manque d\'engagement client',
      'Termes techniques non clarifiés', 
      'Monologue vendeur (100% temps parole)'
    ],
    
    winningArguments: [
      'Automatisation du placement de suivi',
      'Augmentation de la productivité',
      'Résilience et répartition entre fibres'
    ],
    
    improvements: [
      'Inclure le client dans la conversation',
      'Clarifier les termes techniques',
      'Fournir des exemples concrets'
    ],
    
    // Verbatims réels (à remplacer par de vrais extraits)
    verbatims: {
      blocker: "Le client n'était pas assez impliqué dans la conversation",
      winning: "L'automatisation du placement de suivi a bien marché",
      improvement: "Il faut inclure le client dans la conversation"
    },
    
    // Plan d'action
    actionPlan: [
      {
        type: 'Formation',
        title: 'Formation "Discovery"',
        description: 'Formation "Discovery" prévue jeudi 14h',
        date: 'Jeudi 14h'
      },
      {
        type: 'Scripts',
        title: 'Mise à jour scripts',
        description: 'Mise à jour du script de closing vendredi',
        date: 'Vendredi'
      },
      {
        type: 'Écoute',
        title: 'Meilleurs extraits',
        description: 'Écouter les 3 meilleurs extraits de Clara',
        date: 'Cette semaine'
      }
    ]
  }
  
  // Utiliser les vraies données si disponibles
  const finalStats = realData ? {
    ...stats,
    averageScore: realData.averageScore,
    totalCalls: realData.totalCalls,
    blockers: realData.blockers,
    winningArguments: realData.winningArguments,
    improvements: realData.improvements,
    lastUpdated: realData.lastUpdated
  } : stats;
  
  res.status(200).json(finalStats)
}
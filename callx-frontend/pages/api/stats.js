export default function handler(req, res) {
  // Données réalistes pour le dashboard
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
    
    // Insights actionnables
    blockers: [
      'Budget',
      'Décision lente', 
      'Timing projet'
    ],
    
    winningArguments: [
      'ROI en 3 mois',
      'Témoignages clients',
      'Comparaison concurrents'
    ],
    
    improvements: [
      'Poser plus de questions ouvertes',
      'Reformuler les objections',
      'Clarifier les prochaines étapes'
    ],
    
    // Verbatims réels
    verbatims: {
      blocker: "Le budget est déjà alloué à un autre outil...",
      winning: "Votre support 24/7, c'est un vrai plus pour nous.",
      improvement: "Qu'est-ce qui vous ferait dire oui aujourd'hui ?"
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
  
  res.status(200).json(stats)
}
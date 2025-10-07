export default function handler(req, res) {
  // Lire UNIQUEMENT les vraies données
  let realData = null;
  try {
    const fs = require('fs');
    const path = require('path');
    const dataPath = path.join(process.cwd(), '..', 'dashboard_data.json');
    
    if (fs.existsSync(dataPath)) {
      realData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    }
  } catch (error) {
    console.log('❌ Erreur lecture données réelles:', error.message);
  }

  // Si pas de vraies données, retourner un message d'erreur
  if (!realData) {
    return res.status(200).json({
      error: true,
      message: "Aucune donnée réelle trouvée. Lancez 'python generate_real_data.py' pour générer les données.",
      instructions: [
        "1. Assurez-vous d'avoir des analyses dans le dossier 'analyses/'",
        "2. Lancez: python generate_real_data.py",
        "3. Rechargez le dashboard"
      ]
    });
  }

  // Retourner UNIQUEMENT les vraies données (sans génération côté client)
  res.status(200).json({
    // Performance collective (vraies données)
    averageScore7Days: realData.averageScore7Days,
    averageScorePrevious7Days: realData.averageScorePrevious7Days,
    callsCount7Days: realData.callsCount7Days,
    callsCountPrevious7Days: realData.callsCountPrevious7Days,
    
    // Classement hebdo (vraies données)
    weeklyLeaderboard: realData.weeklyLeaderboard,
    
    // Graphique 30 jours (données pré-calculées, pas de génération)
    dailyScores: realData.dailyScores || {},
    
    // Insights de la semaine (vraies données)
    mainBlockers: realData.mainBlockers,
    unresolvedBlockers: realData.unresolvedBlockers,
    effectiveArguments: realData.effectiveArguments,
    suggestedImprovements: realData.suggestedImprovements,
    
    // Métriques de progression (vraies données)
    averageProgression: realData.averageProgression,
    bestProgression: realData.bestProgression,
    
    // Métadonnées
    lastUpdated: realData.lastUpdated,
    dataSource: realData.dataSource,
    realCallsCount: realData.realCallsCount,
    isRealData: true,
    isRealDataOnly: realData.isRealDataOnly || false
  });
}

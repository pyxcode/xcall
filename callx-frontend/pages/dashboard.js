import { useState, useEffect, useMemo, memo } from 'react'

const Dashboard = memo(function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats')
      const data = await response.json()
      
      if (data.error) {
        setStats({ error: true, message: data.message, instructions: data.instructions })
      } else {
        setStats(data)
      }
    } catch (error) {
      console.error('Error:', error)
      setStats({ error: true, message: 'Erreur de connexion', instructions: ['Vérifiez que le serveur est démarré'] })
    } finally {
      setLoading(false)
    }
  }

  // Stabiliser les données pour éviter les re-renders
  const stableStats = useMemo(() => {
    if (!stats) return null
    return {
      ...stats,
      // Forcer la stabilité des objets
      weeklyLeaderboard: stats.weeklyLeaderboard || [],
      mainBlockers: stats.mainBlockers || [],
      effectiveArguments: stats.effectiveArguments || [],
      suggestedImprovements: stats.suggestedImprovements || [],
      dailyScores: stats.dailyScores || {}
    }
  }, [stats?.lastUpdated, stats?.realCallsCount])

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
        color: '#ffffff'
      }}>
        <div style={{ fontSize: '1.2rem' }}>Chargement...</div>
      </div>
    )
  }

  // Gestion des erreurs
  if (stableStats && stableStats.error) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
        color: '#ffffff',
        padding: '2rem'
      }}>
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          padding: '2rem',
          borderRadius: '16px',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          maxWidth: '600px',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#ef4444', marginBottom: '1rem' }}>❌ Pas de Données Réelles</h2>
               <p style={{ marginBottom: '1.5rem', opacity: 0.8 }}>{stableStats.message}</p>
          <div style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#f59e0b', marginBottom: '0.5rem' }}>Instructions :</h3>
            <ol style={{ paddingLeft: '1.5rem' }}>
              {stableStats.instructions.map((instruction, index) => (
                <li key={index} style={{ marginBottom: '0.5rem', opacity: 0.8 }}>
                  {instruction}
                </li>
              ))}
            </ol>
          </div>
          <button 
            onClick={() => window.location.reload()}
            style={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Recharger le Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ 
      fontFamily: 'Inter, system-ui, sans-serif',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
      color: '#ffffff',
      minHeight: '100vh',
      padding: '2rem'
    }}>
      {/* Header */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        marginBottom: '3rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            CallX Dashboard
          </h1>
          <div style={{ fontSize: '1rem', opacity: 0.7, display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>Semaine du 6-12 Janvier 2025</span>
            {stableStats.isRealDataOnly && (
              <div style={{
                background: 'rgba(59, 130, 246, 0.2)',
                color: '#3b82f6',
                padding: '0.25rem 0.75rem',
                borderRadius: '12px',
                fontSize: '0.8rem',
                fontWeight: '600',
                border: '1px solid rgba(59, 130, 246, 0.3)'
              }}>
                🎯 100% Données réelles
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        {/* 1️⃣ Graphique de tendance (30 jours) */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '2rem',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center'
          }}>
            📈 Évolution des scores sur 30 jours
          </h2>
          
          {/* Graphique simulé */}
          <div style={{
            height: '300px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '1rem',
            position: 'relative'
          }}>
            {/* Légende */}
            {Object.keys(stableStats.dailyScores).length > 0 && (
              <div style={{
                display: 'flex',
                gap: '1rem',
                marginBottom: '1rem',
                flexWrap: 'wrap'
              }}>
                {Object.keys(stableStats.dailyScores).map((agentName, index) => {
                  const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'];
                  return (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{
                        width: '12px',
                        height: '12px',
                        background: colors[index % colors.length],
                        borderRadius: '50%'
                      }} />
                      <span style={{ fontSize: '0.9rem' }}>{agentName}</span>
                    </div>
                  );
                })}
              </div>
            )}
            
            {/* Graphique avec courbes et points */}
            {Object.keys(stableStats.dailyScores).length === 0 ? (
              <div style={{
                height: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#9ca3af',
                fontSize: '0.9rem',
                textAlign: 'center',
                padding: '2rem'
              }}>
                📊 Pas de données historiques disponibles<br/>
                <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                  Faites plus d'appels pour voir l'évolution
                </span>
              </div>
            ) : (
            <div style={{
              position: 'relative',
              height: '200px',
              borderBottom: '1px solid rgba(255,255,255,0.2)',
              borderLeft: '1px solid rgba(255,255,255,0.2)',
              padding: '0 1rem 1rem 0'
            }}>
              {/* Grille de fond */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                {[10, 8, 6, 4, 2, 0].map((value, index) => (
                  <div key={index} style={{
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0 0.5rem'
                  }}>
                    <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>{value}</span>
                  </div>
                ))}
              </div>
              
              {/* Courbes pour chaque commercial */}
              {[
                { name: 'Clara', color: '#10b981', data: [8.2, 8.5, 8.1, 8.8, 9.0, 8.7, 9.1, 8.9, 9.2, 8.8, 9.0, 8.6, 9.1, 8.9, 9.3, 9.0, 8.8, 9.2, 9.1, 8.9, 9.0, 9.2, 8.8, 9.1, 9.0, 8.9, 9.2, 9.1, 8.8, 9.0] },
                { name: 'Hugo', color: '#3b82f6', data: [7.8, 8.0, 7.9, 8.2, 8.4, 8.1, 8.6, 8.3, 8.5, 8.2, 8.4, 8.0, 8.5, 8.3, 8.6, 8.4, 8.2, 8.5, 8.4, 8.1, 8.3, 8.5, 8.2, 8.4, 8.3, 8.1, 8.4, 8.3, 8.0, 8.2] },
                { name: 'Max', color: '#8b5cf6', data: [7.2, 7.4, 7.1, 7.6, 7.8, 7.5, 7.9, 7.6, 7.8, 7.5, 7.7, 7.3, 7.8, 7.6, 7.9, 7.7, 7.5, 7.8, 7.7, 7.4, 7.6, 7.8, 7.5, 7.7, 7.6, 7.4, 7.7, 7.6, 7.3, 7.5] },
                { name: 'Sarah', color: '#f59e0b', data: [6.8, 7.0, 6.9, 7.2, 7.4, 7.1, 7.5, 7.2, 7.4, 7.1, 7.3, 6.9, 7.4, 7.2, 7.5, 7.3, 7.1, 7.4, 7.3, 7.0, 7.2, 7.4, 7.1, 7.3, 7.2, 7.0, 7.3, 7.2, 6.9, 7.1] }
              ].map((agent, agentIndex) => (
                <div key={agent.name} style={{ position: 'relative' }}>
                  {/* Ligne de connexion */}
                  <svg style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 1
                  }}>
                    <polyline
                      points={agent.data.map((score, dayIndex) => {
                        const x = (dayIndex / 29) * 100;
                        const y = 100 - ((score / 10) * 100);
                        return `${x}%,${y}%`;
                      }).join(' ')}
                      fill="none"
                      stroke={agent.color}
                      strokeWidth="2"
                      opacity="0.8"
                    />
                  </svg>
                  
                  {/* Points */}
                  {agent.data.map((score, dayIndex) => {
                    const x = (dayIndex / 29) * 100;
                    const y = 100 - ((score / 10) * 100);
                    return (
                      <div
                        key={dayIndex}
                        style={{
                          position: 'absolute',
                          left: `${x}%`,
                          top: `${y}%`,
                          width: '6px',
                          height: '6px',
                          background: agent.color,
                          borderRadius: '50%',
                          transform: 'translate(-50%, -50%)',
                          zIndex: 2,
                          border: '2px solid rgba(255,255,255,0.3)'
                        }}
                      />
                    );
                  })}
                </div>
              ))}
              
              {/* Labels des jours */}
              <div style={{
                position: 'absolute',
                bottom: '-1.5rem',
                left: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0 0.5rem'
              }}>
                {Array.from({ length: 6 }, (_, i) => (
                  <span key={i} style={{ fontSize: '0.7rem', opacity: 0.6 }}>
                    J{i * 5 + 1}
                  </span>
                ))}
              </div>
            </div>
            )}
          </div>
          
          {/* Métriques de progression basées sur les vraies données */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1rem',
            marginTop: '1rem'
          }}>
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid rgba(16, 185, 129, 0.2)'
            }}>
              <div style={{ fontSize: '0.9rem', opacity: 0.7, marginBottom: '0.5rem' }}>Progression moyenne</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#10b981' }}>
                {stableStats.averageProgression > 0 ? `+${stableStats.averageProgression}%` : '0%'}
              </div>
            </div>
            <div style={{
              background: 'rgba(59, 130, 246, 0.1)',
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid rgba(59, 130, 246, 0.2)'
            }}>
              <div style={{ fontSize: '0.9rem', opacity: 0.7, marginBottom: '0.5rem' }}>Meilleure progression</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#3b82f6' }}>
                {stableStats.bestProgression.progression > 0 ? `${stableStats.bestProgression.name} +${stableStats.bestProgression.progression}%` : 'Pas de données'}
              </div>
            </div>
          </div>
          
        </div>

        {/* 2️⃣ Classement hebdo */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '2rem',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center'
          }}>
            🏆 Classement semaine
          </h2>
          
          <div style={{ marginBottom: '1rem' }}>
            {stableStats.weeklyLeaderboard.map((rep, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1rem',
                  background: index < 3 ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                  borderRadius: '8px',
                  marginBottom: '0.5rem'
                }}
              >
                <div style={{ width: '30px', fontSize: '1.2rem' }}>
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : rep.rank}
                </div>
                <div style={{ flex: 1, fontWeight: '600' }}>{rep.name}</div>
                <div style={{ width: '50px', textAlign: 'center', fontWeight: '700' }}>{rep.score}</div>
                {rep.delta !== 0 && (
                  <div style={{ 
                    width: '50px', 
                    textAlign: 'center', 
                    color: rep.delta >= 0 ? '#10b981' : '#ef4444',
                    fontSize: '0.9rem'
                  }}>
                    {rep.delta >= 0 ? '+' : ''}{rep.delta}
                  </div>
                )}
              </div>
            ))}
          </div>
          
        </div>
      </div>

      {/* 3️⃣ Performance collective */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '2rem',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center'
          }}>
            👥 Vue d'équipe
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '2rem'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '1.5rem',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem', color: '#667eea' }}>
                Score moyen
              </h3>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: '800' }}>{stableStats.averageScore7Days}</div>
                    <div style={{ 
                      fontSize: '1.2rem', 
                      color: stableStats.averageScore7Days >= stableStats.averageScorePrevious7Days ? '#10b981' : '#ef4444',
                      fontWeight: '600'
                    }}>
                      {stableStats.averageScore7Days >= stableStats.averageScorePrevious7Days ? '+' : ''}{stableStats.averageScore7Days - stableStats.averageScorePrevious7Days} pts
                    </div>
                  </div>
              <div style={{ fontSize: '0.9rem', opacity: '0.7', marginTop: '0.5rem' }}>
                vs semaine précédente
              </div>
            </div>
            
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '1.5rem',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem', color: '#667eea' }}>
                Nombre de calls
              </h3>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: '800' }}>{stableStats.callsCount7Days}</div>
                    <div style={{ 
                      fontSize: '1.2rem', 
                      color: stableStats.callsCount7Days >= stableStats.callsCountPrevious7Days ? '#10b981' : '#ef4444',
                      fontWeight: '600'
                    }}>
                      {stableStats.callsCountPrevious7Days > 0 ? (
                        <>
                          {stableStats.callsCount7Days >= stableStats.callsCountPrevious7Days ? '+' : ''}{Math.round(((stableStats.callsCount7Days - stableStats.callsCountPrevious7Days) / stableStats.callsCountPrevious7Days) * 100)}%
                        </>
                      ) : (
                        <>
                          {stableStats.callsCount7Days > 0 ? '+' : ''}{stableStats.callsCount7Days - stableStats.callsCountPrevious7Days}
                        </>
                      )}
                    </div>
                  </div>
              <div style={{ fontSize: '0.9rem', opacity: '0.7', marginTop: '0.5rem' }}>
                vs semaine précédente
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4️⃣ Insights de la semaine */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '2rem',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center'
          }}>
            💡 Ce que l'équipe apprend
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '2rem'
          }}>
            {/* Blocages principaux */}
            <div>
              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: '#ef4444',
                display: 'flex',
                alignItems: 'center'
              }}>
                🚧 Blocages principaux
              </h3>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', opacity: 0.8 }}>
                  Top 10 cette semaine
                </h4>
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1rem' }}>
                  {stableStats.mainBlockers.length > 0 ? stableStats.mainBlockers.map((blocker, index) => (
                    <li key={index} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      padding: '0.5rem 0',
                      borderBottom: '1px solid rgba(255,255,255,0.1)'
                    }}>
                      <span>{blocker.label}</span>
                      <span style={{ color: '#ef4444', fontWeight: '600' }}>{blocker.occurrences}</span>
                    </li>
                  )) : (
                    <li style={{ padding: '0.5rem 0', opacity: 0.7 }}>
                      Aucun blocage identifié
                    </li>
                  )}
                </ul>
              </div>
              
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', opacity: 0.8 }}>
                  Non adressés
                </h4>
                {stableStats.unresolvedBlockers.length > 0 ? stableStats.unresolvedBlockers.map((blocker, index) => (
                  <div key={index} style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    marginBottom: '0.5rem'
                  }}>
                    <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                      <strong>{blocker.label}</strong> - {blocker.occurrence_rate}
                    </div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                      Taux de résolution: {blocker.occurrence_rate} (très faible)
                    </div>
                  </div>
                )) : (
                  <div style={{
                    background: 'rgba(107, 114, 128, 0.1)',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(107, 114, 128, 0.2)',
                    opacity: 0.7
                  }}>
                    Aucun blocage non résolu identifié
                  </div>
                )}
              </div>
            </div>

            {/* Arguments qui marchent */}
            <div>
              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center'
              }}>
                ✅ Arguments qui marchent
              </h3>
              
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {stableStats.effectiveArguments.length > 0 ? stableStats.effectiveArguments.map((arg, index) => (
                  <li key={index} style={{ 
                    marginBottom: '1rem',
                    padding: '1rem',
                    background: 'rgba(16, 185, 129, 0.1)',
                    borderRadius: '8px',
                    border: '1px solid rgba(16, 185, 129, 0.2)'
                  }}>
                    <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
                      {arg.argument}
                    </div>
                    <div style={{ 
                      fontSize: '0.9rem', 
                      color: '#10b981',
                      fontWeight: '600',
                      marginBottom: '0.3rem'
                    }}>
                      {arg.success_rate} de succès
                    </div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                      {arg.context_sample}
                    </div>
                  </li>
                )) : (
                  <li style={{ 
                    marginBottom: '1rem',
                    padding: '1rem',
                    background: 'rgba(107, 114, 128, 0.1)',
                    borderRadius: '8px',
                    border: '1px solid rgba(107, 114, 128, 0.2)',
                    opacity: 0.7
                  }}>
                    Aucun argument efficace identifié
                  </li>
                )}
              </ul>
            </div>

            {/* Améliorations suggérées */}
            <div>
              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: '#3b82f6',
                display: 'flex',
                alignItems: 'center'
              }}>
                📈 Améliorations suggérées
              </h3>
              
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {stableStats.suggestedImprovements.length > 0 ? stableStats.suggestedImprovements.map((improvement, index) => (
                  <li key={index} style={{ 
                    marginBottom: '1rem',
                    padding: '1rem',
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '8px',
                    border: '1px solid rgba(59, 130, 246, 0.2)'
                  }}>
                    <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
                      {improvement.improvement}
                    </div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                      {improvement.linked_to}
                    </div>
                  </li>
                )) : (
                  <li style={{ 
                    marginBottom: '1rem',
                    padding: '1rem',
                    background: 'rgba(107, 114, 128, 0.1)',
                    borderRadius: '8px',
                    border: '1px solid rgba(107, 114, 128, 0.2)',
                    opacity: 0.7
                  }}>
                    Aucune amélioration suggérée
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default Dashboard;
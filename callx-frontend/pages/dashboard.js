import { useState, useEffect } from 'react'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

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
            Xcall Dashboard
          </h1>
          <div style={{ fontSize: '1rem', opacity: 0.7 }}>
            Semaine du 6-12 Janvier 2025
          </div>
        </div>

        {/* KPIs Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          {[
            {
              icon: '🔥',
              label: 'Score moyen',
              value: '8.4 / 10',
              trend: '+0.3',
              interpretation: 'Appels mieux structurés',
              color: '#10b981'
            },
            {
              icon: '📈',
              label: 'Closing rate',
              value: '32%',
              trend: '+4 pts',
              interpretation: 'Plus d\'efficacité en discovery',
              color: '#3b82f6'
            },
            {
              icon: '🧠',
              label: 'Appels analysés',
              value: '112',
              trend: '+18%',
              interpretation: 'Plus d\'activité terrain',
              color: '#8b5cf6'
            },
            {
              icon: '👂',
              label: 'Feedbacks intégrés',
              value: '67%',
              trend: '+9%',
              interpretation: 'Coaching bien appliqué',
              color: '#f59e0b'
            }
          ].map((kpi, index) => (
            <div
              key={index}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '1.5rem',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>{kpi.icon}</span>
                <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>{kpi.label}</span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                {kpi.value}
              </div>
              <div style={{ 
                fontSize: '0.9rem', 
                color: kpi.color,
                fontWeight: '600',
                marginBottom: '0.5rem'
              }}>
                {kpi.trend}
              </div>
              <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>
                "{kpi.interpretation}"
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem',
        marginBottom: '3rem'
      }}>
        {/* Team Leaderboard */}
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
            🏆 Classement hebdo
          </h2>
          
          <div style={{ marginBottom: '1rem' }}>
            {[
              { rank: '🥇', name: 'Clara', score: '9.1', evolution: '+0.7', comment: 'Excellente écoute active' },
              { rank: '🥈', name: 'Hugo', score: '8.6', evolution: '+0.4', comment: 'Meilleur framing client' },
              { rank: '🥉', name: 'Max', score: '7.9', evolution: '+0.2', comment: 'Encore trop de monologues' },
              { rank: '4', name: 'Sarah', score: '7.5', evolution: '+0.1', comment: 'Progrès en closing' },
              { rank: '5', name: 'Tom', score: '7.2', evolution: '-0.1', comment: 'À améliorer en discovery' }
            ].map((rep, index) => (
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
                <div style={{ width: '40px', fontSize: '1.2rem' }}>{rep.rank}</div>
                <div style={{ flex: 1, fontWeight: '600' }}>{rep.name}</div>
                <div style={{ width: '60px', textAlign: 'center', fontWeight: '700' }}>{rep.score}</div>
                <div style={{ 
                  width: '60px', 
                  textAlign: 'center', 
                  color: rep.evolution.startsWith('+') ? '#10b981' : '#ef4444',
                  fontSize: '0.9rem'
                }}>
                  {rep.evolution}
                </div>
                <div style={{ 
                  flex: 1, 
                  fontSize: '0.8rem', 
                  opacity: 0.7, 
                  textAlign: 'right' 
                }}>
                  {rep.comment}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Chart */}
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
            marginBottom: '1.5rem'
          }}>
            📈 Évolution collective (6 semaines)
          </h2>
          
          <div style={{
            height: '200px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
            padding: '1rem',
            display: 'flex',
            alignItems: 'end',
            justifyContent: 'space-around',
            marginBottom: '1rem'
          }}>
            {[6.8, 7.2, 7.5, 7.8, 8.1, 8.4].map((value, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    height: `${(value / 10) * 150}px`,
                    width: '30px',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    borderRadius: '4px 4px 0 0',
                    marginBottom: '0.5rem'
                  }}
                />
                <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                  S{index + 1}
                </div>
              </div>
            ))}
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#10b981' }}>85%</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Agents en progression</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#3b82f6' }}>42%</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Calls "excellents"</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#8b5cf6' }}>67%</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Feedbacks appliqués</div>
            </div>
          </div>
        </div>
      </div>

      {/* Insights Section */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        marginBottom: '3rem'
      }}>
        <h2 style={{
          fontSize: '1.8rem',
          fontWeight: '700',
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          💡 Ce que l'équipe apprend cette semaine
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.5rem'
        }}>
          {/* Blocages */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '2rem',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)'
          }}>
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
            <ul style={{ marginBottom: '1.5rem', paddingLeft: '1rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>Budget</li>
              <li style={{ marginBottom: '0.5rem' }}>Décision lente</li>
              <li style={{ marginBottom: '0.5rem' }}>Timing projet</li>
            </ul>
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              padding: '1rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontStyle: 'italic',
              borderLeft: '3px solid #ef4444'
            }}>
              "Le budget est déjà alloué à un autre outil..."
            </div>
          </div>

          {/* Arguments qui marchent */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '2rem',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)'
          }}>
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
            <ul style={{ marginBottom: '1.5rem', paddingLeft: '1rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>ROI en 3 mois</li>
              <li style={{ marginBottom: '0.5rem' }}>Témoignages clients</li>
              <li style={{ marginBottom: '0.5rem' }}>Comparaison concurrents</li>
            </ul>
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              padding: '1rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontStyle: 'italic',
              borderLeft: '3px solid #10b981'
            }}>
              "Votre support 24/7, c'est un vrai plus pour nous."
            </div>
          </div>

          {/* Améliorations */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '2rem',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)'
          }}>
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
            <ul style={{ marginBottom: '1.5rem', paddingLeft: '1rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>Poser plus de questions ouvertes</li>
              <li style={{ marginBottom: '0.5rem' }}>Reformuler les objections</li>
              <li style={{ marginBottom: '0.5rem' }}>Clarifier les prochaines étapes</li>
            </ul>
            <div style={{
              background: 'rgba(59, 130, 246, 0.1)',
              padding: '1rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontStyle: 'italic',
              borderLeft: '3px solid #3b82f6'
            }}>
              "Qu'est-ce qui vous ferait dire oui aujourd'hui ?"
            </div>
          </div>
        </div>
      </div>

      {/* Action Plan */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
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
          🎧 Plan d'action de la semaine
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>📚 Formation</h4>
            <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
              Formation "Discovery" prévue jeudi 14h
            </p>
          </div>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>🎯 Scripts</h4>
            <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
              Mise à jour du script de closing vendredi
            </p>
          </div>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>👂 Écoute</h4>
            <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
              Écouter les 3 meilleurs extraits de Clara
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
import Link from 'next/link'

export default function Home() {
  return (
    <div style={{ 
      fontFamily: 'Inter, system-ui, sans-serif',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
      color: '#ffffff',
      minHeight: '100vh'
    }}>
      {/* Navigation */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: '1rem 2rem',
        background: 'rgba(10, 10, 10, 0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{
            fontSize: '1.8rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            CallX
          </div>
          
          <Link href="/dashboard">
            <button style={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}>
              Dashboard
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 2rem',
        textAlign: 'center',
        position: 'relative'
      }}>
        {/* Background Animation */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(102, 126, 234, 0.3) 0%, rgba(0,0,0,0) 70%)',
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          animation: 'pulse 4s ease-in-out infinite'
        }} />
        
        <div style={{ maxWidth: '900px', position: 'relative', zIndex: 10 }}>
          <h1 style={{
            fontSize: 'clamp(3.5rem, 8vw, 6rem)',
            fontWeight: '800',
            marginBottom: '1.5rem',
            lineHeight: '1.1',
            background: 'linear-gradient(135deg, #ffffff 0%, #667eea 50%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            AI Sales Coach for Modern Teams
          </h1>
          
          <p style={{
            fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
            marginBottom: '2rem',
            opacity: 0.9,
            lineHeight: '1.5',
            fontWeight: '300'
          }}>
            Transform every sales call into actionable insights. 
            Boost team performance with AI-powered coaching that scales.
          </p>
          
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/dashboard">
              <button style={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                padding: '1.3rem 2.8rem',
                fontSize: '1.2rem',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: '600',
                boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
                transition: 'all 0.3s ease'
              }}>
                Access Dashboard
              </button>
            </Link>
            
            <button style={{
              background: 'transparent',
              color: '#ffffff',
              padding: '1.3rem 2.8rem',
              fontSize: '1.2rem',
              border: '2px solid rgba(255,255,255,0.3)',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}>
              Request Demo
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ 
        padding: '6rem 2rem',
        background: 'rgba(255, 255, 255, 0.02)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: '700',
            marginBottom: '3rem',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Proven Results
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem'
          }}>
            {[
              { metric: '+27%', label: 'Faster Ramp-up', desc: 'New hires reach full productivity faster' },
              { metric: '+18%', label: 'Closing Rate', desc: 'Average improvement in deal closure' },
              { metric: '2×', label: 'Coaching Efficiency', desc: 'More effective manager time' },
              { metric: '85%', label: 'Team Adoption', desc: 'Reps actively using feedback' }
            ].map((stat, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '2rem',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)'
                }}
              >
                <div style={{ fontSize: '3rem', fontWeight: '800', color: '#667eea', marginBottom: '0.5rem' }}>
                  {stat.metric}
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  {stat.label}
                </h3>
                <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>
                  {stat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '8rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: '700',
              marginBottom: '1.5rem',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              How CallX Works
            </h2>
            <p style={{
              fontSize: '1.3rem',
              opacity: 0.8,
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              From call recording to actionable insights in minutes
            </p>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '3rem'
          }}>
            {[
              {
                icon: '🎧',
                title: 'Real-time Analysis',
                description: 'AI listens to every Aircall conversation and provides instant feedback on tone, objections, and structure.',
                details: [
                  'Automatic transcription with Whisper AI',
                  'Real-time sentiment analysis',
                  'Objection detection and categorization',
                  'Talk ratio optimization insights'
                ]
              },
              {
                icon: '📊',
                title: 'Performance Dashboard',
                description: 'Track individual and team progress with detailed analytics and performance metrics.',
                details: [
                  'Weekly team leaderboards',
                  'Individual progress tracking',
                  'Call quality scoring (1-10)',
                  'Trend analysis over time'
                ]
              },
              {
                icon: '🎯',
                title: 'Actionable Insights',
                description: 'Get specific recommendations to improve closing rates and sales effectiveness.',
                details: [
                  'Personalized coaching recommendations',
                  'Best practice call excerpts',
                  'Objection handling strategies',
                  'Script optimization suggestions'
                ]
              }
            ].map((feature, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '2.5rem',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  transition: 'transform 0.3s ease'
                }}
              >
                <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>{feature.icon}</div>
                <h3 style={{ 
                  fontSize: '1.8rem', 
                  fontWeight: '700', 
                  marginBottom: '1rem',
                  color: '#667eea'
                }}>
                  {feature.title}
                </h3>
                <p style={{ 
                  opacity: 0.9, 
                  lineHeight: '1.6', 
                  marginBottom: '1.5rem',
                  fontSize: '1.1rem'
                }}>
                  {feature.description}
                </p>
                <ul style={{ 
                  listStyle: 'none', 
                  padding: 0,
                  opacity: 0.8
                }}>
                  {feature.details.map((detail, idx) => (
                    <li key={idx} style={{ 
                      marginBottom: '0.5rem',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <span style={{ 
                        color: '#10b981', 
                        marginRight: '0.5rem',
                        fontSize: '0.9rem'
                      }}>✓</span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Insights Preview Section */}
      <section style={{ 
        padding: '8rem 2rem',
        background: 'rgba(255, 255, 255, 0.02)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: '700',
              marginBottom: '1.5rem',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Real Insights from Real Calls
            </h2>
            <p style={{
              fontSize: '1.3rem',
              opacity: 0.8,
              maxWidth: '700px',
              margin: '0 auto'
            }}>
              See what your team learns every week
            </p>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem'
          }}>
            {/* Blocages */}
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              padding: '2rem',
              borderRadius: '16px',
              border: '1px solid rgba(239, 68, 68, 0.2)'
            }}>
              <h3 style={{
                fontSize: '1.3rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: '#ef4444',
                display: 'flex',
                alignItems: 'center'
              }}>
                🚧 Main Blockers
              </h3>
              <ul style={{ marginBottom: '1.5rem', paddingLeft: '1rem' }}>
                <li style={{ marginBottom: '0.5rem' }}>Budget concerns (23%)</li>
                <li style={{ marginBottom: '0.5rem' }}>Slow decision process (18%)</li>
                <li style={{ marginBottom: '0.5rem' }}>Timing issues (15%)</li>
              </ul>
              <div style={{
                background: 'rgba(239, 68, 68, 0.2)',
                padding: '1rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontStyle: 'italic',
                borderLeft: '3px solid #ef4444'
              }}>
                "Le budget est déjà alloué à un autre outil..."
              </div>
            </div>

            {/* Winning Arguments */}
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              padding: '2rem',
              borderRadius: '16px',
              border: '1px solid rgba(16, 185, 129, 0.2)'
            }}>
              <h3 style={{
                fontSize: '1.3rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center'
              }}>
                ✅ Winning Arguments
              </h3>
              <ul style={{ marginBottom: '1.5rem', paddingLeft: '1rem' }}>
                <li style={{ marginBottom: '0.5rem' }}>ROI in 3 months (31%)</li>
                <li style={{ marginBottom: '0.5rem' }}>Customer testimonials (28%)</li>
                <li style={{ marginBottom: '0.5rem' }}>Competitor comparison (22%)</li>
              </ul>
              <div style={{
                background: 'rgba(16, 185, 129, 0.2)',
                padding: '1rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontStyle: 'italic',
                borderLeft: '3px solid #10b981'
              }}>
                "Votre support 24/7, c'est un vrai plus pour nous."
              </div>
            </div>

            {/* Improvements */}
            <div style={{
              background: 'rgba(59, 130, 246, 0.1)',
              padding: '2rem',
              borderRadius: '16px',
              border: '1px solid rgba(59, 130, 246, 0.2)'
            }}>
              <h3 style={{
                fontSize: '1.3rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: '#3b82f6',
                display: 'flex',
                alignItems: 'center'
              }}>
                📈 Key Improvements
              </h3>
              <ul style={{ marginBottom: '1.5rem', paddingLeft: '1rem' }}>
                <li style={{ marginBottom: '0.5rem' }}>Ask more open questions</li>
                <li style={{ marginBottom: '0.5rem' }}>Better objection handling</li>
                <li style={{ marginBottom: '0.5rem' }}>Clearer next steps</li>
              </ul>
              <div style={{
                background: 'rgba(59, 130, 246, 0.2)',
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
      </section>

      {/* Integrations Section */}
      <section style={{ padding: '6rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: '700',
            marginBottom: '3rem',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Seamless Integrations
          </h2>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '3rem',
            flexWrap: 'wrap',
            marginBottom: '3rem'
          }}>
            {['Aircall', 'Salesforce', 'HubSpot', 'Slack', 'Gmail'].map((logo, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '1.5rem 2rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  opacity: 0.8,
                  transition: 'opacity 0.3s ease'
                }}
              >
                {logo}
              </div>
            ))}
          </div>
          
          <p style={{
            fontSize: '1.1rem',
            opacity: 0.7,
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Connect with your existing tools. No disruption to your workflow.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ 
        padding: '8rem 2rem',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: '700',
            marginBottom: '1.5rem',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Ready to transform your sales team?
          </h2>
          
          <p style={{
            fontSize: '1.3rem',
            marginBottom: '2.5rem',
            opacity: 0.8,
            lineHeight: '1.6'
          }}>
            Join the beta and see how AI can revolutionize your sales coaching. 
            Limited spots available for early adopters.
          </p>
          
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/dashboard">
              <button style={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                padding: '1.3rem 3rem',
                fontSize: '1.2rem',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: '600',
                boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
                transition: 'all 0.3s ease'
              }}>
                Get Started Free
              </button>
            </Link>
            
            <button style={{
              background: 'transparent',
              color: '#ffffff',
              padding: '1.3rem 3rem',
              fontSize: '1.2rem',
              border: '2px solid rgba(255,255,255,0.3)',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}>
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '3rem 2rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        textAlign: 'center',
        background: 'rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            fontSize: '1.8rem',
            fontWeight: '800',
            marginBottom: '1rem',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Xcall
          </div>
          <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>
            © 2025 Xcall. AI-powered sales coaching for modern teams.
          </p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.6; transform: translate(-50%, -50%) scale(1.1); }
        }
        
        button:hover {
          transform: translateY(-2px) !important;
        }
      `}</style>
    </div>
  )
}
import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Login() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Simuler une vérification côté client (en production, ceci devrait être côté serveur)
    if (password === 'talentr') {
      // Stocker l'authentification dans sessionStorage
      sessionStorage.setItem('dashboard_authenticated', 'true')
      router.push('/dashboard')
    } else {
      setError('Mot de passe incorrect')
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      fontFamily: 'Inter, system-ui, sans-serif',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
      color: '#ffffff',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        padding: '3rem',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '2.5rem',
          fontWeight: '800',
          marginBottom: '1rem',
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          CallX
        </div>
        
        <h1 style={{
          fontSize: '1.8rem',
          fontWeight: '700',
          marginBottom: '0.5rem'
        }}>
          Accès Dashboard
        </h1>
        
        <p style={{
          opacity: 0.7,
          marginBottom: '2rem',
          fontSize: '1rem'
        }}>
          Entrez le mot de passe pour accéder au dashboard
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              style={{
                width: '100%',
                padding: '1rem',
                fontSize: '1rem',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: '#ffffff',
                outline: 'none',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
            />
          </div>

          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              padding: '0.75rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              fontSize: '0.9rem',
              border: '1px solid rgba(239, 68, 68, 0.2)'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: loading ? 'rgba(102, 126, 234, 0.5)' : 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              padding: '1rem',
              fontSize: '1rem',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Connexion...' : 'Accéder au Dashboard'}
          </button>
        </form>

      </div>
    </div>
  )
}

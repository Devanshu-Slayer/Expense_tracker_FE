import { useState } from 'react'
import './AuthPage.css'

function getPasswordStrength(password) {
  if (!password) return null
  if (password.length < 6) return { label: 'Too short', color: '#f0566e', width: '20%' }
  if (password.length < 8) return { label: 'Weak', color: '#f59e0b', width: '40%' }
  const hasUpper = /[A-Z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecial = /[^a-zA-Z0-9]/.test(password)
  const score = [hasUpper, hasNumber, hasSpecial].filter(Boolean).length
  if (score === 0) return { label: 'Fair', color: '#f59e0b', width: '55%' }
  if (score === 1) return { label: 'Good', color: '#22d3a5', width: '75%' }
  return { label: 'Strong 💪', color: '#22d3a5', width: '100%' }
}

function AuthPage({ onAuthSuccess }) {
  const [activeTab, setActiveTab] = useState('login')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  function switchTab(tab) {
    setActiveTab(tab)
    setServerError('')
    setSuccessMsg('')
    setFieldErrors({})
    setName('')
    setEmail('')
    setPassword('')
  }

  function validate() {
    const errors = {}
    if (activeTab === 'register' && !name.trim()) {
      errors.name = 'Full name is required'
    }
    if (!email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      errors.email = 'Enter a valid email address'
    }
    if (!password) {
      errors.password = 'Password is required'
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setServerError('')
    setSuccessMsg('')

    if (!validate()) return

    setIsLoading(true)

    try {
      const apiBase = import.meta.env.VITE_API_URL || 'https://expense-tracker-be-3-zayd.onrender.com'
      const endpoint =
        activeTab === 'login'
          ? `${apiBase}/api/auth/login`
          : `${apiBase}/api/auth/register`

      const body =
        activeTab === 'login'
          ? { email, password }
          : { name, email, password }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (!response.ok) {
        setServerError(data.message || 'Something went wrong.')
        return
      }

      if (activeTab === 'register') {
        setSuccessMsg(`Welcome, ${data.user.name}! Logging you in...`)
        setTimeout(() => {
          onAuthSuccess(data.user, data.token)
        }, 1000)
      } else {
        onAuthSuccess(data.user, data.token)
      }
    } catch (err) {
      setServerError('Cannot connect to server. Make sure the backend is running.')
    } finally {
      setIsLoading(false)
    }
  }

  const passwordStrength = activeTab === 'register' ? getPasswordStrength(password) : null

  return (
    <div className="auth-page">
      <div className="auth-orb auth-orb--1" />
      <div className="auth-orb auth-orb--2" />
      <div className="auth-orb auth-orb--3" />

      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo__icon">💰</div>
        </div>

        <div className="auth-header">
          <h1 className="auth-title">
            {activeTab === 'login' ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="auth-subtitle">
            {activeTab === 'login'
              ? 'Sign in to manage your finances'
              : 'Start tracking your expenses today'}
          </p>
        </div>

        <div className="auth-tabs" role="tablist">
          <button
            role="tab"
            className={`auth-tab ${activeTab === 'login' ? 'auth-tab--active' : ''}`}
            onClick={() => switchTab('login')}
            id="tab-login"
            aria-selected={activeTab === 'login'}
          >
            Sign In
          </button>
          <button
            role="tab"
            className={`auth-tab ${activeTab === 'register' ? 'auth-tab--active' : ''}`}
            onClick={() => switchTab('register')}
            id="tab-register"
            aria-selected={activeTab === 'register'}
          >
            Register
          </button>
        </div>

        {serverError && (
          <div className="auth-error-banner" role="alert">
            <span className="auth-error-banner__icon">⚠️</span>
            <span className="auth-error-banner__text">{serverError}</span>
          </div>
        )}

        {successMsg && (
          <div className="auth-success-banner" role="status">
            <span>✅</span>
            <span>{successMsg}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>

          {activeTab === 'register' && (
            <div className="auth-field">
              <label htmlFor="auth-name" className="auth-label">Full Name</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">👤</span>
                <input
                  id="auth-name"
                  type="text"
                  className={`auth-input ${fieldErrors.name ? 'auth-input--error' : ''}`}
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    if (fieldErrors.name) setFieldErrors((p) => ({ ...p, name: '' }))
                  }}
                  autoComplete="name"
                  autoFocus
                />
              </div>
              {fieldErrors.name && (
                <span className="auth-field-error">⚠ {fieldErrors.name}</span>
              )}
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="auth-email" className="auth-label">Email Address</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">✉️</span>
              <input
                id="auth-email"
                type="email"
                className={`auth-input ${fieldErrors.email ? 'auth-input--error' : ''}`}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: '' }))
                }}
                autoComplete="email"
                autoFocus={activeTab === 'login'}
              />
            </div>
            {fieldErrors.email && (
              <span className="auth-field-error">⚠ {fieldErrors.email}</span>
            )}
          </div>

          <div className="auth-field">
            <label htmlFor="auth-password" className="auth-label">Password</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">🔒</span>
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                className={`auth-input ${fieldErrors.password ? 'auth-input--error' : ''}`}
                placeholder={activeTab === 'login' ? 'Your password' : 'At least 6 characters'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: '' }))
                }}
                autoComplete={activeTab === 'login' ? 'current-password' : 'new-password'}
              />
              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowPassword((p) => !p)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {fieldErrors.password && (
              <span className="auth-field-error">⚠ {fieldErrors.password}</span>
            )}

            {activeTab === 'register' && passwordStrength && (
              <div style={{ marginTop: 6 }}>
                <div style={{
                  height: 4,
                  background: 'rgba(255,255,255,0.06)',
                  borderRadius: 4,
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: passwordStrength.width,
                    background: passwordStrength.color,
                    borderRadius: 4,
                    transition: 'all 300ms ease',
                  }} />
                </div>
                <span style={{ fontSize: 11, color: passwordStrength.color, fontWeight: 600 }}>
                  {passwordStrength.label}
                </span>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={isLoading}
            id="auth-submit-btn"
          >
            {isLoading && <span className="auth-spinner" />}
            {isLoading
              ? activeTab === 'login' ? 'Signing in...' : 'Creating account...'
              : activeTab === 'login' ? '→ Sign In' : '→ Create Account'
            }
          </button>
        </form>

        <div className="auth-footer" style={{ marginTop: 20 }}>
          <p className="auth-footer__text">
            {activeTab === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              className="auth-footer__link"
              onClick={() => switchTab(activeTab === 'login' ? 'register' : 'login')}
              id="auth-switch-btn"
            >
              {activeTab === 'login' ? 'Sign up free' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default AuthPage

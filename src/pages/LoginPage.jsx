import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function LoginPage({ onNavigate }) {
  const { login, register } = useAuth()
  const [tab, setTab] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})

  const switchTab = (t) => {
    setTab(t)
    setFormError(null)
    setFieldErrors({})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting) return

    setFormError(null)
    setFieldErrors({})
    setIsSubmitting(true)

    const result = tab === 'login' ? await login(email, password) : await register(email, password, name)

    setIsSubmitting(false)

    if (result.success) {
      onNavigate('dashboard')
      return
    }

    setFormError(result.message)
    setFieldErrors(result.fieldErrors || {})
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel — decorative */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-card">
        <img
          src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=1000&fit=crop&auto=format"
          alt="Studying"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-background via-background/50 to-transparent" />
        <div className="relative z-10 p-14 flex flex-col justify-end">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0D1117" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-foreground">Learn Coach</span>
          </div>
          <blockquote className="max-w-sm">
            <p className="text-2xl font-light text-foreground leading-relaxed mb-4">
              &ldquo;Deep learning with an AI assistant&rdquo;
            </p>
            <p className="text-muted-foreground text-base">
              Upload your study materials, read them, ask questions, and see how much you&apos;ve learned.
            </p>
          </blockquote>
          <div className="mt-10 flex gap-6 text-sm text-muted-foreground">
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-semibold text-foreground">1.2K+</span>
              <span>Resources</span>
            </div>
            <div className="w-px bg-border" />
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-semibold text-foreground">4.8K+</span>
              <span>Study sessions</span>
            </div>
            <div className="w-px bg-border" />
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-semibold text-foreground">96%</span>
              <span>User satisfaction</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 lg:max-w-sm xl:max-w-md flex items-center justify-center p-8">
        <div className="w-full max-w-sm animate-fade-in">
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0D1117" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <span className="text-lg font-bold">Learn Coach</span>
          </div>

          <h1 className="text-2xl font-semibold text-foreground mb-1">
            {tab === 'login' ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="text-muted-foreground text-sm mb-7">
            {tab === 'login' ? 'Sign in to your account' : 'Create a free account'}
          </p>

          {/* Tab switcher */}
          <div className="flex bg-secondary rounded-lg p-1 mb-6">
            {['login', 'register'].map((t) => (
              <button
                key={t}
                onClick={() => switchTab(t)}
                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  tab === t ? 'bg-card text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            {formError && (
              <div className="px-3.5 py-2.5 bg-danger/10 border border-danger/30 rounded-lg text-sm text-danger">
                {formError}
              </div>
            )}
            {tab === 'register' && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Full name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Reyes"
                  className="w-full px-3.5 py-2.5 bg-secondary border border-border rounded-lg text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring/30 transition-colors"
                />
                {fieldErrors.name && (
                  <p className="mt-1 text-xs text-danger">{fieldErrors.name[0]}</p>
                )}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                className="w-full px-3.5 py-2.5 bg-secondary border border-border rounded-lg text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring/30 transition-colors"
              />
              {fieldErrors.email && (
                <p className="mt-1 text-xs text-danger">{fieldErrors.email[0]}</p>
              )}
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-foreground">Password</label>
                {tab === 'login' && (
                  <button type="button" className="text-xs text-primary hover:underline">Forgot password?</button>
                )}
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-secondary border border-border rounded-lg text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring/30 transition-colors"
              />
              {fieldErrors.password && (
                <p className="mt-1 text-xs text-danger">{fieldErrors.password[0]}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors mt-1"
            >
              {isSubmitting
                ? tab === 'login' ? 'Signing in…' : 'Creating account…'
                : tab === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs text-muted-foreground">
              <span className="bg-background px-3">Or continue with</span>
            </div>
          </div>

          <button className="w-full flex items-center justify-center gap-2.5 py-2.5 border border-border rounded-lg text-sm text-foreground hover:bg-secondary transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  )
}

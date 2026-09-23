import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { apiClient, ApiError } from '../lib/apiClient'
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from '../lib/tokenStorage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  // Only tracks the one-time session hydration on app load — gates the
  // whole app (see App.jsx). Login/register in-flight state is tracked
  // locally by the caller (e.g. LoginPage's own isSubmitting), not here,
  // so a failed login doesn't trigger the app-wide loading screen.
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // On app load: if an access token is stored, validate it via /me/.
  // If that fails, try a refresh once; if that also fails, fall back to
  // logged-out state without surfacing an error (this is a silent hydration
  // step, not a user-initiated action).
  useEffect(() => {
    let cancelled = false

    async function hydrate() {
      const hasToken = getAccessToken() || getRefreshToken()
      if (!hasToken) {
        setIsLoading(false)
        return
      }

      try {
        const me = await apiClient.get('/api/auth/me/')
        if (!cancelled) setUser(me)
      } catch {
        // apiClient already attempts one refresh-and-retry internally for
        // authenticated 401s, so if we're here it's genuinely unauthenticated.
        if (!cancelled) {
          clearTokens()
          setUser(null)
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    hydrate()
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (email, password) => {
    setError(null)
    try {
      const data = await apiClient.post('/api/auth/login/', { email, password }, { auth: false })
      setTokens({ access: data.access, refresh: data.refresh })
      setUser(data.user)
      return { success: true }
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Something went wrong. Please try again.'
      const fieldErrors = err instanceof ApiError ? err.fieldErrors : null
      setError(message)
      return { success: false, message, fieldErrors }
    }
  }, [])

  const register = useCallback(async (email, password, name) => {
    setError(null)
    try {
      const data = await apiClient.post('/api/auth/register/', { email, password, name }, { auth: false })
      setTokens({ access: data.access, refresh: data.refresh })
      setUser(data.user)
      return { success: true }
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Something went wrong. Please try again.'
      const fieldErrors = err instanceof ApiError ? err.fieldErrors : null
      setError(message)
      return { success: false, message, fieldErrors }
    }
  }, [])

  const logout = useCallback(async () => {
    const refresh = getRefreshToken()
    try {
      if (refresh) {
        await apiClient.post('/api/auth/logout/', { refresh })
      }
    } catch {
      // Best-effort — even if the server call fails, still clear local state.
    } finally {
      clearTokens()
      setUser(null)
      setError(null)
    }
  }, [])

  // Exposed mainly so other parts of the app (e.g. a future interceptor) can
  // force a logout after an unrecoverable auth failure.
  const forceLogout = useCallback(() => {
    clearTokens()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      error,
      login,
      register,
      logout,
      forceLogout,
    }),
    [user, isLoading, error, login, register, logout, forceLogout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}

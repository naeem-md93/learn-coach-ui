// Minimal fetch-based API client for talking to the Django backend.
// Per CONTEXT.md, the UI only ever talks to Django — never directly to the
// FastAPI logic service.

import { getAccessToken, getRefreshToken, setTokens, clearTokens } from './tokenStorage'

export const SERVICE_BASE_URL = import.meta.env.VITE_SERVICE_BASE_URL || 'http://localhost:8008'

export class ApiError extends Error {
  constructor(message, { status, fieldErrors } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    // Field-level errors, e.g. { email: ['already registered'] }
    this.fieldErrors = fieldErrors || null
  }
}

/**
 * Parses a non-OK response body into a human-readable message plus any
 * field-level error map, matching the backend's error shape:
 * either { detail: "..." } or { field: ["msg", ...], ... }.
 */
async function parseErrorResponse(response) {
  let body = null
  try {
    body = await response.json()
  } catch {
    // no JSON body (e.g. empty 500 page) — fall through with generic message
  }

  if (body && typeof body === 'object') {
    if (typeof body.detail === 'string') {
      return { message: body.detail, fieldErrors: null }
    }

    // Field-level errors: { email: ["..."], password: ["..."] }
    const fieldErrors = {}
    let firstMessage = null
    for (const [key, value] of Object.entries(body)) {
      const messages = Array.isArray(value) ? value : [String(value)]
      fieldErrors[key] = messages
      if (!firstMessage) firstMessage = messages[0]
    }
    if (Object.keys(fieldErrors).length > 0) {
      return { message: firstMessage || 'Request failed', fieldErrors }
    }
  }

  return { message: `Request failed (${response.status})`, fieldErrors: null }
}

/**
 * Low-level request helper: builds the URL, attaches JSON headers and the
 * bearer token (if present and not explicitly skipped), and throws ApiError
 * on non-OK responses.
 */
async function request(path, { method = 'GET', body, auth = true, headers = {}, skipRefresh = false } = {}) {
  const url = `${SERVICE_BASE_URL}${path}`

  const finalHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  }

  if (auth) {
    const token = getAccessToken()
    if (token) finalHeaders.Authorization = `Bearer ${token}`
  }

  // Guard against a hung connection (e.g. DNS/IPv6 fallback delays, or the
  // backend simply being down) so the UI never gets stuck in a loading
  // state indefinitely.
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 15000)

  let response
  try {
    response = await fetch(url, {
      method,
      headers: finalHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    })
  } catch {
    throw new ApiError('Network error — could not reach the server. Please try again.', { status: 0 })
  } finally {
    clearTimeout(timeoutId)
  }

  // Auto refresh-and-retry once on 401 for authenticated requests.
  if (response.status === 401 && auth && !skipRefresh) {
    const refreshed = await tryRefreshAccessToken()
    if (refreshed) {
      return request(path, { method, body, auth, headers, skipRefresh: true })
    }
    clearTokens()
    const { message, fieldErrors } = await parseErrorResponse(response)
    throw new ApiError(message, { status: 401, fieldErrors })
  }

  if (response.status === 204 || response.status === 205) {
    return null
  }

  if (!response.ok) {
    const { message, fieldErrors } = await parseErrorResponse(response)
    throw new ApiError(message, { status: response.status, fieldErrors })
  }

  try {
    return await response.json()
  } catch {
    return null
  }
}

let refreshPromise = null

/**
 * Attempts to refresh the access token using the stored refresh token.
 * De-dupes concurrent calls so multiple failed requests don't each trigger
 * their own refresh. Resolves true on success, false on failure.
 */
export async function tryRefreshAccessToken() {
  const refresh = getRefreshToken()
  if (!refresh) return false

  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const data = await request('/api/auth/refresh/', {
          method: 'POST',
          body: { refresh },
          auth: false,
        })
        if (data?.access) {
          // The backend rotates refresh tokens and blacklists the old one,
          // so a rotated refresh must overwrite the stored value here or
          // the next refresh attempt will fail with "token blacklisted".
          setTokens({ access: data.access, refresh: data.refresh })
          return true
        }
        return false
      } catch {
        return false
      } finally {
        refreshPromise = null
      }
    })()
  }

  return refreshPromise
}

export const apiClient = {
  get: (path, options) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
  patch: (path, body, options) => request(path, { ...options, method: 'PATCH', body }),
  delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
}

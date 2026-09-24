// Resource ("My Library") API calls — all go through Django, never FastAPI
// directly (per CONTEXT.md Service Boundaries).
//
// Assumed contract (coordinate with learn-coach-service if this drifts):
//   POST   /api/resources/            multipart: file, resource_type, subject
//                                      -> Resource { id, title, title_status, resource_type, subject, created_at, ... }
//   GET    /api/resources/            -> Resource[] for the logged-in user
//   DELETE /api/resources/<id>/       -> 204
//   GET    /api/resources/<id>/file/  -> fetchable URL to the stored PDF

import { apiClient, SERVICE_BASE_URL } from './apiClient'

export function listResources() {
  return apiClient.get('/api/resources/')
}

export function uploadResource({ file, resourceType, subject }) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('resource_type', resourceType)
  formData.append('subject', subject)
  return apiClient.postForm('/api/resources/', formData)
}

export function deleteResource(id) {
  return apiClient.delete(`/api/resources/${id}/`)
}

// Not fetched through apiClient (it's a file stream, not JSON) — just the
// absolute URL, built the same way apiClient resolves paths. Kept here so
// StudyPage (or anything else) can point <iframe>/fetch at it later without
// re-deriving the base URL itself.
export function resourceFileUrl(id) {
  return `${SERVICE_BASE_URL}/api/resources/${id}/file/`
}

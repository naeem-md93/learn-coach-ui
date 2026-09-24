import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import { listResources, deleteResource } from '../lib/resourcesApi'
import { ApiError } from '../lib/apiClient'

// Backend enum values (per CONTEXT.md Subject glossary) paired with display
// labels/colors. Keep values lowercase to match what the API sends back.
const subjectMeta = {
  biology: { label: 'Biology', bg: 'bg-success/10', text: 'text-success' },
  mathematics: { label: 'Mathematics', bg: 'bg-primary/10', text: 'text-primary' },
  statistics: { label: 'Statistics', bg: 'bg-accent/10', text: 'text-accent' },
  electronics: { label: 'Electronics', bg: 'bg-warning/10', text: 'text-warning' },
}

const filters = [{ value: 'all', label: 'All' }, ...Object.entries(subjectMeta).map(([value, m]) => ({ value, label: m.label }))]

const resourceTypeLabels = { book: 'Book', paper: 'Article' }

export default function DashboardPage({ onNavigate, onOpenResource }) {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')
  const [view, setView] = useState('grid')
  const [search, setSearch] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await listResources()
        if (!cancelled) setResources(Array.isArray(data) ? data : [])
      } catch (err) {
        if (!cancelled) setError(err instanceof ApiError ? err.message : 'Failed to load your library.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const handleDelete = async (resource) => {
    if (!window.confirm(`Delete "${resource.title || 'this resource'}"? This cannot be undone.`)) return
    setDeletingId(resource.id)
    try {
      await deleteResource(resource.id)
      setResources((prev) => prev.filter((r) => r.id !== resource.id))
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to delete resource.')
    } finally {
      setDeletingId(null)
    }
  }

  const filtered = resources.filter((r) => {
    if (filter !== 'all' && r.subject !== filter) return false
    if (search && !(r.title || '').toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar currentPage="dashboard" onNavigate={onNavigate} />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground mb-1">My Library</h1>
              <p className="text-muted-foreground text-sm">
                {loading ? 'Loading resources...' : `${resources.length} resource${resources.length === 1 ? '' : 's'}`}
              </p>
            </div>
            <button
              onClick={() => onNavigate('upload')}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Upload New Resource
            </button>
          </div>

          {error && (
            <div className="mb-6 px-4 py-3 rounded-lg bg-danger/10 border border-danger/30 text-danger text-sm flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => setError(null)} className="text-xs underline shrink-0 ml-4">Dismiss</button>
            </div>
          )}

          {/* Toolbar */}
          <div className="flex items-center gap-3 mb-5 flex-wrap">
            <div className="flex-1 min-w-48 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search resources..."
                className="w-full pr-3.5 pl-9 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring transition-colors"
              />
            </div>

            <div className="flex gap-1 bg-secondary border border-border rounded-lg p-0.5">
              {filters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    filter === f.value ? 'bg-card text-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="flex gap-1 bg-secondary border border-border rounded-lg p-0.5">
              {['grid', 'list'].map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`p-1.5 rounded-md transition-colors ${view === v ? 'bg-card text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  {v === 'grid' ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Resources */}
          {loading ? (
            <div className="flex items-center justify-center py-24 text-muted-foreground text-sm gap-3">
              <span className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              Loading your library...
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-foreground font-medium mb-1">
                {resources.length === 0 ? 'Your library is empty' : 'No resources match your filters'}
              </p>
              <p className="text-muted-foreground text-sm mb-5">
                {resources.length === 0 ? 'Upload a PDF book or article to get started.' : 'Try a different search or subject filter.'}
              </p>
              {resources.length === 0 && (
                <button
                  onClick={() => onNavigate('upload')}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Upload a resource
                </button>
              )}
            </div>
          ) : view === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  onOpen={onOpenResource}
                  onDelete={handleDelete}
                  deleting={deletingId === resource.id}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {filtered.map((resource) => (
                <ResourceRow
                  key={resource.id}
                  resource={resource}
                  onOpen={onOpenResource}
                  onDelete={handleDelete}
                  deleting={deletingId === resource.id}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function DeleteButton({ resource, onDelete, deleting, className = '' }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onDelete(resource) }}
      disabled={deleting}
      title="Delete resource"
      className={`p-1.5 rounded-md text-muted-foreground hover:text-danger hover:bg-danger/10 transition-colors disabled:opacity-50 ${className}`}
    >
      {deleting ? (
        <span className="block h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
        </svg>
      )}
    </button>
  )
}

function TitleStatusBadge({ status }) {
  if (status === 'pending') {
    return <span className="text-[10px] text-warning">Processing title...</span>
  }
  if (status === 'failed') {
    return <span className="text-[10px] text-danger">Title unavailable</span>
  }
  return null
}

function ResourceCard({ resource, onOpen, onDelete, deleting }) {
  const sc = subjectMeta[resource.subject] || { label: resource.subject, bg: 'bg-secondary', text: 'text-muted-foreground' }
  const title = resource.title || resource.file_name || 'Untitled resource'

  return (
    <div className="group relative bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 hover:bg-card-hover transition-all text-left">
      <button onClick={() => onOpen(resource)} className="block w-full text-left">
        <div className="h-24 bg-secondary relative overflow-hidden flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8B949E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
          </svg>
          <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-medium ${sc.bg} ${sc.text}`}>
            {sc.label}
          </div>
        </div>
        <div className="p-3">
          <p className="text-xs text-muted-foreground mb-1">{resourceTypeLabels[resource.resource_type] || resource.resource_type}</p>
          <h3 className="text-sm font-medium text-foreground leading-snug mb-1 line-clamp-2">{title}</h3>
          <TitleStatusBadge status={resource.title_status} />
        </div>
      </button>
      <DeleteButton resource={resource} onDelete={onDelete} deleting={deleting} className="absolute top-2 right-2 bg-card/90 opacity-0 group-hover:opacity-100" />
    </div>
  )
}

function ResourceRow({ resource, onOpen, onDelete, deleting }) {
  const sc = subjectMeta[resource.subject] || { label: resource.subject, bg: 'bg-secondary', text: 'text-muted-foreground' }
  const title = resource.title || resource.file_name || 'Untitled resource'

  return (
    <div className="group flex items-center gap-4 bg-card border border-border rounded-xl p-4 hover:border-primary/40 hover:bg-card-hover transition-all">
      <button onClick={() => onOpen(resource)} className="flex items-center gap-4 flex-1 min-w-0 text-left">
        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B949E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-sm font-medium text-foreground truncate">{title}</h3>
            <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium ${sc.bg} ${sc.text}`}>
              {sc.label}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {resourceTypeLabels[resource.resource_type] || resource.resource_type}
            {resource.title_status && resource.title_status !== 'ready' && (
              <>
                {' '}·{' '}
                <span className={resource.title_status === 'failed' ? 'text-danger' : 'text-warning'}>
                  {resource.title_status === 'failed' ? 'Title unavailable' : 'Processing title...'}
                </span>
              </>
            )}
          </p>
        </div>
      </button>
      <DeleteButton resource={resource} onDelete={onDelete} deleting={deleting} />
      <svg className="text-muted-foreground group-hover:text-foreground transition-colors" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </div>
  )
}

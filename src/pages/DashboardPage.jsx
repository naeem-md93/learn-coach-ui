import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import { mockResources, subjectColors, subjectLabels } from '../data'

const subjects = ['all', 'Biology', 'Mathematics', 'Statistics', 'Electronics']
const subjectAllLabel = { all: 'All', ...subjectLabels }

export default function DashboardPage({ onNavigate, onOpenResource }) {
  const [filter, setFilter] = useState('all')
  const [view, setView] = useState('grid')
  const [search, setSearch] = useState('')

  const filtered = mockResources.filter((r) => {
    if (filter !== 'all' && r.subject !== filter) return false
    if (search && !r.title.includes(search)) return false
    return true
  })

  const totalRead = mockResources.reduce((a, r) => a + r.readPages, 0)
  const totalPages = mockResources.reduce((a, r) => a + r.pages, 0)

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar currentPage="dashboard" onNavigate={onNavigate} />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-foreground mb-1">My Library</h1>
            <p className="text-muted-foreground text-sm">
              {mockResources.length} resources — {totalRead} of {totalPages} pages read
            </p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Resources uploaded', value: mockResources.length, icon: '📚' },
              { label: 'Study sessions', value: '23', icon: '⏱' },
              { label: 'Quizzes taken', value: '8', icon: '✅' },
            ].map((stat) => (
              <div key={stat.label} className="bg-card border border-border rounded-xl p-5">
                <p className="text-2xl mb-1">{stat.icon}</p>
                <p className="text-xl font-semibold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

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
              {subjects.map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    filter === s ? 'bg-card text-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {subjectAllLabel[s]}
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
          {view === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} onOpen={onOpenResource} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {filtered.map((resource) => (
                <ResourceRow key={resource.id} resource={resource} onOpen={onOpenResource} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function ResourceCard({ resource, onOpen }) {
  const sc = subjectColors[resource.subject]
  const pct = Math.round((resource.readPages / resource.pages) * 100)
  return (
    <button
      onClick={() => onOpen(resource)}
      className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 hover:bg-card-hover transition-all text-left"
    >
      <div className="h-36 bg-secondary relative overflow-hidden">
        <img src={resource.cover} alt={resource.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
        <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-medium ${sc.bg} ${sc.text}`}>
          {subjectLabels[resource.subject]}
        </div>
        {pct === 100 && (
          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-success flex items-center justify-center">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#0D1117" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="text-xs text-muted-foreground mb-1">{resource.type === 'book' ? 'Book' : 'Article'} · {resource.pages} pages</p>
        <h3 className="text-sm font-medium text-foreground leading-snug mb-3 line-clamp-2">{resource.title}</h3>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
          <span className="text-[10px] font-mono text-muted-foreground">{pct}%</span>
        </div>
      </div>
    </button>
  )
}

function ResourceRow({ resource, onOpen }) {
  const sc = subjectColors[resource.subject]
  const pct = Math.round((resource.readPages / resource.pages) * 100)
  return (
    <button
      onClick={() => onOpen(resource)}
      className="group flex items-center gap-4 bg-card border border-border rounded-xl p-4 hover:border-primary/40 hover:bg-card-hover transition-all text-left"
    >
      <div className="w-10 h-10 rounded-lg bg-secondary overflow-hidden shrink-0">
        <img src={resource.cover} alt={resource.title} className="w-full h-full object-cover opacity-70" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h3 className="text-sm font-medium text-foreground truncate">{resource.title}</h3>
          <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium ${sc.bg} ${sc.text}`}>
            {subjectLabels[resource.subject]}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">{resource.type === 'book' ? 'Book' : 'Article'} · {resource.readPages}/{resource.pages} pages</p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-24 h-1.5 bg-secondary rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
        </div>
        <span className="text-xs font-mono text-muted-foreground w-8 text-right">{pct}%</span>
      </div>
      <svg className="text-muted-foreground group-hover:text-foreground transition-colors" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>
  )
}

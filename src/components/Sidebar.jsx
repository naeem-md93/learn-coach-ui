import { useAuth } from '../context/AuthContext'

const navItems = [
  {
    page: 'dashboard',
    label: 'My Library',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  {
    page: 'progress',
    label: 'My Progress',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
]

export default function Sidebar({ currentPage, onNavigate }) {
  const { user, logout } = useAuth()
  const initial = (user?.name || user?.email || '?').charAt(0).toUpperCase()

  const handleLogout = async () => {
    await logout()
    onNavigate('login')
  }

  return (
    <aside className="w-56 shrink-0 h-screen bg-card border-r border-border flex flex-col sticky top-0">
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0D1117" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <span className="font-semibold text-[15px] text-foreground">Learn Coach</span>
        </div>
      </div>

      <nav className="p-3 flex-1">
        {navItems.map((item) => {
          const active = currentPage === item.page
          return (
            <button
              key={item.page}
              onClick={() => onNavigate(item.page)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors mb-0.5 ${
                active
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <span className={active ? 'text-primary' : 'text-muted-foreground'}>{item.icon}</span>
              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="p-3 border-t border-border">
        <button
          onClick={() => onNavigate('upload')}
          className="w-full flex items-center gap-2 px-3 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-md text-sm font-medium transition-colors"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Upload New Resource
        </button>
        <div className="mt-3 flex items-center gap-2.5 px-2 py-2">
          <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs font-semibold shrink-0">{initial}</div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-medium text-foreground truncate">{user?.name || 'Account'}</p>
            <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Log out"
            className="shrink-0 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  )
}

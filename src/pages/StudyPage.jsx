import { useState, useRef, useEffect } from 'react'
import { pdfPages } from '../data'

const aiResponses = {
  default: "That's an interesting question. Based on this page's content, the normal distribution is one of the most fundamental concepts in statistics. If you have a more specific question, I'd be happy to help.",
  normal: 'The normal distribution, or Gaussian distribution, is a symmetric distribution shaped like a bell curve. Its key feature is that the mean, median, and mode are all equal, and the curve is perfectly symmetric about the mean. About 68% of the data fall within one standard deviation of the mean.',
  Z: 'The Z-score (or standard score) tells you how many standard deviations an observation is from the mean. Its formula is Z = (X - μ) / σ. For example, if Z = 2, the observation is 2 standard deviations above the mean. This transformation lets us use standard tables to compute probabilities.',
  'central limit': 'The Central Limit Theorem (CLT) states: if we take enough samples from a population with mean μ and variance σ², the distribution of the sample means approaches normal — even if the population itself is not normally distributed! This theorem underlies many statistical tests.',
}

function getAiResponse(msg) {
  const lower = msg.toLowerCase()
  for (const [key, val] of Object.entries(aiResponses)) {
    if (key !== 'default' && lower.includes(key.toLowerCase())) return val
  }
  return aiResponses.default
}

export default function StudyPage({ resource, onNavigate }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [zoom, setZoom] = useState(100)
  const [messages, setMessages] = useState([
    { role: 'ai', content: `Hi! I'm here to help you study "${resource.title}". Ask me anything about the content of the page you're reading.`, timestamp: 'now' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [readPages, setReadPages] = useState(new Set([1]))
  const [pageInput, setPageInput] = useState('1')
  const chatEndRef = useRef(null)
  const totalPages = pdfPages.length

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const goToPage = (p) => {
    const clamped = Math.max(1, Math.min(totalPages, p))
    setCurrentPage(clamped)
    setPageInput(String(clamped))
    setReadPages((prev) => new Set([...prev, clamped]))
  }

  const sendMessage = () => {
    if (!input.trim() || loading) return
    const userMsg = { role: 'user', content: input.trim(), timestamp: 'now' }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)
    setReadPages((prev) => new Set([...prev, currentPage]))
    setTimeout(() => {
      const reply = { role: 'ai', content: getAiResponse(userMsg.content), timestamp: 'now' }
      setMessages((prev) => [...prev, reply])
      setLoading(false)
    }, 1200 + Math.random() * 800)
  }

  const pageContent = pdfPages[currentPage - 1]

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-12 border-b border-border bg-card flex items-center px-4 gap-4 shrink-0">
        <button onClick={() => onNavigate('dashboard')} className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        </button>
        <div className="h-4 w-px bg-border" />
        <h1 className="text-sm font-medium text-foreground truncate flex-1">{resource.title}</h1>
        <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono shrink-0">
          <span>Page</span>
          <input
            type="number"
            value={pageInput}
            onChange={(e) => setPageInput(e.target.value)}
            onBlur={() => goToPage(parseInt(pageInput) || 1)}
            onKeyDown={(e) => e.key === 'Enter' && goToPage(parseInt(pageInput) || 1)}
            className="w-10 bg-secondary border border-border rounded px-1 py-0.5 text-center text-xs text-foreground focus:outline-none focus:border-ring"
          />
          <span>of {totalPages}</span>
        </div>
        <button
          onClick={() => onNavigate('quiz')}
          className="shrink-0 flex items-center gap-2 px-3.5 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:bg-primary/90 transition-colors"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
          End Study Session
        </button>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* PDF Viewer — 65% */}
        <div className="flex flex-col border-r border-border" style={{ width: '65%' }}>
          {/* PDF toolbar */}
          <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-card shrink-0">
            <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="p-1.5 rounded hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-muted-foreground hover:text-foreground">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => goToPage(p)}
                  className={`w-6 h-6 rounded text-[10px] font-mono transition-colors ${
                    p === currentPage
                      ? 'bg-primary text-primary-foreground'
                      : readPages.has(p)
                      ? 'bg-primary/20 text-primary hover:bg-primary/30'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="p-1.5 rounded hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-muted-foreground hover:text-foreground">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
            <div className="flex-1" />
            <div className="flex items-center gap-1">
              <button onClick={() => setZoom((z) => Math.max(60, z - 10))} className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors text-xs">−</button>
              <span className="text-xs font-mono text-muted-foreground w-9 text-center">{zoom}%</span>
              <button onClick={() => setZoom((z) => Math.min(150, z + 10))} className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors text-xs">+</button>
            </div>
          </div>

          {/* PDF content */}
          <div className="flex-1 overflow-y-auto bg-[#1a1d27] scroll-container">
            <div className="min-h-full flex items-start justify-center py-8 px-6">
              <div
                className="bg-[#faf9f6] rounded-sm shadow-2xl w-full max-w-2xl transition-all"
                style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
              >
                <div className="p-12 text-left">
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
                    <span className="text-[10px] text-gray-400 font-mono">{resource.title}</span>
                    <span className="text-[10px] text-gray-400 font-mono">Page {currentPage}</span>
                  </div>
                  <div className="text-gray-800 leading-8 whitespace-pre-line text-sm">
                    {pageContent?.content}
                  </div>
                  <div className="mt-10 pt-4 border-t border-gray-200 text-center text-[10px] text-gray-300 font-mono">
                    {currentPage} / {totalPages}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat panel — 35% */}
        <div className="flex flex-col bg-background" style={{ width: '35%' }}>
          <div className="px-4 py-3 border-b border-border bg-card shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7C5CFC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
              <span className="text-sm font-medium text-foreground">AI Assistant</span>
              <span className="text-[10px] bg-success/10 text-success px-1.5 py-0.5 rounded-full">Online</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-container">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 animate-fade-in ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {msg.role === 'ai' && (
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#7C5CFC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  </div>
                )}
                <div
                  className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-tr-sm'
                      : 'bg-card border border-border text-foreground rounded-tl-sm'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2 animate-fade-in">
                <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#7C5CFC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </div>
                <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3 dot-pulse">
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-3 border-t border-border bg-card shrink-0">
            <div className="flex gap-2 items-end">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                placeholder="Ask about this page..."
                rows={2}
                className="flex-1 bg-secondary border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring resize-none transition-colors leading-relaxed"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="p-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5 px-1">Enter to send · Shift+Enter for a new line</p>
          </div>
        </div>
      </div>
    </div>
  )
}

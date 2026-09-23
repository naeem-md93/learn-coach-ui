import { useState, useRef } from 'react'
import Sidebar from '../components/Sidebar'
import { subjectLabels } from '../data'

const subjects = ['Biology', 'Mathematics', 'Statistics', 'Electronics', 'Physics']

export default function UploadPage({ onNavigate }) {
  const [dragging, setDragging] = useState(false)
  const [file, setFile] = useState(null)
  const [subject, setSubject] = useState('')
  const [type, setType] = useState('')
  const [uploading, setUploading] = useState(false)
  const [done, setDone] = useState(false)
  const [progress, setProgress] = useState(0)
  const inputRef = useRef(null)

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f && f.type === 'application/pdf') setFile(f)
  }

  const handleUpload = () => {
    if (!file || !subject || !type) return
    setUploading(true)
    let p = 0
    const interval = setInterval(() => {
      p += Math.random() * 15 + 5
      if (p >= 100) {
        p = 100
        clearInterval(interval)
        setTimeout(() => { setDone(true) }, 400)
      }
      setProgress(Math.min(p, 100))
    }, 200)
  }

  if (done) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar currentPage="dashboard" onNavigate={onNavigate} />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="text-center animate-fade-in max-w-sm">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-5">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3FB950" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Upload successful</h2>
            <p className="text-muted-foreground text-sm mb-6">&ldquo;{file?.name}&rdquo; has been added to your library.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => onNavigate('dashboard')} className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                Go to Library
              </button>
              <button onClick={() => { setFile(null); setDone(false); setProgress(0); setUploading(false) }} className="px-5 py-2.5 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-secondary transition-colors">
                Upload another
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar currentPage="dashboard" onNavigate={onNavigate} />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-8">
          <button onClick={() => onNavigate('dashboard')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Back to Library
          </button>

          <h1 className="text-2xl font-semibold text-foreground mb-1">Upload New Resource</h1>
          <p className="text-muted-foreground text-sm mb-8">Upload a PDF of a book or scientific article.</p>

          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
              dragging ? 'border-primary bg-primary/5' : file ? 'border-success/50 bg-success/5' : 'border-border hover:border-primary/50 hover:bg-secondary/50'
            }`}
          >
            <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) setFile(f) }} />
            {file ? (
              <div>
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center mx-auto mb-3">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3FB950" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                  </svg>
                </div>
                <p className="font-medium text-foreground text-sm">{file.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                <button onClick={(e) => { e.stopPropagation(); setFile(null) }} className="mt-3 text-xs text-danger hover:underline">Remove file</button>
              </div>
            ) : (
              <div>
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-3">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8B949E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
                    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
                  </svg>
                </div>
                <p className="font-medium text-foreground text-sm mb-1">Drop your PDF here</p>
                <p className="text-xs text-muted-foreground">or click to choose a file</p>
                <p className="text-xs text-muted-foreground mt-1 opacity-60">Max 50 MB · PDF only</p>
              </div>
            )}
          </div>

          {/* Form */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-ring transition-colors appearance-none"
              >
                <option value="">Select...</option>
                {subjects.map((s) => (
                  <option key={s} value={s}>{subjectLabels[s]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Resource type</label>
              <div className="flex gap-2">
                {['book', 'article'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`flex-1 py-2.5 border rounded-lg text-sm font-medium transition-colors ${
                      type === t ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-border/80 hover:text-foreground'
                    }`}
                  >
                    {t === 'book' ? 'Book' : 'Article'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {uploading && (
            <div className="mt-6 bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-foreground">Uploading and processing...</span>
                <span className="text-sm font-mono text-primary">{Math.round(progress)}%</span>
              </div>
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          {!uploading && (
            <button
              onClick={handleUpload}
              disabled={!file || !subject || !type}
              className="mt-6 w-full py-3 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Upload and start processing
            </button>
          )}
        </div>
      </main>
    </div>
  )
}

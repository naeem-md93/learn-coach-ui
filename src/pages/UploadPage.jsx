import { useState, useRef } from 'react'
import Sidebar from '../components/Sidebar'
import { uploadResource } from '../lib/resourcesApi'
import { ApiError } from '../lib/apiClient'

// Backend enum values (lowercase, per CONTEXT.md Subject glossary) paired
// with display labels. Keep the value the source of truth sent to the API.
const subjects = [
  { value: 'biology', label: 'Biology' },
  { value: 'mathematics', label: 'Mathematics' },
  { value: 'statistics', label: 'Statistics' },
  { value: 'electronics', label: 'Electronics' },
]

const resourceTypes = [
  { value: 'book', label: 'Book' },
  { value: 'paper', label: 'Article / Paper' },
]

export default function UploadPage({ onNavigate }) {
  const [dragging, setDragging] = useState(false)
  const [file, setFile] = useState(null)
  const [subject, setSubject] = useState('')
  const [resourceType, setResourceType] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [uploaded, setUploaded] = useState(null)
  const inputRef = useRef(null)

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f && f.type === 'application/pdf') setFile(f)
  }

  const handleUpload = async () => {
    if (!file || !subject || !resourceType || uploading) return
    setUploading(true)
    setError(null)
    try {
      const resource = await uploadResource({ file, resourceType, subject })
      setUploaded(resource)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const resetForm = () => {
    setFile(null)
    setUploaded(null)
    setError(null)
    setSubject('')
    setResourceType('')
  }

  if (uploaded) {
    // Django may still be waiting on title extraction to fully "settle" by
    // the time we get here (sync but can be slow) — title_status can be
    // pending/failed; fall back to the filename either way per the task.
    const isPending = uploaded.title_status === 'pending'
    const isFailed = uploaded.title_status === 'failed'
    const displayTitle = uploaded.title || file?.name

    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar currentPage="dashboard" onNavigate={onNavigate} />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="text-center animate-fade-in max-w-sm">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-5">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3FB950" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Upload successful</h2>
            <p className="text-muted-foreground text-sm mb-2">&ldquo;{displayTitle}&rdquo; has been added to your library.</p>
            {isPending && (
              <p className="text-xs text-warning mb-4">Title is still being processed — it will update shortly.</p>
            )}
            {isFailed && (
              <p className="text-xs text-danger mb-4">Title extraction failed — showing the file name instead.</p>
            )}
            <div className="flex gap-3 justify-center mt-4">
              <button onClick={() => onNavigate('dashboard')} className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                Go to Library
              </button>
              <button onClick={resetForm} className="px-5 py-2.5 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-secondary transition-colors">
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

          {error && (
            <div className="mb-6 px-4 py-3 rounded-lg bg-danger/10 border border-danger/30 text-danger text-sm">
              {error}
            </div>
          )}

          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); if (!uploading) setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={uploading ? undefined : handleDrop}
            onClick={() => { if (!uploading) inputRef.current?.click() }}
            className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all ${
              uploading ? 'cursor-not-allowed opacity-70 border-border' : 'cursor-pointer'
            } ${
              dragging ? 'border-primary bg-primary/5' : file ? 'border-success/50 bg-success/5' : 'border-border hover:border-primary/50 hover:bg-secondary/50'
            }`}
          >
            <input ref={inputRef} type="file" accept=".pdf" className="hidden" disabled={uploading} onChange={(e) => { const f = e.target.files?.[0]; if (f) setFile(f) }} />
            {file ? (
              <div>
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center mx-auto mb-3">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3FB950" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                  </svg>
                </div>
                <p className="font-medium text-foreground text-sm">{file.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                {!uploading && (
                  <button onClick={(e) => { e.stopPropagation(); setFile(null) }} className="mt-3 text-xs text-danger hover:underline">Remove file</button>
                )}
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
                disabled={uploading}
                className="w-full px-3.5 py-2.5 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-ring transition-colors appearance-none disabled:opacity-60"
              >
                <option value="">Select...</option>
                {subjects.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Resource type</label>
              <div className="flex gap-2">
                {resourceTypes.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    disabled={uploading}
                    onClick={() => setResourceType(t.value)}
                    className={`flex-1 py-2.5 border rounded-lg text-sm font-medium transition-colors disabled:opacity-60 ${
                      resourceType === t.value ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-border/80 hover:text-foreground'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {uploading && (
            <div className="mt-6 bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-3">
                <span className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin shrink-0" />
                <span className="text-sm text-foreground">Uploading and processing — this can take a few seconds while we extract the title...</span>
              </div>
            </div>
          )}

          {!uploading && (
            <button
              onClick={handleUpload}
              disabled={!file || !subject || !resourceType}
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

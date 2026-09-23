import Sidebar from '../components/Sidebar'
import { mockResources, subjectColors, subjectLabels } from '../data'

const concepts = [
  { name: 'Normal Distribution', subject: 'Statistics', mastery: 92, quizzes: 4 },
  { name: 'Central Limit Theorem', subject: 'Statistics', mastery: 78, quizzes: 3 },
  { name: 'Hypothesis Testing', subject: 'Statistics', mastery: 65, quizzes: 2 },
  { name: 'Photosynthesis', subject: 'Biology', mastery: 88, quizzes: 2 },
  { name: 'Correlation & Regression', subject: 'Statistics', mastery: 70, quizzes: 3 },
  { name: 'Cell Division', subject: 'Biology', mastery: 55, quizzes: 1 },
  { name: 'Differentiation', subject: 'Mathematics', mastery: 82, quizzes: 2 },
  { name: 'Analysis of Variance', subject: 'Statistics', mastery: 48, quizzes: 2 },
  { name: 'Integration', subject: 'Mathematics', mastery: 73, quizzes: 1 },
  { name: 'Transistors & Circuits', subject: 'Electronics', mastery: 30, quizzes: 1 },
]

const quizHistory = [
  { date: '2024/09/06', resource: 'Probability, Statistics, and an Introduction to Data Science', score: 85, total: 10 },
  { date: '2024/09/01', resource: 'Photosynthesis and the Calvin Cycle', score: 90, total: 10 },
  { date: '2024/08/19', resource: 'Molecular Biology of the Cell', score: 60, total: 10 },
  { date: '2024/08/06', resource: 'Differential and Integral Calculus', score: 75, total: 10 },
]

export default function ProgressPage({ onNavigate }) {
  const avgMastery = Math.round(concepts.reduce((a, c) => a + c.mastery, 0) / concepts.length)
  const strong = concepts.filter((c) => c.mastery >= 75).length
  const weak = concepts.filter((c) => c.mastery < 60).length

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar currentPage="progress" onNavigate={onNavigate} />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-foreground mb-1">My Progress</h1>
            <p className="text-muted-foreground text-sm">Your strengths and weaknesses based on quizzes taken</p>
          </div>

          {/* Overview stats */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Average mastery', value: `${avgMastery}%`, color: 'text-primary' },
              { label: 'Concepts mastered', value: `${strong}`, color: 'text-success' },
              { label: 'Needs practice', value: `${weak}`, color: 'text-warning' },
              { label: 'Quizzes taken', value: quizHistory.length, color: 'text-foreground' },
            ].map((s) => (
              <div key={s.label} className="bg-card border border-border rounded-xl p-4">
                <p className={`text-2xl font-semibold mb-1 ${s.color}`}>{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-5 gap-6 mb-8">
            {/* Concept mastery bars */}
            <div className="col-span-3 bg-card border border-border rounded-xl p-5">
              <h2 className="text-sm font-semibold text-foreground mb-4">Concepts — Mastery Level</h2>
              <div className="space-y-3">
                {concepts
                  .sort((a, b) => b.mastery - a.mastery)
                  .map((c) => {
                    const sc = subjectColors[c.subject]
                    const color = c.mastery >= 75 ? 'bg-success' : c.mastery >= 60 ? 'bg-primary' : c.mastery >= 40 ? 'bg-warning' : 'bg-danger'
                    return (
                      <div key={c.name}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${sc.bg} ${sc.text}`}>
                              {subjectLabels[c.subject]}
                            </span>
                            <span className="text-sm text-foreground">{c.name}</span>
                          </div>
                          <span className="text-xs font-mono text-muted-foreground">{c.mastery}%</span>
                        </div>
                        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${c.mastery}%` }} />
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>

            {/* By resource */}
            <div className="col-span-2 bg-card border border-border rounded-xl p-5">
              <h2 className="text-sm font-semibold text-foreground mb-4">Resource Progress</h2>
              <div className="space-y-4">
                {mockResources.map((r) => {
                  const sc = subjectColors[r.subject]
                  const pct = Math.round((r.readPages / r.pages) * 100)
                  return (
                    <div key={r.id}>
                      <div className="flex items-start justify-between mb-1.5 gap-2">
                        <p className="text-xs text-foreground leading-tight line-clamp-2">{r.title}</p>
                        <span className="text-xs font-mono text-muted-foreground shrink-0">{pct}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${sc.dot}`}
                            style={{ width: `${pct}%`, opacity: 0.7 }}
                          />
                        </div>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded ${sc.bg} ${sc.text}`}>
                          {subjectLabels[r.subject]}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Quiz history */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="text-sm font-semibold text-foreground mb-4">Quiz History</h2>
            <div className="space-y-2">
              {quizHistory.map((h, i) => {
                const pct = Math.round((h.score / h.total) * 100)
                const color = pct >= 85 ? 'text-success' : pct >= 70 ? 'text-primary' : pct >= 50 ? 'text-warning' : 'text-danger'
                return (
                  <div key={i} className="flex items-center gap-4 py-2.5 border-b border-border last:border-0">
                    <span className="text-xs text-muted-foreground font-mono w-24 shrink-0">{h.date}</span>
                    <p className="flex-1 text-sm text-foreground truncate">{h.resource}</p>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="w-16 h-1 bg-secondary rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${pct >= 85 ? 'bg-success' : pct >= 70 ? 'bg-primary' : pct >= 50 ? 'bg-warning' : 'bg-danger'}`} style={{ width: `${pct}%` }} />
                      </div>
                      <span className={`text-sm font-semibold ${color} w-9 text-right font-mono`}>{pct}%</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

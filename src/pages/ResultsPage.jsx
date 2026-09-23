import { mockQuizQuestions } from '../data'

export default function ResultsPage({ answers, onNavigate }) {
  const questions = mockQuizQuestions

  const scores = questions.map((q) => {
    const selected = answers[q.id] || []
    const correct = q.correctAnswers
    const isFullyCorrect =
      selected.length === correct.length &&
      selected.every((s) => correct.includes(s))
    const isPartiallyCorrect =
      !isFullyCorrect && selected.some((s) => correct.includes(s))
    return { q, selected, isFullyCorrect, isPartiallyCorrect }
  })

  const fullCorrect = scores.filter((s) => s.isFullyCorrect).length
  const partial = scores.filter((s) => s.isPartiallyCorrect).length
  const totalScore = Math.round(((fullCorrect + partial * 0.5) / questions.length) * 100)

  const grade =
    totalScore >= 85 ? { label: 'Excellent', color: 'text-success' }
    : totalScore >= 70 ? { label: 'Good', color: 'text-primary' }
    : totalScore >= 50 ? { label: 'Average', color: 'text-warning' }
    : { label: 'Needs more practice', color: 'text-danger' }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-3 flex items-center justify-between">
          <h1 className="text-sm font-semibold text-foreground">Quiz Results</h1>
          <div className="flex gap-2">
            <button onClick={() => onNavigate('study')} className="px-3.5 py-1.5 border border-border rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
              Back to Study
            </button>
            <button onClick={() => onNavigate('dashboard')} className="px-3.5 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors">
              My Library
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Score card */}
        <div className="bg-card border border-border rounded-2xl p-8 mb-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary mb-4">
            <span className={`text-3xl font-bold ${grade.color}`}>{totalScore}%</span>
          </div>
          <p className={`text-lg font-semibold mb-1 ${grade.color}`}>{grade.label}</p>
          <p className="text-muted-foreground text-sm">
            {fullCorrect} fully correct · {partial} partially correct · {questions.length - fullCorrect - partial} incorrect
          </p>
          <div className="flex gap-4 justify-center mt-5">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="w-2.5 h-2.5 rounded-sm bg-success" />
              Fully correct
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="w-2.5 h-2.5 rounded-sm bg-warning" />
              Partially correct
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="w-2.5 h-2.5 rounded-sm bg-danger" />
              Incorrect
            </div>
          </div>
        </div>

        {/* Per-question results */}
        <div className="space-y-5">
          {scores.map(({ q, selected, isFullyCorrect, isPartiallyCorrect }, i) => {
            const statusColor = isFullyCorrect ? 'border-success/30' : isPartiallyCorrect ? 'border-warning/30' : 'border-danger/30'
            const statusBg = isFullyCorrect ? 'bg-success/5' : isPartiallyCorrect ? 'bg-warning/5' : 'bg-danger/5'

            return (
              <div key={q.id} className={`border rounded-xl p-5 ${statusColor} ${statusBg}`}>
                <div className="flex items-start gap-3 mb-4">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-mono ${
                    isFullyCorrect ? 'bg-success/20 text-success' : isPartiallyCorrect ? 'bg-warning/20 text-warning' : 'bg-danger/20 text-danger'
                  }`}>{i + 1}</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground leading-relaxed mb-3">{q.question}</p>
                    <div className="space-y-1.5">
                      {q.options.map((opt, oi) => {
                        const isSelected = selected.includes(oi)
                        const isCorrect = q.correctAnswers.includes(oi)
                        let optClass = 'border-border text-muted-foreground'
                        if (isCorrect && isSelected) optClass = 'border-success/50 bg-success/8 text-foreground'
                        else if (isCorrect && !isSelected) optClass = 'border-success/40 bg-success/5 text-foreground'
                        else if (!isCorrect && isSelected) optClass = 'border-danger/50 bg-danger/8 text-foreground'

                        return (
                          <div key={oi} className={`flex items-start gap-2.5 px-3 py-2 rounded-lg border text-xs ${optClass}`}>
                            <span className="shrink-0 mt-0.5">
                              {isCorrect && isSelected ? '✓' : isCorrect ? '○' : isSelected ? '✗' : ' '}
                            </span>
                            <span className="leading-relaxed">{opt}</span>
                            {isCorrect && !isSelected && (
                              <span className="ml-auto text-success text-[10px] shrink-0">Correct answer</span>
                            )}
                          </div>
                        )
                      })}
                    </div>
                    <div className="mt-3 bg-card/60 border border-border/60 rounded-lg px-3.5 py-2.5">
                      <p className="text-xs font-medium text-muted-foreground mb-0.5">AI Explanation</p>
                      <p className="text-xs text-foreground/80 leading-relaxed">{q.explanation}</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-8 flex gap-3 justify-center">
          <button onClick={() => onNavigate('progress')} className="px-6 py-2.5 border border-border rounded-lg text-sm text-foreground hover:bg-secondary transition-colors">
            View Overall Progress
          </button>
          <button onClick={() => onNavigate('dashboard')} className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
            Go to Library
          </button>
        </div>
      </div>
    </div>
  )
}

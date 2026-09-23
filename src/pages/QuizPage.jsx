import { useState } from 'react'
import { mockQuizQuestions } from '../data'

export default function QuizPage({ resource, onNavigate, onSubmit }) {
  const [answers, setAnswers] = useState({})
  const questions = mockQuizQuestions

  const toggle = (qId, optIdx) => {
    setAnswers((prev) => {
      const current = prev[qId] || []
      return {
        ...prev,
        [qId]: current.includes(optIdx) ? current.filter((x) => x !== optIdx) : [...current, optIdx],
      }
    })
  }

  const answered = Object.keys(answers).length
  const allAnswered = answered === questions.length

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-3 flex items-center gap-4">
          <div className="flex-1">
            <h1 className="text-sm font-semibold text-foreground">End-of-Session Quiz</h1>
            <p className="text-xs text-muted-foreground truncate">{resource.title}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-24 h-1.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${(answered / questions.length) * 100}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground font-mono">{answered}/{questions.length}</span>
            </div>
            <button
              onClick={() => onSubmit(answers)}
              disabled={!allAnswered}
              className="px-4 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Submit Answers
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="bg-accent/5 border border-accent/20 rounded-xl px-4 py-3 mb-8 flex items-start gap-3">
          <svg className="text-accent mt-0.5 shrink-0" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <p className="text-sm text-accent">Some questions may have <strong>more than one correct answer</strong>. Use the checkboxes to select multiple options.</p>
        </div>

        <div className="space-y-6">
          {questions.map((q, qi) => {
            const selected = answers[q.id] || []
            return (
              <div key={q.id} className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-start gap-3 mb-5">
                  <span className="shrink-0 w-7 h-7 rounded-full bg-secondary text-muted-foreground text-xs flex items-center justify-center font-mono font-medium mt-0.5">
                    {qi + 1}
                  </span>
                  <p className="text-foreground text-sm leading-relaxed font-medium">{q.question}</p>
                </div>
                <div className="space-y-2 ml-10">
                  {q.options.map((opt, oi) => {
                    const checked = selected.includes(oi)
                    return (
                      <label
                        key={oi}
                        className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                          checked
                            ? 'border-primary/50 bg-primary/8'
                            : 'border-border hover:border-border/60 hover:bg-secondary/50'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          checked ? 'border-primary bg-primary' : 'border-muted-foreground'
                        }`}>
                          {checked && (
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#0D1117" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                          )}
                        </div>
                        <input type="checkbox" className="hidden" checked={checked} onChange={() => toggle(q.id, oi)} />
                        <span className="text-sm text-foreground leading-relaxed">{opt}</span>
                      </label>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-8 flex gap-3 justify-end">
          <button onClick={() => onNavigate('study')} className="px-5 py-2.5 border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            Back to Study
          </button>
          <button
            onClick={() => onSubmit(answers)}
            disabled={!allAnswered}
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Submit Answers and See Results
          </button>
        </div>
        {!allAnswered && (
          <p className="text-center text-xs text-muted-foreground mt-3">
            {questions.length - answered} question{questions.length - answered === 1 ? '' : 's'} still unanswered
          </p>
        )}
      </div>
    </div>
  )
}

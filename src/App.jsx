import { useState } from 'react'
import { mockResources } from './data'
import { useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import UploadPage from './pages/UploadPage'
import StudyPage from './pages/StudyPage'
import QuizPage from './pages/QuizPage'
import ResultsPage from './pages/ResultsPage'
import ProgressPage from './pages/ProgressPage'

// Pages that require an authenticated session. Anything not in this list
// (currently just 'login') is reachable while logged out.
const PROTECTED_PAGES = new Set(['dashboard', 'upload', 'study', 'quiz', 'results', 'progress'])

export default function App() {
  const [page, setPage] = useState('login')
  const [activeResource, setActiveResource] = useState(mockResources[0])
  const [quizAnswers, setQuizAnswers] = useState({})
  const { isAuthenticated, isLoading } = useAuth()

  const navigate = (p) => setPage(p)

  // While hydrating the session on app load, avoid flashing either page.
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    )
  }

  // Gate any protected page string behind auth — bounce back to login
  // rather than letting hand-rolled navigation reach it while logged out.
  if (PROTECTED_PAGES.has(page) && !isAuthenticated) {
    return <LoginPage onNavigate={navigate} />
  }

  // Already-authenticated users shouldn't see the login form again — fall
  // through to the default (dashboard) branch below instead.
  if (page === 'login' && !isAuthenticated) return <LoginPage onNavigate={navigate} />

  if (page === 'upload') return <UploadPage onNavigate={navigate} />

  if (page === 'study')
    return (
      <StudyPage
        resource={activeResource}
        onNavigate={navigate}
      />
    )

  if (page === 'quiz')
    return (
      <QuizPage
        resource={activeResource}
        onNavigate={navigate}
        onSubmit={(answers) => {
          setQuizAnswers(answers)
          navigate('results')
        }}
      />
    )

  if (page === 'results')
    return <ResultsPage answers={quizAnswers} onNavigate={navigate} />

  if (page === 'progress') return <ProgressPage onNavigate={navigate} />

  return (
    <DashboardPage
      onNavigate={navigate}
      onOpenResource={(r) => {
        setActiveResource(r)
        navigate('study')
      }}
    />
  )
}

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from '../../components/pages/LandingPage'
import StartPage from '../../components/pages/StartPage'
import AssessmentPage from '../../components/pages/AssessmentPage'
import ResultsPage from '../../components/pages/ResultsPage'
import DevProcessingPage from '../../components/pages/DevProcessingPage'
import DevResultsPage from '../../components/pages/DevResultsPage'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/start" element={<StartPage />} />
        <Route path="/assessment/:sessionId" element={<AssessmentPage />} />
        <Route path="/results/:publicToken" element={<ResultsPage />} />
        {/* Dev-only routes - only available in development mode */}
        {import.meta.env.DEV && (
          <>
            <Route path="/dev/processing" element={<DevProcessingPage />} />
            <Route path="/dev/results" element={<DevResultsPage />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  )
}


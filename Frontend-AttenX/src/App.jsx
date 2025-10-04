import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Upload from './pages/Upload'
import Reports from './pages/Reports'
import Anomalies from './pages/Anomalies'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/anomalies" element={<Anomalies />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  )
}

export default App
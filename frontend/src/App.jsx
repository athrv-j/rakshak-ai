import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { AnimatePresence, motion } from 'framer-motion'
import Home from './pages/Home'
import Analyze from './pages/Analyze'
import TrustPassport from './pages/TrustPassport'
import FullGraph from './pages/FullGraph'
import SharedResult from './pages/SharedResult'
import CompareCases from './pages/CompareCases'
import NotFound from './pages/NotFound'
import Navbar from './components/Navbar'
import ErrorBoundary from './components/ErrorBoundary'
import ParticleBackground from './components/ParticleBackground'
import { LanguageProvider } from './context/LanguageContext'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        <Routes location={location}>
          <Route path="/"              element={<Home />} />
          <Route path="/analyze"       element={<Analyze />} />
          <Route path="/result/:id"    element={<TrustPassport />} />
          <Route path="/graph"         element={<FullGraph />} />
          <Route path="/compare"       element={<CompareCases />} />
          <Route path="/shared/:id"    element={<SharedResult />} />
          <Route path="*"             element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans antialiased selection:bg-orange-100 selection:text-orange-950 relative cyber-grid">
            <ParticleBackground />
            <Navbar />
            <ScrollToTop />
            <AnimatedRoutes />
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: '#ffffff',
                  color: '#1c1917',
                  border: '1px solid #e5dfd5',
                  boxShadow: '0 10px 25px -5px rgba(28, 25, 23, 0.08), 0 8px 10px -6px rgba(28, 25, 23, 0.04)',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: 500,
                },
              }}
            />
          </div>
        </BrowserRouter>
      </LanguageProvider>
    </ErrorBoundary>
  )
}

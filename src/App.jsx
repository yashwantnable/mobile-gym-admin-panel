import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Topbar from './components/Layout/Topbar.jsx'
import Sidebar from './components/Layout/Sidebar.jsx'
import Footer from './components/Layout/Footer.jsx'
import Dashboard from './components/Dashboard/Dashboard.jsx'
import SessionManagement from './components/Sessions/SessionManagement.jsx'
import TrainerManagement from './components/Trainers/TrainerManagement.jsx'
import ClientManagement from './components/Clients/ClientManagement.jsx'
import BookingSchedule from './components/Bookings/BookingSchedule.jsx'
import PaymentBilling from './components/Payments/PaymentBilling.jsx'
import PromoCodesManagement from './components/PromoCodes/PromoCodesManagement.jsx'
import ReportingAnalytics from './components/Reports/ReportingAnalytics.jsx'

function App() {
  const [sidebarVisible, setSidebarVisible] = useState(false)
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard')

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible)
  }

  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.98
    },
    in: {
      opacity: 1,
      y: 0,
      scale: 1
    },
    out: {
      opacity: 0,
      y: -20,
      scale: 1.02
    }
  }

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.4
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-fitness-bg via-fitness-bg to-orange-50 font-poppins">
        {/* Background decorative elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-fitness-accent/20 to-fitness-accent-secondary/20 rounded-full blur-3xl floating"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-fitness-warning/20 to-fitness-accent/20 rounded-full blur-3xl floating" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-fitness-accent-secondary/10 to-fitness-accent/10 rounded-full blur-3xl floating" style={{ animationDelay: '4s' }}></div>
        </div>

        <Topbar onMenuToggle={toggleSidebar} />
        
        <div className="flex relative z-10">
          <Sidebar 
            visible={sidebarVisible}
            onHide={() => setSidebarVisible(false)}
            activeMenuItem={activeMenuItem}
            setActiveMenuItem={setActiveMenuItem}
          />
          
          <main className="flex-1 p-4 md:p-6 ml-0 lg:ml-64 mt-16 min-h-screen">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeMenuItem}
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                className="w-full"
              >
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/sessions" element={<SessionManagement />} />
                  <Route path="/trainers" element={<TrainerManagement />} />
                  <Route path="/clients" element={<ClientManagement />} />
                  <Route path="/bookings" element={<BookingSchedule />} />
                  <Route path="/payments" element={<PaymentBilling />} />
                  <Route path="/promo-codes" element={<PromoCodesManagement />} />
                  <Route path="/reports" element={<ReportingAnalytics />} />
                </Routes>
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
        
        <Footer />
      </div>
    </Router>
  )
}

export default App
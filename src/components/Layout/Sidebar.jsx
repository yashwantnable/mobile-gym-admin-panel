import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Sidebar as PrimeSidebar } from 'primereact/sidebar'
import { Menu } from 'primereact/menu'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home, 
  Calendar, 
  Users, 
  User, 
  Clock, 
  CreditCard, 
  Tag, 
  BarChart3,
  X
} from 'lucide-react'

const Sidebar = ({ visible, onHide, activeMenuItem, setActiveMenuItem }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    {
      label: 'Dashboard',
      icon: Home,
      path: '/dashboard',
      key: 'dashboard'
    },
    {
      label: 'Session Management',
      icon: Calendar,
      path: '/sessions',
      key: 'sessions'
    },
    {
      label: 'Trainer Management',
      icon: Users,
      path: '/trainers',
      key: 'trainers'
    },
    {
      label: 'Client Management',
      icon: User,
      path: '/clients',
      key: 'clients'
    },
    {
      label: 'Booking & Schedule',
      icon: Clock,
      path: '/bookings',
      key: 'bookings'
    },
    {
      label: 'Payment & Billing',
      icon: CreditCard,
      path: '/payments',
      key: 'payments'
    },
    {
      label: 'Promo Codes',
      icon: Tag,
      path: '/promo-codes',
      key: 'promo-codes'
    },
    {
      label: 'Reporting & Analytics',
      icon: BarChart3,
      path: '/reports',
      key: 'reports'
    }
  ]

  const handleMenuClick = (item) => {
    navigate(item.path)
    setActiveMenuItem(item.key)
    onHide()
  }

  const isActive = (path) => location.pathname === path

  // Desktop sidebar
  const DesktopSidebar = () => (
    <motion.div 
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed left-0 top-16 bottom-0 w-64 glass-strong border-r border-white/20 z-40 hidden lg:block shadow-strong"
    >
      <div className="p-6 h-full overflow-y-auto">
        <nav className="space-y-2">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon
            const active = isActive(item.path)
            
            return (
              <motion.div
                key={item.key}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                whileHover={{ x: 8 }}
                whileTap={{ scale: 0.98 }}
              >
                <button
                  onClick={() => handleMenuClick(item)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                    active 
                      ? 'bg-gradient-to-r from-fitness-accent to-fitness-accent-secondary text-white shadow-medium' 
                      : 'text-fitness-primary hover:bg-white/50 hover:shadow-soft'
                  }`}
                >
                  <IconComponent 
                    size={20} 
                    className={`transition-all duration-300 ${
                      active ? 'text-white' : 'text-fitness-accent group-hover:text-fitness-accent-secondary'
                    }`} 
                  />
                  <span className={`font-medium transition-all duration-300 ${
                    active ? 'text-white' : 'text-fitness-primary'
                  }`}>
                    {item.label}
                  </span>
                  {active && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto w-2 h-2 bg-white rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              </motion.div>
            )
          })}
        </nav>
      </div>
    </motion.div>
  )

  // Mobile sidebar
  const MobileSidebar = () => (
    <PrimeSidebar
      visible={visible}
      onHide={onHide}
      position="left"
      className="lg:hidden"
      style={{ width: '280px' }}
      modal
      blockScroll
    >
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/20">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-fitness-accent to-fitness-accent-secondary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">F</span>
                </div>
                <h2 className="text-lg font-bold gradient-text">Menu</h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onHide}
                className="p-2 rounded-lg glass hover:bg-white/20 transition-colors"
              >
                <X size={20} className="text-fitness-primary" />
              </motion.button>
            </div>

            {/* Navigation */}
            <nav className="p-6 space-y-2">
              {menuItems.map((item, index) => {
                const IconComponent = item.icon
                const active = isActive(item.path)
                
                return (
                  <motion.div
                    key={item.key}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <button
                      onClick={() => handleMenuClick(item)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                        active 
                          ? 'bg-gradient-to-r from-fitness-accent to-fitness-accent-secondary text-white shadow-medium' 
                          : 'text-fitness-primary hover:bg-white/50 hover:shadow-soft'
                      }`}
                    >
                      <IconComponent 
                        size={20} 
                        className={active ? 'text-white' : 'text-fitness-accent'} 
                      />
                      <span className={`font-medium ${
                        active ? 'text-white' : 'text-fitness-primary'
                      }`}>
                        {item.label}
                      </span>
                    </button>
                  </motion.div>
                )
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </PrimeSidebar>
  )

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  )
}

export default Sidebar
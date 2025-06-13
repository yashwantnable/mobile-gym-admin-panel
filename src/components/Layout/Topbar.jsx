import React, { useState } from 'react'
import { Button } from 'primereact/button'
import { Menu } from 'primereact/menu'
import { Badge } from 'primereact/badge'
import { Avatar } from 'primereact/avatar'
import { motion } from 'framer-motion'
import { Bell, User, Settings, LogOut, Menu as MenuIcon } from 'lucide-react'

const Topbar = ({ onMenuToggle }) => {
  const [userMenuVisible, setUserMenuVisible] = useState(false)
  const [notificationCount] = useState(3)
  
  const userMenuItems = [
    {
      label: 'Profile',
      icon: 'pi pi-user',
      command: () => {
        console.log('Profile clicked')
      }
    },
    {
      label: 'Settings',
      icon: 'pi pi-cog',
      command: () => {
        console.log('Settings clicked')
      }
    },
    {
      separator: true
    },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => {
        console.log('Logout clicked')
      }
    }
  ]

  return (
    <motion.div 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 glass-strong shadow-medium border-b border-white/20"
    >
      <div className="flex items-center justify-between px-4 md:px-6 py-3">
        {/* Left side - Menu toggle and Logo */}
        <div className="flex items-center space-x-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              className="lg:hidden p-button-text p-button-rounded glass"
              onClick={onMenuToggle}
            >
              <MenuIcon size={20} className="text-fitness-primary" />
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-fitness-accent to-fitness-accent-secondary rounded-xl flex items-center justify-center shadow-medium">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold gradient-text">
              Fitness Admin
            </h1>
          </motion.div>
        </div>

        {/* Right side - Notifications and User menu */}
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <motion.div 
            className="relative"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button className="p-button-text p-button-rounded glass relative">
              <Bell size={20} className="text-fitness-accent" />
              {notificationCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1"
                >
                  <Badge 
                    value={notificationCount} 
                    severity="danger"
                    className="bg-gradient-to-r from-red-500 to-red-600"
                  />
                </motion.div>
              )}
            </Button>
          </motion.div>

          {/* User Profile */}
          <motion.div 
            className="relative"
            whileHover={{ scale: 1.02 }}
          >
            <div 
              className="flex items-center space-x-3 glass px-3 py-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-medium"
              onClick={(e) => setUserMenuVisible(!userMenuVisible)}
            >
              <Avatar 
                icon="pi pi-user" 
                className="bg-gradient-to-br from-fitness-accent to-fitness-accent-secondary text-white"
                shape="circle" 
                size="normal"
              />
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-fitness-primary">Admin User</p>
                <p className="text-xs text-fitness-secondary">Administrator</p>
              </div>
              <i className="pi pi-chevron-down text-fitness-secondary text-xs"></i>
            </div>
            
            <Menu
              model={userMenuItems}
              popup
              ref={(el) => el && userMenuVisible && el.show()}
              onHide={() => setUserMenuVisible(false)}
              className="mt-2"
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default Topbar
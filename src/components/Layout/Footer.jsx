import React from 'react'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'

const Footer = () => {
  return (
    <motion.footer 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass border-t border-white/20 py-6 mt-8 ml-0 lg:ml-64"
    >
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <motion.p 
            className="text-fitness-secondary text-sm flex items-center space-x-2"
            whileHover={{ scale: 1.02 }}
          >
            <span>© 2025 Fitness Admin Panel</span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <span>Made with</span>
              <Heart size={14} className="text-red-500 fill-current" />
              <span>for fitness enthusiasts</span>
            </span>
          </motion.p>
          
          <motion.div 
            className="flex items-center space-x-4 mt-2 md:mt-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span className="text-xs text-fitness-secondary">Version 1.0.0</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-fitness-success rounded-full animate-pulse"></div>
              <span className="text-xs text-fitness-secondary">All systems operational</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.footer>
  )
}

export default Footer
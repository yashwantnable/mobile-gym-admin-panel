import React from 'react'
import { Card } from 'primereact/card'
import { Chart } from 'primereact/chart'
import { Message } from 'primereact/message'
import { Badge } from 'primereact/badge'
import { Button } from 'primereact/button'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign, 
  Activity,
  Clock,
  Star,
  AlertTriangle
} from 'lucide-react'

const Dashboard = () => {
  // Mock data for KPIs
  const kpiData = [
    { 
      title: 'Daily Bookings', 
      value: '24', 
      change: '+12%', 
      icon: Calendar,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      title: 'Weekly Revenue', 
      value: '$2,450', 
      change: '+8%', 
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50'
    },
    { 
      title: 'Active Clients', 
      value: '156', 
      change: '+5%', 
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50'
    },
    { 
      title: 'Total Trainers', 
      value: '12', 
      change: '0%', 
      icon: Activity,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50'
    }
  ]

  // Chart data
  const bookingChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Bookings',
        data: [12, 19, 15, 25, 22, 30, 28],
        backgroundColor: 'rgba(33, 200, 177, 0.8)',
        borderColor: '#21C8B1',
        borderWidth: 3,
        borderRadius: 8,
        borderSkipped: false,
      }
    ]
  }

  const revenueChartData = {
    labels: ['Yoga', 'Cardio', 'Zumba', 'Strength', 'Pilates'],
    datasets: [
      {
        data: [300, 250, 200, 180, 150],
        backgroundColor: [
          'rgba(33, 200, 177, 0.8)',
          'rgba(173, 134, 84, 0.8)',
          'rgba(254, 213, 85, 0.8)',
          'rgba(153, 146, 141, 0.8)',
          'rgba(53, 53, 53, 0.8)'
        ],
        borderWidth: 0,
        hoverOffset: 10
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            family: 'Poppins',
            size: 12
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            family: 'Poppins'
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            family: 'Poppins'
          }
        }
      }
    }
  }

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            family: 'Poppins',
            size: 12
          }
        }
      }
    }
  }

  // Alerts data
  const alerts = [
    { 
      type: 'warn', 
      message: 'Yoga session with Sarah Johnson starts in 30 minutes',
      icon: Clock
    },
    { 
      type: 'warn', 
      message: '3 overdue payments require attention',
      icon: AlertTriangle
    },
    { 
      type: 'info', 
      message: 'New trainer application received',
      icon: Users
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  }

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Page Header */}
      <motion.div 
        className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0"
        variants={itemVariants}
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold gradient-text">Dashboard</h1>
          <p className="text-fitness-secondary mt-2">
            Welcome back! Here's what's happening at your fitness center today.
          </p>
        </div>
        <div className="glass px-4 py-2 rounded-xl">
          <p className="text-fitness-secondary text-sm">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </motion.div>

      {/* Alerts */}
      <motion.div className="space-y-3" variants={itemVariants}>
        {alerts.map((alert, index) => {
          const IconComponent = alert.icon
          return (
            <motion.div
              key={index}
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <Message
                severity={alert.type}
                className="w-full glass-strong border-l-4 border-l-fitness-warning"
                content={
                  <div className="flex items-center space-x-3">
                    <IconComponent size={20} />
                    <span>{alert.message}</span>
                  </div>
                }
              />
            </motion.div>
          )
        })}
      </motion.div>

      {/* KPI Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={itemVariants}
      >
        {kpiData.map((kpi, index) => {
          const IconComponent = kpi.icon
          return (
            <motion.div
              key={index}
              whileHover={{ 
                scale: 1.05,
                rotateY: 5,
                transition: { type: "spring", stiffness: 300 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Card className="glass-strong hover:shadow-strong transition-all duration-300 border-0 overflow-hidden relative">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-fitness-secondary text-sm font-medium">{kpi.title}</p>
                    <p className="text-3xl font-bold text-fitness-primary">{kpi.value}</p>
                    <div className="flex items-center space-x-2">
                      <TrendingUp size={16} className="text-fitness-success" />
                      <p className="text-fitness-success text-sm font-medium">{kpi.change}</p>
                    </div>
                  </div>
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${kpi.color} shadow-medium`}>
                    <IconComponent size={24} className="text-white" />
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-full -mr-10 -mt-10"></div>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Charts */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        variants={itemVariants}
      >
        <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
          <Card className="glass-strong hover:shadow-strong transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-fitness-primary">Weekly Bookings</h3>
              <Badge value="This Week" className="bg-gradient-to-r from-fitness-accent to-fitness-accent-secondary" />
            </div>
            <div style={{ height: '300px' }}>
              <Chart type="bar" data={bookingChartData} options={chartOptions} />
            </div>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
          <Card className="glass-strong hover:shadow-strong transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-fitness-primary">Revenue by Session</h3>
              <Badge value="Monthly" className="bg-gradient-to-r from-fitness-accent-secondary to-fitness-warning" />
            </div>
            <div style={{ height: '300px' }}>
              <Chart type="doughnut" data={revenueChartData} options={pieChartOptions} />
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        variants={itemVariants}
      >
        <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
          <Card className="glass-strong hover:shadow-strong transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-fitness-primary">Recent Bookings</h3>
              <Button 
                label="View All" 
                className="p-button-text p-button-sm"
                icon="pi pi-arrow-right"
              />
            </div>
            <div className="space-y-4">
              {[
                { client: 'Emma Wilson', session: 'Morning Yoga', time: '9:00 AM', avatar: 'EW' },
                { client: 'John Smith', session: 'HIIT Cardio', time: '10:30 AM', avatar: 'JS' },
                { client: 'Lisa Brown', session: 'Pilates', time: '2:00 PM', avatar: 'LB' }
              ].map((booking, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center justify-between p-4 glass rounded-xl hover:shadow-soft transition-all duration-300"
                  whileHover={{ x: 5 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-fitness-accent to-fitness-accent-secondary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {booking.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-fitness-primary">{booking.client}</p>
                      <p className="text-sm text-fitness-secondary">{booking.session}</p>
                    </div>
                  </div>
                  <Badge 
                    value={booking.time} 
                    className="bg-gradient-to-r from-fitness-accent to-fitness-accent-secondary" 
                  />
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
          <Card className="glass-strong hover:shadow-strong transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-fitness-primary">Trainer Availability</h3>
              <Button 
                label="Manage" 
                className="p-button-text p-button-sm"
                icon="pi pi-cog"
              />
            </div>
            <div className="space-y-4">
              {[
                { trainer: 'Sarah Johnson', status: 'Available', sessions: 3, rating: 4.9 },
                { trainer: 'Mike Davis', status: 'Busy', sessions: 5, rating: 4.7 },
                { trainer: 'Anna Lee', status: 'Available', sessions: 2, rating: 4.8 }
              ].map((trainer, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center justify-between p-4 glass rounded-xl hover:shadow-soft transition-all duration-300"
                  whileHover={{ x: 5 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-fitness-accent-secondary to-fitness-warning rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {trainer.trainer.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-semibold text-fitness-primary">{trainer.trainer}</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm text-fitness-secondary">{trainer.sessions} sessions today</p>
                        <div className="flex items-center space-x-1">
                          <Star size={12} className="text-yellow-500 fill-current" />
                          <span className="text-xs text-fitness-secondary">{trainer.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Badge 
                    value={trainer.status} 
                    severity={trainer.status === 'Available' ? 'success' : 'warning'} 
                    className={trainer.status === 'Available' 
                      ? 'bg-gradient-to-r from-green-500 to-green-600' 
                      : 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                    }
                  />
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default Dashboard
import React, { useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Badge } from 'primereact/badge'
import { Card } from 'primereact/card'
import { InputText } from 'primereact/inputtext'
import { motion } from 'framer-motion'
import { Plus, Search, Eye, Edit, Trash2, Check, X } from 'lucide-react'
import SessionForm from './SessionForm.jsx'

const SessionManagement = () => {
  const [sessions, setSessions] = useState([
    {
      id: 1,
      name: 'Morning Yoga Flow',
      type: 'Yoga',
      trainer: 'Sarah Johnson',
      date: '2025-01-15',
      time: '09:00',
      location: 'Studio A',
      status: 'Approved',
      maxParticipants: 15,
      description: 'Gentle morning yoga session to start your day'
    },
    {
      id: 2,
      name: 'HIIT Cardio Blast',
      type: 'Cardio',
      trainer: 'Mike Davis',
      date: '2025-01-15',
      time: '18:00',
      location: 'Gym Floor',
      status: 'Pending',
      maxParticipants: 20,
      description: 'High-intensity interval training session'
    },
    {
      id: 3,
      name: 'Zumba Dance Party',
      type: 'Zumba',
      trainer: 'Anna Lee',
      date: '2025-01-16',
      time: '19:00',
      location: 'Studio B',
      status: 'Rejected',
      maxParticipants: 25,
      description: 'Fun and energetic dance workout'
    }
  ])

  const [showForm, setShowForm] = useState(false)
  const [selectedSession, setSelectedSession] = useState(null)
  const [globalFilter, setGlobalFilter] = useState('')

  const statusBodyTemplate = (rowData) => {
    const severity = rowData.status === 'Approved' ? 'success' : 
                    rowData.status === 'Pending' ? 'warning' : 'danger'
    return (
      <Badge 
        value={rowData.status} 
        severity={severity}
        className={`${
          rowData.status === 'Approved' ? 'bg-gradient-to-r from-green-500 to-green-600' :
          rowData.status === 'Pending' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
          'bg-gradient-to-r from-red-500 to-red-600'
        } text-white`}
      />
    )
  }

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            className="p-button-rounded p-button-text glass"
            onClick={() => handleView(rowData)}
            tooltip="View"
          >
            <Eye size={16} className="text-fitness-accent" />
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            className="p-button-rounded p-button-text glass"
            onClick={() => handleEdit(rowData)}
            tooltip="Edit"
          >
            <Edit size={16} className="text-fitness-accent-secondary" />
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            className="p-button-rounded p-button-text glass"
            onClick={() => handleDelete(rowData)}
            tooltip="Delete"
          >
            <Trash2 size={16} className="text-red-500" />
          </Button>
        </motion.div>
        {rowData.status === 'Pending' && (
          <>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                className="p-button-rounded p-button-text glass"
                onClick={() => handleApprove(rowData)}
                tooltip="Approve"
              >
                <Check size={16} className="text-green-500" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                className="p-button-rounded p-button-text glass"
                onClick={() => handleReject(rowData)}
                tooltip="Reject"
              >
                <X size={16} className="text-red-500" />
              </Button>
            </motion.div>
          </>
        )}
      </div>
    )
  }

  const handleAdd = () => {
    setSelectedSession(null)
    setShowForm(true)
  }

  const handleEdit = (session) => {
    setSelectedSession(session)
    setShowForm(true)
  }

  const handleView = (session) => {
    setSelectedSession(session)
    setShowForm(true)
  }

  const handleDelete = (session) => {
    setSessions(sessions.filter(s => s.id !== session.id))
  }

  const handleApprove = (session) => {
    setSessions(sessions.map(s => 
      s.id === session.id ? { ...s, status: 'Approved' } : s
    ))
  }

  const handleReject = (session) => {
    setSessions(sessions.map(s => 
      s.id === session.id ? { ...s, status: 'Rejected' } : s
    ))
  }

  const handleSave = (sessionData) => {
    if (selectedSession) {
      setSessions(sessions.map(s => 
        s.id === selectedSession.id ? { ...sessionData, id: selectedSession.id } : s
      ))
    } else {
      const newSession = {
        ...sessionData,
        id: Math.max(...sessions.map(s => s.id)) + 1,
        status: 'Pending'
      }
      setSessions([...sessions, newSession])
    }
    setShowForm(false)
  }

  const header = (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 p-6">
      <div>
        <h2 className="text-2xl font-bold gradient-text">Session Management</h2>
        <p className="text-fitness-secondary mt-1">Manage and approve fitness sessions</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-fitness-secondary" />
          <InputText
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search sessions..."
            className="pl-10 glass"
          />
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={handleAdd}
            className="btn-gradient flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Add Session</span>
          </Button>
        </motion.div>
      </div>
    </div>
  )

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="glass-strong shadow-strong border-0">
          <DataTable
            value={sessions}
            header={header}
            globalFilter={globalFilter}
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            className="border-0"
            emptyMessage="No sessions found"
            responsiveLayout="scroll"
            rowHover
          >
            <Column field="name" header="Session Name" sortable className="font-medium" />
            <Column field="type" header="Type" sortable />
            <Column field="trainer" header="Trainer" sortable />
            <Column field="date" header="Date" sortable />
            <Column field="time" header="Time" sortable />
            <Column field="location" header="Location" sortable />
            <Column field="status" header="Status" body={statusBodyTemplate} sortable />
            <Column header="Actions" body={actionBodyTemplate} style={{ width: '250px' }} />
          </DataTable>
        </Card>
      </motion.div>

      {showForm && (
        <SessionForm
          session={selectedSession}
          visible={showForm}
          onHide={() => setShowForm(false)}
          onSave={handleSave}
        />
      )}
    </motion.div>
  )
}

export default SessionManagement
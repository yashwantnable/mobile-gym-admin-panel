import React, { useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { InputText } from 'primereact/inputtext'
import TrainerForm from './TrainerForm'

const TrainerManagement = () => {
  const [trainers, setTrainers] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      specialty: 'Yoga',
      certificateNumber: 'YT-2023-001',
      email: 'sarah.johnson@fitness.com',
      phone: '+1-555-0101',
      bio: 'Certified yoga instructor with 5 years of experience',
      certificateFile: '/certificates/sarah_yoga_cert.pdf'
    },
    {
      id: 2,
      name: 'Mike Davis',
      specialty: 'Cardio',
      certificateNumber: 'CT-2023-002',
      email: 'mike.davis@fitness.com',
      phone: '+1-555-0102',
      bio: 'HIIT and cardio specialist with competitive background',
      certificateFile: '/certificates/mike_cardio_cert.pdf'
    },
    {
      id: 3,
      name: 'Anna Lee',
      specialty: 'Zumba',
      certificateNumber: 'ZT-2023-003',
      email: 'anna.lee@fitness.com',
      phone: '+1-555-0103',
      bio: 'Energetic Zumba instructor bringing fun to fitness',
      certificateFile: '/certificates/anna_zumba_cert.pdf'
    }
  ])

  const [showForm, setShowForm] = useState(false)
  const [selectedTrainer, setSelectedTrainer] = useState(null)
  const [globalFilter, setGlobalFilter] = useState('')

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-eye"
          className="p-button-rounded p-button-text"
          style={{ color: '#AD8654' }}
          onClick={() => handleView(rowData)}
          tooltip="View"
        />
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-text"
          style={{ color: '#AD8654' }}
          onClick={() => handleEdit(rowData)}
          tooltip="Edit"
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-text"
          style={{ color: '#FED555' }}
          onClick={() => handleDelete(rowData)}
          tooltip="Delete"
        />
      </div>
    )
  }

  const handleAdd = () => {
    setSelectedTrainer(null)
    setShowForm(true)
  }

  const handleEdit = (trainer) => {
    setSelectedTrainer(trainer)
    setShowForm(true)
  }

  const handleView = (trainer) => {
    setSelectedTrainer(trainer)
    setShowForm(true)
  }

  const handleDelete = (trainer) => {
    setTrainers(trainers.filter(t => t.id !== trainer.id))
  }

  const handleSave = (trainerData) => {
    if (selectedTrainer) {
      // Update existing trainer
      setTrainers(trainers.map(t => 
        t.id === selectedTrainer.id ? { ...trainerData, id: selectedTrainer.id } : t
      ))
    } else {
      // Add new trainer
      const newTrainer = {
        ...trainerData,
        id: Math.max(...trainers.map(t => t.id)) + 1
      }
      setTrainers([...trainers, newTrainer])
    }
    setShowForm(false)
  }

  const header = (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <h2 className="text-2xl font-semibold text-fitness-primary">Trainer Management</h2>
      <div className="flex flex-col sm:flex-row gap-2">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search trainers..."
            className="w-full sm:w-auto"
          />
        </span>
        <Button
          label="Add Trainer"
          icon="pi pi-plus"
          onClick={handleAdd}
          className="bg-fitness-accent hover:bg-fitness-accent-secondary"
        />
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-md">
        <DataTable
          value={trainers}
          header={header}
          globalFilter={globalFilter}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          className="p-datatable-sm"
          emptyMessage="No trainers found"
          responsiveLayout="scroll"
        >
          <Column field="name" header="Name" sortable />
          <Column field="specialty" header="Specialty" sortable />
          <Column field="certificateNumber" header="Certificate Number" sortable />
          <Column field="email" header="Contact Email" sortable />
          <Column header="Actions" body={actionBodyTemplate} style={{ width: '150px' }} />
        </DataTable>
      </Card>

      {showForm && (
        <TrainerForm
          trainer={selectedTrainer}
          visible={showForm}
          onHide={() => setShowForm(false)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}

export default TrainerManagement
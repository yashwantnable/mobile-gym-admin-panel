import React, { useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { InputText } from 'primereact/inputtext'
import { Tag } from 'primereact/tag'
import ClientForm from './ClientForm'
import BulkCommunicationForm from './BulkCommunicationForm'

const ClientManagement = () => {
  const [clients, setClients] = useState([
    {
      id: 1,
      name: 'Emma Wilson',
      email: 'emma.wilson@email.com',
      phone: '+1-555-0201',
      tags: ['VIP', 'Regular'],
      bookingCount: 25,
      preferences: 'Morning sessions, Yoga',
      notes: 'Prefers quiet environment'
    },
    {
      id: 2,
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1-555-0202',
      tags: ['Beginner'],
      bookingCount: 8,
      preferences: 'Evening sessions, Cardio',
      notes: 'New to fitness, needs encouragement'
    },
    {
      id: 3,
      name: 'Lisa Brown',
      email: 'lisa.brown@email.com',
      phone: '+1-555-0203',
      tags: ['VIP', 'Advanced'],
      bookingCount: 42,
      preferences: 'High intensity, Strength training',
      notes: 'Experienced athlete'
    }
  ])

  const [showForm, setShowForm] = useState(false)
  const [showBulkForm, setShowBulkForm] = useState(false)
  const [selectedClient, setSelectedClient] = useState(null)
  const [globalFilter, setGlobalFilter] = useState('')

  const tagsBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-1 flex-wrap">
        {rowData.tags.map((tag, index) => (
          <Tag
            key={index}
            value={tag}
            severity={tag === 'VIP' ? 'success' : tag === 'Beginner' ? 'info' : 'warning'}
          />
        ))}
      </div>
    )
  }

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
    setSelectedClient(null)
    setShowForm(true)
  }

  const handleEdit = (client) => {
    setSelectedClient(client)
    setShowForm(true)
  }

  const handleView = (client) => {
    setSelectedClient(client)
    setShowForm(true)
  }

  const handleDelete = (client) => {
    setClients(clients.filter(c => c.id !== client.id))
  }

  const handleSave = (clientData) => {
    if (selectedClient) {
      // Update existing client
      setClients(clients.map(c => 
        c.id === selectedClient.id ? { ...clientData, id: selectedClient.id } : c
      ))
    } else {
      // Add new client
      const newClient = {
        ...clientData,
        id: Math.max(...clients.map(c => c.id)) + 1
      }
      setClients([...clients, newClient])
    }
    setShowForm(false)
  }

  const handleBulkCommunication = () => {
    setShowBulkForm(true)
  }

  const header = (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <h2 className="text-2xl font-semibold text-fitness-primary">Client Management</h2>
      <div className="flex flex-col sm:flex-row gap-2">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search clients..."
            className="w-full sm:w-auto"
          />
        </span>
        <Button
          label="Bulk Email/SMS"
          icon="pi pi-send"
          onClick={handleBulkCommunication}
          className="bg-fitness-accent-secondary hover:bg-fitness-accent"
        />
        <Button
          label="Add Client"
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
          value={clients}
          header={header}
          globalFilter={globalFilter}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          className="p-datatable-sm"
          emptyMessage="No clients found"
          responsiveLayout="scroll"
        >
          <Column field="name" header="Name" sortable />
          <Column field="email" header="Email" sortable />
          <Column field="phone" header="Phone" sortable />
          <Column field="tags" header="Tags" body={tagsBodyTemplate} />
          <Column field="bookingCount" header="Booking Count" sortable />
          <Column header="Actions" body={actionBodyTemplate} style={{ width: '150px' }} />
        </DataTable>
      </Card>

      {showForm && (
        <ClientForm
          client={selectedClient}
          visible={showForm}
          onHide={() => setShowForm(false)}
          onSave={handleSave}
        />
      )}

      {showBulkForm && (
        <BulkCommunicationForm
          visible={showBulkForm}
          onHide={() => setShowBulkForm(false)}
          clients={clients}
        />
      )}
    </div>
  )
}

export default ClientManagement
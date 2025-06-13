import React, { useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { InputText } from 'primereact/inputtext'
import { Calendar } from 'primereact/calendar'
import { TabView, TabPanel } from 'primereact/tabview'
import { Badge } from 'primereact/badge'
import BookingForm from './BookingForm'

const BookingSchedule = () => {
  const [bookings, setBookings] = useState([
    {
      id: 1,
      session: 'Morning Yoga Flow',
      trainer: 'Sarah Johnson',
      client: 'Emma Wilson',
      date: '2025-01-15',
      time: '09:00',
      location: 'Studio A',
      status: 'Confirmed'
    },
    {
      id: 2,
      session: 'HIIT Cardio Blast',
      trainer: 'Mike Davis',
      client: 'John Smith',
      date: '2025-01-15',
      time: '18:00',
      location: 'Gym Floor',
      status: 'Pending'
    }
  ])

  const [cancellations, setCancellations] = useState([
    {
      id: 1,
      client: 'Lisa Brown',
      session: 'Pilates Class',
      reason: 'Personal emergency',
      status: 'Pending',
      requestDate: '2025-01-14'
    }
  ])

  const [showForm, setShowForm] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [globalFilter, setGlobalFilter] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date())

  const statusBodyTemplate = (rowData) => {
    const severity = rowData.status === 'Confirmed' ? 'success' : 
                    rowData.status === 'Pending' ? 'warning' : 'danger'
    return <Badge value={rowData.status} severity={severity} />
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

  const cancellationActionTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <Button
          label="Approve"
          icon="pi pi-check"
          size="small"
          className="bg-fitness-accent hover:bg-fitness-accent-secondary"
          onClick={() => handleApproveCancellation(rowData)}
        />
        <Button
          label="Reject"
          icon="pi pi-times"
          size="small"
          className="p-button-secondary"
          onClick={() => handleRejectCancellation(rowData)}
        />
      </div>
    )
  }

  const handleAdd = () => {
    setSelectedBooking(null)
    setShowForm(true)
  }

  const handleEdit = (booking) => {
    setSelectedBooking(booking)
    setShowForm(true)
  }

  const handleView = (booking) => {
    setSelectedBooking(booking)
    setShowForm(true)
  }

  const handleDelete = (booking) => {
    setBookings(bookings.filter(b => b.id !== booking.id))
  }

  const handleSave = (bookingData) => {
    if (selectedBooking) {
      setBookings(bookings.map(b => 
        b.id === selectedBooking.id ? { ...bookingData, id: selectedBooking.id } : b
      ))
    } else {
      const newBooking = {
        ...bookingData,
        id: Math.max(...bookings.map(b => b.id)) + 1
      }
      setBookings([...bookings, newBooking])
    }
    setShowForm(false)
  }

  const handleApproveCancellation = (cancellation) => {
    setCancellations(cancellations.map(c => 
      c.id === cancellation.id ? { ...c, status: 'Approved' } : c
    ))
  }

  const handleRejectCancellation = (cancellation) => {
    setCancellations(cancellations.map(c => 
      c.id === cancellation.id ? { ...c, status: 'Rejected' } : c
    ))
  }

  const bookingHeader = (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <h3 className="text-lg font-semibold text-fitness-primary">Bookings & Schedules</h3>
      <div className="flex flex-col sm:flex-row gap-2">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search bookings..."
            className="w-full sm:w-auto"
          />
        </span>
        <Button
          label="Add Booking"
          icon="pi pi-plus"
          onClick={handleAdd}
          className="bg-fitness-accent hover:bg-fitness-accent-secondary"
        />
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-fitness-primary">Booking & Schedule Management</h1>
      </div>

      <TabView>
        <TabPanel header="Schedule View">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <Card title="Calendar" className="bg-white shadow-md">
              <Calendar
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.value)}
                inline
                className="w-full"
              />
            </Card>

            {/* Today's Schedule */}
            <div className="lg:col-span-2">
              <Card title="Today's Schedule" className="bg-white shadow-md">
                <div className="space-y-3">
                  {bookings
                    .filter(booking => booking.date === selectedDate?.toISOString().split('T')[0])
                    .map((booking, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-fitness-bg rounded-lg">
                      <div>
                        <p className="font-medium text-fitness-primary">{booking.session}</p>
                        <p className="text-sm text-fitness-secondary">
                          {booking.trainer} • {booking.time} • {booking.location}
                        </p>
                        <p className="text-sm text-fitness-secondary">Client: {booking.client}</p>
                      </div>
                      <Badge value={booking.status} severity={booking.status === 'Confirmed' ? 'success' : 'warning'} />
                    </div>
                  ))}
                  {bookings.filter(booking => booking.date === selectedDate?.toISOString().split('T')[0]).length === 0 && (
                    <p className="text-fitness-secondary text-center py-4">No bookings for this date</p>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </TabPanel>

        <TabPanel header="All Bookings">
          <Card className="bg-white shadow-md">
            <DataTable
              value={bookings}
              header={bookingHeader}
              globalFilter={globalFilter}
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 25]}
              className="p-datatable-sm"
              emptyMessage="No bookings found"
              responsiveLayout="scroll"
            >
              <Column field="session" header="Session" sortable />
              <Column field="trainer" header="Trainer" sortable />
              <Column field="client" header="Client" sortable />
              <Column field="date" header="Date" sortable />
              <Column field="time" header="Time" sortable />
              <Column field="location" header="Location" sortable />
              <Column field="status" header="Status" body={statusBodyTemplate} sortable />
              <Column header="Actions" body={actionBodyTemplate} style={{ width: '150px' }} />
            </DataTable>
          </Card>
        </TabPanel>

        <TabPanel header="Cancellations">
          <Card title="Cancellation Requests" className="bg-white shadow-md">
            <DataTable
              value={cancellations}
              paginator
              rows={10}
              className="p-datatable-sm"
              emptyMessage="No cancellation requests"
              responsiveLayout="scroll"
            >
              <Column field="client" header="Client" sortable />
              <Column field="session" header="Session" sortable />
              <Column field="reason" header="Reason" sortable />
              <Column field="requestDate" header="Request Date" sortable />
              <Column field="status" header="Status" body={statusBodyTemplate} sortable />
              <Column header="Actions" body={cancellationActionTemplate} style={{ width: '200px' }} />
            </DataTable>
          </Card>
        </TabPanel>
      </TabView>

      {showForm && (
        <BookingForm
          booking={selectedBooking}
          visible={showForm}
          onHide={() => setShowForm(false)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}

export default BookingSchedule
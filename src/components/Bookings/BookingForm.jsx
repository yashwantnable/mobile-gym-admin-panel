import React from 'react'
import { Sidebar } from 'primereact/sidebar'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { Calendar } from 'primereact/calendar'
import { Button } from 'primereact/button'
import { useFormik } from 'formik'
import * as Yup from 'yup'

const BookingForm = ({ booking, visible, onHide, onSave }) => {
  const sessions = [
    { label: 'Morning Yoga Flow', value: 'Morning Yoga Flow' },
    { label: 'HIIT Cardio Blast', value: 'HIIT Cardio Blast' },
    { label: 'Zumba Dance Party', value: 'Zumba Dance Party' },
    { label: 'Strength Training', value: 'Strength Training' }
  ]

  const trainers = [
    { label: 'Sarah Johnson', value: 'Sarah Johnson' },
    { label: 'Mike Davis', value: 'Mike Davis' },
    { label: 'Anna Lee', value: 'Anna Lee' },
    { label: 'Tom Wilson', value: 'Tom Wilson' }
  ]

  const clients = [
    { label: 'Emma Wilson', value: 'Emma Wilson' },
    { label: 'John Smith', value: 'John Smith' },
    { label: 'Lisa Brown', value: 'Lisa Brown' }
  ]

  const locations = [
    { label: 'Studio A', value: 'Studio A' },
    { label: 'Studio B', value: 'Studio B' },
    { label: 'Gym Floor', value: 'Gym Floor' },
    { label: 'Outdoor Area', value: 'Outdoor Area' }
  ]

  const validationSchema = Yup.object({
    session: Yup.string().required('Session is required'),
    trainer: Yup.string().required('Trainer is required'),
    client: Yup.string().required('Client is required'),
    date: Yup.date().required('Date is required'),
    time: Yup.string().required('Time is required'),
    location: Yup.string().required('Location is required')
  })

  const formik = useFormik({
    initialValues: {
      session: booking?.session || '',
      trainer: booking?.trainer || '',
      client: booking?.client || '',
      date: booking?.date ? new Date(booking.date) : null,
      time: booking?.time || '',
      location: booking?.location || '',
      status: booking?.status || 'Pending'
    },
    validationSchema,
    onSubmit: (values) => {
      const bookingData = {
        ...values,
        date: values.date ? values.date.toISOString().split('T')[0] : ''
      }
      onSave(bookingData)
    }
  })

  const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name])
  const getFormErrorMessage = (name) => {
    return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>
  }

  return (
    <Sidebar
      visible={visible}
      position="right"
      onHide={onHide}
      className="w-full md:w-96"
      modal
      blockScroll
    >
      <div className="p-6">
        <h3 className="text-xl font-semibold text-fitness-primary mb-6">
          {booking ? 'Edit Booking' : 'Add New Booking'}
        </h3>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="session" className="block text-sm font-medium text-fitness-primary mb-2">
              Session *
            </label>
            <Dropdown
              id="session"
              name="session"
              value={formik.values.session}
              onChange={(e) => formik.setFieldValue('session', e.value)}
              options={sessions}
              placeholder="Select session"
              className={`w-full ${isFormFieldValid('session') ? 'p-invalid' : ''}`}
            />
            {getFormErrorMessage('session')}
          </div>

          <div>
            <label htmlFor="trainer" className="block text-sm font-medium text-fitness-primary mb-2">
              Trainer *
            </label>
            <Dropdown
              id="trainer"
              name="trainer"
              value={formik.values.trainer}
              onChange={(e) => formik.setFieldValue('trainer', e.value)}
              options={trainers}
              placeholder="Select trainer"
              className={`w-full ${isFormFieldValid('trainer') ? 'p-invalid' : ''}`}
            />
            {getFormErrorMessage('trainer')}
          </div>

          <div>
            <label htmlFor="client" className="block text-sm font-medium text-fitness-primary mb-2">
              Client *
            </label>
            <Dropdown
              id="client"
              name="client"
              value={formik.values.client}
              onChange={(e) => formik.setFieldValue('client', e.value)}
              options={clients}
              placeholder="Select client"
              className={`w-full ${isFormFieldValid('client') ? 'p-invalid' : ''}`}
            />
            {getFormErrorMessage('client')}
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-fitness-primary mb-2">
              Date *
            </label>
            <Calendar
              id="date"
              name="date"
              value={formik.values.date}
              onChange={(e) => formik.setFieldValue('date', e.value)}
              placeholder="Select date"
              className={`w-full ${isFormFieldValid('date') ? 'p-invalid' : ''}`}
              showIcon
            />
            {getFormErrorMessage('date')}
          </div>

          <div>
            <label htmlFor="time" className="block text-sm font-medium text-fitness-primary mb-2">
              Time *
            </label>
            <InputText
              id="time"
              name="time"
              type="time"
              value={formik.values.time}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full ${isFormFieldValid('time') ? 'p-invalid' : ''}`}
            />
            {getFormErrorMessage('time')}
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-fitness-primary mb-2">
              Location *
            </label>
            <Dropdown
              id="location"
              name="location"
              value={formik.values.location}
              onChange={(e) => formik.setFieldValue('location', e.value)}
              options={locations}
              placeholder="Select location"
              className={`w-full ${isFormFieldValid('location') ? 'p-invalid' : ''}`}
            />
            {getFormErrorMessage('location')}
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              label="Save"
              icon="pi pi-check"
              className="flex-1 bg-fitness-accent hover:bg-fitness-accent-secondary"
            />
            <Button
              type="button"
              label="Cancel"
              icon="pi pi-times"
              className="flex-1 p-button-secondary"
              onClick={onHide}
            />
          </div>
        </form>
      </div>
    </Sidebar>
  )
}

export default BookingForm
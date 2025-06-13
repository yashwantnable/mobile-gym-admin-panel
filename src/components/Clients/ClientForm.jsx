import React from 'react'
import { Sidebar } from 'primereact/sidebar'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { Chips } from 'primereact/chips'
import { Button } from 'primereact/button'
import { useFormik } from 'formik'
import * as Yup from 'yup'

const ClientForm = ({ client, visible, onHide, onSave }) => {
  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string().required('Phone is required'),
    preferences: Yup.string(),
    notes: Yup.string()
  })

  const formik = useFormik({
    initialValues: {
      name: client?.name || '',
      email: client?.email || '',
      phone: client?.phone || '',
      tags: client?.tags || [],
      preferences: client?.preferences || '',
      notes: client?.notes || '',
      bookingCount: client?.bookingCount || 0
    },
    validationSchema,
    onSubmit: (values) => {
      onSave(values)
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
          {client ? 'Edit Client' : 'Add New Client'}
        </h3>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-fitness-primary mb-2">
              Name *
            </label>
            <InputText
              id="name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full ${isFormFieldValid('name') ? 'p-invalid' : ''}`}
              placeholder="Enter client name"
            />
            {getFormErrorMessage('name')}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-fitness-primary mb-2">
              Email *
            </label>
            <InputText
              id="email"
              name="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full ${isFormFieldValid('email') ? 'p-invalid' : ''}`}
              placeholder="Enter email address"
            />
            {getFormErrorMessage('email')}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-fitness-primary mb-2">
              Phone *
            </label>
            <InputText
              id="phone"
              name="phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full ${isFormFieldValid('phone') ? 'p-invalid' : ''}`}
              placeholder="Enter phone number"
            />
            {getFormErrorMessage('phone')}
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-fitness-primary mb-2">
              Tags
            </label>
            <Chips
              id="tags"
              name="tags"
              value={formik.values.tags}
              onChange={(e) => formik.setFieldValue('tags', e.value)}
              placeholder="Add tags (press Enter)"
              className="w-full"
            />
            <small className="text-fitness-secondary">Press Enter to add tags like VIP, Beginner, etc.</small>
          </div>

          <div>
            <label htmlFor="preferences" className="block text-sm font-medium text-fitness-primary mb-2">
              Preferences
            </label>
            <InputTextarea
              id="preferences"
              name="preferences"
              value={formik.values.preferences}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              rows={3}
              className="w-full"
              placeholder="Enter client preferences"
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-fitness-primary mb-2">
              Notes
            </label>
            <InputTextarea
              id="notes"
              name="notes"
              value={formik.values.notes}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              rows={3}
              className="w-full"
              placeholder="Enter notes about the client"
            />
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

export default ClientForm
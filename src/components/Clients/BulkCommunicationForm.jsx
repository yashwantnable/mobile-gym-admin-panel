import React from 'react'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { Dropdown } from 'primereact/dropdown'
import { Button } from 'primereact/button'
import { MultiSelect } from 'primereact/multiselect'
import { useFormik } from 'formik'
import * as Yup from 'yup'

const BulkCommunicationForm = ({ visible, onHide, clients }) => {
  const communicationTypes = [
    { label: 'Email', value: 'email' },
    { label: 'SMS', value: 'sms' }
  ]

  const clientOptions = clients.map(client => ({
    label: client.name,
    value: client.id
  }))

  const validationSchema = Yup.object({
    type: Yup.string().required('Communication type is required'),
    recipients: Yup.array().min(1, 'At least one recipient is required'),
    subject: Yup.string().when('type', {
      is: 'email',
      then: (schema) => schema.required('Subject is required for email'),
      otherwise: (schema) => schema
    }),
    message: Yup.string().required('Message is required')
  })

  const formik = useFormik({
    initialValues: {
      type: '',
      recipients: [],
      subject: '',
      message: ''
    },
    validationSchema,
    onSubmit: (values) => {
      console.log('Sending bulk communication:', values)
      // Here you would implement the actual sending logic
      alert(`${values.type.toUpperCase()} sent to ${values.recipients.length} recipients`)
      onHide()
    }
  })

  const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name])
  const getFormErrorMessage = (name) => {
    return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>
  }

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header="Bulk Communication"
      style={{ width: '500px' }}
      modal
      className="p-fluid"
    >
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-fitness-primary mb-2">
            Communication Type *
          </label>
          <Dropdown
            id="type"
            name="type"
            value={formik.values.type}
            onChange={(e) => formik.setFieldValue('type', e.value)}
            options={communicationTypes}
            placeholder="Select communication type"
            className={`w-full ${isFormFieldValid('type') ? 'p-invalid' : ''}`}
          />
          {getFormErrorMessage('type')}
        </div>

        <div>
          <label htmlFor="recipients" className="block text-sm font-medium text-fitness-primary mb-2">
            Recipients *
          </label>
          <MultiSelect
            id="recipients"
            name="recipients"
            value={formik.values.recipients}
            onChange={(e) => formik.setFieldValue('recipients', e.value)}
            options={clientOptions}
            placeholder="Select recipients"
            className={`w-full ${isFormFieldValid('recipients') ? 'p-invalid' : ''}`}
            display="chip"
          />
          {getFormErrorMessage('recipients')}
        </div>

        {formik.values.type === 'email' && (
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-fitness-primary mb-2">
              Subject *
            </label>
            <InputText
              id="subject"
              name="subject"
              value={formik.values.subject}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full ${isFormFieldValid('subject') ? 'p-invalid' : ''}`}
              placeholder="Enter email subject"
            />
            {getFormErrorMessage('subject')}
          </div>
        )}

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-fitness-primary mb-2">
            Message *
          </label>
          <InputTextarea
            id="message"
            name="message"
            value={formik.values.message}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            rows={6}
            className={`w-full ${isFormFieldValid('message') ? 'p-invalid' : ''}`}
            placeholder="Enter your message"
          />
          {getFormErrorMessage('message')}
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            type="submit"
            label="Send"
            icon="pi pi-send"
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
    </Dialog>
  )
}

export default BulkCommunicationForm
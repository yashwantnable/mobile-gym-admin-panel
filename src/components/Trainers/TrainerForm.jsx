import React from 'react'
import { Sidebar } from 'primereact/sidebar'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { InputTextarea } from 'primereact/inputtextarea'
import { Button } from 'primereact/button'
import { useFormik } from 'formik'
import * as Yup from 'yup'

const TrainerForm = ({ trainer, visible, onHide, onSave }) => {
  const specialties = [
    { label: 'Yoga', value: 'Yoga' },
    { label: 'Cardio', value: 'Cardio' },
    { label: 'Zumba', value: 'Zumba' },
    { label: 'Strength', value: 'Strength' },
    { label: 'Pilates', value: 'Pilates' }
  ]

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    specialty: Yup.string().required('Specialty is required'),
    certificateNumber: Yup.string().required('Certificate number is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string().required('Phone is required'),
    bio: Yup.string().required('Bio is required'),
    certificateFile: Yup.string().required('Certificate file location is required')
  })

  const formik = useFormik({
    initialValues: {
      name: trainer?.name || '',
      specialty: trainer?.specialty || '',
      certificateNumber: trainer?.certificateNumber || '',
      email: trainer?.email || '',
      phone: trainer?.phone || '',
      bio: trainer?.bio || '',
      certificateFile: trainer?.certificateFile || ''
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
          {trainer ? 'Edit Trainer' : 'Add New Trainer'}
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
              placeholder="Enter trainer name"
            />
            {getFormErrorMessage('name')}
          </div>

          <div>
            <label htmlFor="specialty" className="block text-sm font-medium text-fitness-primary mb-2">
              Specialty *
            </label>
            <Dropdown
              id="specialty"
              name="specialty"
              value={formik.values.specialty}
              onChange={(e) => formik.setFieldValue('specialty', e.value)}
              options={specialties}
              placeholder="Select specialty"
              className={`w-full ${isFormFieldValid('specialty') ? 'p-invalid' : ''}`}
            />
            {getFormErrorMessage('specialty')}
          </div>

          <div>
            <label htmlFor="certificateNumber" className="block text-sm font-medium text-fitness-primary mb-2">
              Certificate Number *
            </label>
            <InputText
              id="certificateNumber"
              name="certificateNumber"
              value={formik.values.certificateNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full ${isFormFieldValid('certificateNumber') ? 'p-invalid' : ''}`}
              placeholder="Enter certificate number"
            />
            {getFormErrorMessage('certificateNumber')}
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
            <label htmlFor="bio" className="block text-sm font-medium text-fitness-primary mb-2">
              Bio *
            </label>
            <InputTextarea
              id="bio"
              name="bio"
              value={formik.values.bio}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              rows={4}
              className={`w-full ${isFormFieldValid('bio') ? 'p-invalid' : ''}`}
              placeholder="Enter trainer bio"
            />
            {getFormErrorMessage('bio')}
          </div>

          <div>
            <label htmlFor="certificateFile" className="block text-sm font-medium text-fitness-primary mb-2">
              Certificate File Location *
            </label>
            <InputText
              id="certificateFile"
              name="certificateFile"
              value={formik.values.certificateFile}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full ${isFormFieldValid('certificateFile') ? 'p-invalid' : ''}`}
              placeholder="Enter certificate file path"
            />
            {getFormErrorMessage('certificateFile')}
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

export default TrainerForm
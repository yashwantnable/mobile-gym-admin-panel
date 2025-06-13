import React from 'react'
import { Sidebar } from 'primereact/sidebar'
import { InputText } from 'primereact/inputtext'
import { InputNumber } from 'primereact/inputnumber'
import { Calendar } from 'primereact/calendar'
import { InputTextarea } from 'primereact/inputtextarea'
import { Dropdown } from 'primereact/dropdown'
import { Button } from 'primereact/button'
import { useFormik } from 'formik'
import * as Yup from 'yup'

const PromoCodeForm = ({ promoCode, visible, onHide, onSave }) => {
  const statusOptions = [
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' },
    { label: 'Expired', value: 'Expired' }
  ]

  const validationSchema = Yup.object({
    code: Yup.string().required('Promo code is required').min(3, 'Code must be at least 3 characters'),
    discount: Yup.number().min(1, 'Discount must be at least 1%').max(100, 'Discount cannot exceed 100%').required('Discount is required'),
    expiryDate: Yup.date().required('Expiry date is required').min(new Date(), 'Expiry date must be in the future'),
    maxUsage: Yup.number().min(1, 'Max usage must be at least 1').required('Max usage is required'),
    description: Yup.string().required('Description is required')
  })

  const formik = useFormik({
    initialValues: {
      code: promoCode?.code || '',
      discount: promoCode?.discount || 0,
      expiryDate: promoCode?.expiryDate ? new Date(promoCode.expiryDate) : null,
      status: promoCode?.status || 'Active',
      description: promoCode?.description || '',
      maxUsage: promoCode?.maxUsage || 1,
      usageCount: promoCode?.usageCount || 0
    },
    validationSchema,
    onSubmit: (values) => {
      const promoCodeData = {
        ...values,
        expiryDate: values.expiryDate ? values.expiryDate.toISOString().split('T')[0] : ''
      }
      onSave(promoCodeData)
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
          {promoCode ? 'Edit Promo Code' : 'Add New Promo Code'}
        </h3>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-fitness-primary mb-2">
              Promo Code *
            </label>
            <InputText
              id="code"
              name="code"
              value={formik.values.code}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full ${isFormFieldValid('code') ? 'p-invalid' : ''}`}
              placeholder="Enter promo code"
              style={{ textTransform: 'uppercase' }}
            />
            {getFormErrorMessage('code')}
          </div>

          <div>
            <label htmlFor="discount" className="block text-sm font-medium text-fitness-primary mb-2">
              Discount (%) *
            </label>
            <InputNumber
              id="discount"
              name="discount"
              value={formik.values.discount}
              onValueChange={(e) => formik.setFieldValue('discount', e.value)}
              min={1}
              max={100}
              suffix="%"
              className={`w-full ${isFormFieldValid('discount') ? 'p-invalid' : ''}`}
            />
            {getFormErrorMessage('discount')}
          </div>

          <div>
            <label htmlFor="expiryDate" className="block text-sm font-medium text-fitness-primary mb-2">
              Expiry Date *
            </label>
            <Calendar
              id="expiryDate"
              name="expiryDate"
              value={formik.values.expiryDate}
              onChange={(e) => formik.setFieldValue('expiryDate', e.value)}
              placeholder="Select expiry date"
              className={`w-full ${isFormFieldValid('expiryDate') ? 'p-invalid' : ''}`}
              showIcon
              minDate={new Date()}
            />
            {getFormErrorMessage('expiryDate')}
          </div>

          <div>
            <label htmlFor="maxUsage" className="block text-sm font-medium text-fitness-primary mb-2">
              Max Usage *
            </label>
            <InputNumber
              id="maxUsage"
              name="maxUsage"
              value={formik.values.maxUsage}
              onValueChange={(e) => formik.setFieldValue('maxUsage', e.value)}
              min={1}
              className={`w-full ${isFormFieldValid('maxUsage') ? 'p-invalid' : ''}`}
            />
            {getFormErrorMessage('maxUsage')}
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-fitness-primary mb-2">
              Status
            </label>
            <Dropdown
              id="status"
              name="status"
              value={formik.values.status}
              onChange={(e) => formik.setFieldValue('status', e.value)}
              options={statusOptions}
              placeholder="Select status"
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-fitness-primary mb-2">
              Description *
            </label>
            <InputTextarea
              id="description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              rows={4}
              className={`w-full ${isFormFieldValid('description') ? 'p-invalid' : ''}`}
              placeholder="Enter promo code description"
            />
            {getFormErrorMessage('description')}
          </div>

          {promoCode && (
            <div>
              <label className="block text-sm font-medium text-fitness-primary mb-2">
                Current Usage
              </label>
              <p className="text-fitness-secondary">
                {formik.values.usageCount} / {formik.values.maxUsage} uses
              </p>
            </div>
          )}

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

export default PromoCodeForm
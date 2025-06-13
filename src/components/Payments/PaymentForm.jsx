import React from 'react'
import { Sidebar } from 'primereact/sidebar'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { Calendar } from 'primereact/calendar'
import { InputNumber } from 'primereact/inputnumber'
import { InputTextarea } from 'primereact/inputtextarea'
import { Button } from 'primereact/button'
import { useFormik } from 'formik'
import * as Yup from 'yup'

const PaymentForm = ({ payment, visible, onHide, onSave }) => {
  const clients = [
    { label: 'Emma Wilson', value: 'Emma Wilson' },
    { label: 'John Smith', value: 'John Smith' },
    { label: 'Lisa Brown', value: 'Lisa Brown' }
  ]

  const paymentMethods = [
    { label: 'Credit Card', value: 'Credit Card' },
    { label: 'Bank Transfer', value: 'Bank Transfer' },
    { label: 'Cash', value: 'Cash' },
    { label: 'PayPal', value: 'PayPal' }
  ]

  const statusOptions = [
    { label: 'Pending', value: 'Pending' },
    { label: 'Paid', value: 'Paid' },
    { label: 'Overdue', value: 'Overdue' },
    { label: 'Refunded', value: 'Refunded' }
  ]

  const validationSchema = Yup.object({
    client: Yup.string().required('Client is required'),
    amount: Yup.number().min(0.01, 'Amount must be greater than 0').required('Amount is required'),
    paymentMethod: Yup.string().required('Payment method is required'),
    date: Yup.date().required('Date is required'),
    dueDate: Yup.date().required('Due date is required'),
    status: Yup.string().required('Status is required')
  })

  const formik = useFormik({
    initialValues: {
      client: payment?.client || '',
      amount: payment?.amount || 0,
      paymentMethod: payment?.paymentMethod || '',
      date: payment?.date ? new Date(payment.date) : new Date(),
      dueDate: payment?.dueDate ? new Date(payment.dueDate) : new Date(),
      status: payment?.status || 'Pending',
      notes: payment?.notes || ''
    },
    validationSchema,
    onSubmit: (values) => {
      const paymentData = {
        ...values,
        date: values.date ? values.date.toISOString().split('T')[0] : '',
        dueDate: values.dueDate ? values.dueDate.toISOString().split('T')[0] : ''
      }
      onSave(paymentData)
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
          {payment ? 'Edit Payment' : 'Add New Payment'}
        </h3>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
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
            <label htmlFor="amount" className="block text-sm font-medium text-fitness-primary mb-2">
              Amount *
            </label>
            <InputNumber
              id="amount"
              name="amount"
              value={formik.values.amount}
              onValueChange={(e) => formik.setFieldValue('amount', e.value)}
              mode="currency"
              currency="USD"
              locale="en-US"
              className={`w-full ${isFormFieldValid('amount') ? 'p-invalid' : ''}`}
            />
            {getFormErrorMessage('amount')}
          </div>

          <div>
            <label htmlFor="paymentMethod" className="block text-sm font-medium text-fitness-primary mb-2">
              Payment Method *
            </label>
            <Dropdown
              id="paymentMethod"
              name="paymentMethod"
              value={formik.values.paymentMethod}
              onChange={(e) => formik.setFieldValue('paymentMethod', e.value)}
              options={paymentMethods}
              placeholder="Select payment method"
              className={`w-full ${isFormFieldValid('paymentMethod') ? 'p-invalid' : ''}`}
            />
            {getFormErrorMessage('paymentMethod')}
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-fitness-primary mb-2">
              Payment Date *
            </label>
            <Calendar
              id="date"
              name="date"
              value={formik.values.date}
              onChange={(e) => formik.setFieldValue('date', e.value)}
              placeholder="Select payment date"
              className={`w-full ${isFormFieldValid('date') ? 'p-invalid' : ''}`}
              showIcon
            />
            {getFormErrorMessage('date')}
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-fitness-primary mb-2">
              Due Date *
            </label>
            <Calendar
              id="dueDate"
              name="dueDate"
              value={formik.values.dueDate}
              onChange={(e) => formik.setFieldValue('dueDate', e.value)}
              placeholder="Select due date"
              className={`w-full ${isFormFieldValid('dueDate') ? 'p-invalid' : ''}`}
              showIcon
            />
            {getFormErrorMessage('dueDate')}
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-fitness-primary mb-2">
              Status *
            </label>
            <Dropdown
              id="status"
              name="status"
              value={formik.values.status}
              onChange={(e) => formik.setFieldValue('status', e.value)}
              options={statusOptions}
              placeholder="Select status"
              className={`w-full ${isFormFieldValid('status') ? 'p-invalid' : ''}`}
            />
            {getFormErrorMessage('status')}
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
              placeholder="Enter payment notes"
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

export default PaymentForm
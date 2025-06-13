import React from 'react'
import { Sidebar } from 'primereact/sidebar'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { Calendar } from 'primereact/calendar'
import { InputTextarea } from 'primereact/inputtextarea'
import { InputNumber } from 'primereact/inputnumber'
import { Button } from 'primereact/button'
import { motion } from 'framer-motion'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Save, X } from 'lucide-react'

const SessionForm = ({ session, visible, onHide, onSave }) => {
  const sessionTypes = [
    { label: 'Yoga', value: 'Yoga' },
    { label: 'Cardio', value: 'Cardio' },
    { label: 'Zumba', value: 'Zumba' },
    { label: 'Strength', value: 'Strength' },
    { label: 'Pilates', value: 'Pilates' }
  ]

  const trainers = [
    { label: 'Sarah Johnson', value: 'Sarah Johnson' },
    { label: 'Mike Davis', value: 'Mike Davis' },
    { label: 'Anna Lee', value: 'Anna Lee' },
    { label: 'Tom Wilson', value: 'Tom Wilson' }
  ]

  const validationSchema = Yup.object({
    name: Yup.string().required('Session name is required'),
    type: Yup.string().required('Session type is required'),
    trainer: Yup.string().required('Trainer is required'),
    date: Yup.date().required('Date is required'),
    time: Yup.string().required('Time is required'),
    location: Yup.string().required('Location is required'),
    maxParticipants: Yup.number().min(1, 'Must be at least 1').required('Max participants is required'),
    description: Yup.string().required('Description is required')
  })

  const formik = useFormik({
    initialValues: {
      name: session?.name || '',
      type: session?.type || '',
      trainer: session?.trainer || '',
      date: session?.date ? new Date(session.date) : null,
      time: session?.time || '',
      location: session?.location || '',
      maxParticipants: session?.maxParticipants || 1,
      description: session?.description || ''
    },
    validationSchema,
    onSubmit: (values) => {
      const sessionData = {
        ...values,
        date: values.date ? values.date.toISOString().split('T')[0] : ''
      }
      onSave(sessionData)
    }
  })

  const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name])
  const getFormErrorMessage = (name) => {
    return isFormFieldValid(name) && <small className="text-red-500 text-xs mt-1 block">{formik.errors[name]}</small>
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
      <motion.div 
        className="p-6 h-full"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold gradient-text">
            {session ? 'Edit Session' : 'Add New Session'}
          </h3>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onHide}
            className="p-2 rounded-lg glass hover:bg-white/20 transition-colors"
          >
            <X size={20} className="text-fitness-primary" />
          </motion.button>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <label htmlFor="name" className="block text-sm font-semibold text-fitness-primary mb-2">
              Session Name *
            </label>
            <InputText
              id="name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full ${isFormFieldValid('name') ? 'border-red-500' : ''}`}
              placeholder="Enter session name"
            />
            {getFormErrorMessage('name')}
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <label htmlFor="type" className="block text-sm font-semibold text-fitness-primary mb-2">
              Session Type *
            </label>
            <Dropdown
              id="type"
              name="type"
              value={formik.values.type}
              onChange={(e) => formik.setFieldValue('type', e.value)}
              options={sessionTypes}
              placeholder="Select session type"
              className={`w-full ${isFormFieldValid('type') ? 'border-red-500' : ''}`}
            />
            {getFormErrorMessage('type')}
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <label htmlFor="trainer" className="block text-sm font-semibold text-fitness-primary mb-2">
              Trainer *
            </label>
            <Dropdown
              id="trainer"
              name="trainer"
              value={formik.values.trainer}
              onChange={(e) => formik.setFieldValue('trainer', e.value)}
              options={trainers}
              placeholder="Select trainer"
              className={`w-full ${isFormFieldValid('trainer') ? 'border-red-500' : ''}`}
            />
            {getFormErrorMessage('trainer')}
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <label htmlFor="date" className="block text-sm font-semibold text-fitness-primary mb-2">
              Date *
            </label>
            <Calendar
              id="date"
              name="date"
              value={formik.values.date}
              onChange={(e) => formik.setFieldValue('date', e.value)}
              placeholder="Select date"
              className={`w-full ${isFormFieldValid('date') ? 'border-red-500' : ''}`}
              showIcon
            />
            {getFormErrorMessage('date')}
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <label htmlFor="time" className="block text-sm font-semibold text-fitness-primary mb-2">
              Time *
            </label>
            <InputText
              id="time"
              name="time"
              type="time"
              value={formik.values.time}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full ${isFormFieldValid('time') ? 'border-red-500' : ''}`}
            />
            {getFormErrorMessage('time')}
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <label htmlFor="location" className="block text-sm font-semibold text-fitness-primary mb-2">
              Location *
            </label>
            <InputText
              id="location"
              name="location"
              value={formik.values.location}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full ${isFormFieldValid('location') ? 'border-red-500' : ''}`}
              placeholder="Enter location"
            />
            {getFormErrorMessage('location')}
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <label htmlFor="maxParticipants" className="block text-sm font-semibold text-fitness-primary mb-2">
              Max Participants *
            </label>
            <InputNumber
              id="maxParticipants"
              name="maxParticipants"
              value={formik.values.maxParticipants}
              onValueChange={(e) => formik.setFieldValue('maxParticipants', e.value)}
              min={1}
              className={`w-full ${isFormFieldValid('maxParticipants') ? 'border-red-500' : ''}`}
            />
            {getFormErrorMessage('maxParticipants')}
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <label htmlFor="description" className="block text-sm font-semibold text-fitness-primary mb-2">
              Description *
            </label>
            <InputTextarea
              id="description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              rows={4}
              className={`w-full ${isFormFieldValid('description') ? 'border-red-500' : ''}`}
              placeholder="Enter session description"
            />
            {getFormErrorMessage('description')}
          </motion.div>

          <motion.div 
            className="flex gap-3 pt-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                className="w-full btn-gradient flex items-center justify-center space-x-2"
              >
                <Save size={18} />
                <span>Save</span>
              </Button>
            </motion.div>
            <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="button"
                onClick={onHide}
                className="w-full p-button-secondary flex items-center justify-center space-x-2"
              >
                <X size={18} />
                <span>Cancel</span>
              </Button>
            </motion.div>
          </motion.div>
        </form>
      </motion.div>
    </Sidebar>
  )
}

export default SessionForm
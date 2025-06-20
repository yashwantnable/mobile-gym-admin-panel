import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import InputField from '../../Components/InputField';

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState('push');

  const formik = useFormik({
    initialValues: {
      pushNotification: true,
      emailNotification: true,
      smsNotification: false,
      pushTemplate: '',
      emailTemplate: '',
      smsTemplate: '',
      terms: '',
      cancellation: '',
    },
    validationSchema: Yup.object({
      pushTemplate: Yup.string().required('Push template is required'),
      emailTemplate: Yup.string().required('Email template is required'),
      smsTemplate: Yup.string().required('SMS template is required'),
      terms: Yup.string().required('Terms & Conditions are required'),
      cancellation: Yup.string().required('Cancellation Policy is required'),
    }),
    onSubmit: (values) => {
      console.log('Form values:', values);
    },
  });

  const tabList = [
    { key: 'push', label: 'Push Template' },
    { key: 'email', label: 'Email Template' },
    { key: 'sms', label: 'SMS Template' },
  ];

  return (
    <div className='p-5 mx-10'>
      <h2 className='text-2xl font-bold mb-4'>System Settings</h2>

      <form onSubmit={formik.handleSubmit} className='space-y-6'>
        {/* Notification Preferences */}
        <div>
          <h3 className='text-xl font-semibold mb-2'>Notification Preferences</h3>
          <div className='flex gap-10'>
            {['pushNotification', 'emailNotification', 'smsNotification'].map((type) => (
              <label key={type} className='block mb-2'>
                <input
                  type='checkbox'
                  name={type}
                  checked={formik.values[type]}
                  onChange={formik.handleChange}
                  className='mr-2'
                />
                Enable {type.replace('Notification', '').toUpperCase()}
              </label>
            ))}
          </div>
        </div>

        {/* Notification Templates Tabs */}
        <div className=''>
          <h3 className='text-xl font-semibold mb-2'>Notification Templates</h3>

          {/* Tab Buttons */}
          <div className='flex space-x-2 mb-4'>
            {tabList.map((tab) => (
              <button
                key={tab.key}
                type='button'
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-t ${
                  activeTab === tab.key ? 'bg-primary text-white' : 'bg-gray-200 text-gray-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className=' p-4 rounded-md shadow-md'>
            {activeTab === 'push' && (
              <InputField
                name='pushTemplate'
                label='Push Template'
                placeholder='Enter push notification...'
                isRequired
                multiline
                rows={4}
                type={'textarea'}
                value={formik.values.pushTemplate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.pushTemplate && formik.errors.pushTemplate}
              />
            )}

            {activeTab === 'email' && (
              <InputField
                name='emailTemplate'
                label='Email Template'
                placeholder='Enter email template...'
                isRequired
                multiline
                rows={4}
                type={'textarea'}
                value={formik.values.emailTemplate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.emailTemplate && formik.errors.emailTemplate}
              />
            )}

            {activeTab === 'sms' && (
              <InputField
                name='smsTemplate'
                label='SMS Template'
                placeholder='Enter SMS template...'
                isRequired
                 multiline
            rows={4}
                type={'textarea'}
                value={formik.values.smsTemplate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.smsTemplate && formik.errors.smsTemplate}
              />
            )}
          </div>
        </div>

        {/* Policies */}
        <div>
          <h3 className='text-xl font-semibold mb-2'>Policies</h3>

          <InputField
            name='terms'
            label='Terms & Conditions'
            placeholder='Enter terms and conditions...'
            isRequired
            multiline
            rows={4}
            type={'textarea'}
            value={formik.values.terms}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.terms && formik.errors.terms}
          />

          <InputField
            name='cancellation'
            label='Cancellation Policy'
            placeholder='Enter cancellation policy...'
            isRequired
            multiline
            rows={4}
            type={'textarea'}
            value={formik.values.cancellation}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.cancellation && formik.errors.cancellation}
          />
        </div>

        <button type='submit' className='px-4 py-2 bg-primary text-white rounded'>
          Save Settings
        </button>
      </form>
    </div>
  );
};

export default SystemSettings;

import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff, FiCheck } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Account = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Mock admin data
  const adminData = {
    name: 'Alex Johnson',
    email: 'alex.johnson@pawsandclaws.com',
    phone: '+1 (555) 123-4567',
    role: 'Super Admin',
    joinDate: 'January 15, 2022',
    lastLogin: 'Today at 10:30 AM',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  };

  // Profile form validation schema
  const profileSchema = Yup.object().shape({
    name: Yup.string().required('Full name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string().matches(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, 'Invalid phone number')
  });

  // Password form validation schema
  const passwordSchema = Yup.object().shape({
    currentPassword: Yup.string().required('Current password is required'),
    newPassword: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .matches(/[a-z]/, 'Must contain at least one lowercase letter')
      .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
      .matches(/[0-9]/, 'Must contain at least one number')
      .required('New password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
      .required('Please confirm your password')
  });

  // Profile form
  const profileFormik = useFormik({
    initialValues: {
      name: adminData.name,
      email: adminData.email,
      phone: adminData.phone
    },
    validationSchema: profileSchema,
    onSubmit: (values) => {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        console.log('Profile updated:', values);
        setIsLoading(false);
        setSuccessMessage('Profile updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      }, 1500);
    }
  });

  // Password form
  const passwordFormik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    validationSchema: passwordSchema,
    onSubmit: (values) => {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        console.log('Password changed:', values);
        setIsLoading(false);
        setSuccessMessage('Password changed successfully!');
        passwordFormik.resetForm();
        setTimeout(() => setSuccessMessage(''), 3000);
      }, 1500);
    }
  });

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Account Settings</h1>
            <p className="text-gray-500">Manage your admin account details</p>
          </div>
          {successMessage && (
            <div className="flex items-center bg-green-100 text-green-700 px-4 py-2 rounded-md mt-4 md:mt-0">
              <FiCheck className="mr-2" />
              {successMessage}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-200">
              <div className="p-6 flex flex-col items-center">
                <div className="relative mb-4">
                  <img
                    src={adminData.avatar}
                    alt="Admin"
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                  />
                  <div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-1.5">
                    <div className="w-4 h-4 rounded-full bg-white"></div>
                  </div>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">{adminData.name}</h2>
                <p className="text-gray-500 text-sm">{adminData.role}</p>
              </div>
              <nav className="space-y-1 p-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'profile' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <FiUser className="mr-3" />
                  Profile Information
                </button>
                <button
                  onClick={() => setActiveTab('password')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'password' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <FiLock className="mr-3" />
                  Password
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'security' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <FiLock className="mr-3" />
                  Security
                </button>
              </nav>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-6 md:p-8">
              {activeTab === 'profile' && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6">Profile Information</h2>
                  <form onSubmit={profileFormik.handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiUser className="text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="name"
                            value={profileFormik.values.name}
                            onChange={profileFormik.handleChange}
                            onBlur={profileFormik.handleBlur}
                            className={`pl-10 w-full rounded-lg border ${profileFormik.errors.name && profileFormik.touched.name ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500`}
                            placeholder="Your full name"
                          />
                        </div>
                        {profileFormik.errors.name && profileFormik.touched.name && (
                          <p className="mt-1 text-sm text-red-600">{profileFormik.errors.name}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiMail className="text-gray-400" />
                          </div>
                          <input
                            type="email"
                            name="email"
                            value={profileFormik.values.email}
                            onChange={profileFormik.handleChange}
                            onBlur={profileFormik.handleBlur}
                            className={`pl-10 w-full rounded-lg border ${profileFormik.errors.email && profileFormik.touched.email ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500`}
                            placeholder="Your email address"
                          />
                        </div>
                        {profileFormik.errors.email && profileFormik.touched.email && (
                          <p className="mt-1 text-sm text-red-600">{profileFormik.errors.email}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiPhone className="text-gray-400" />
                          </div>
                          <input
                            type="tel"
                            name="phone"
                            value={profileFormik.values.phone}
                            onChange={profileFormik.handleChange}
                            onBlur={profileFormik.handleBlur}
                            className={`pl-10 w-full rounded-lg border ${profileFormik.errors.phone && profileFormik.touched.phone ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500`}
                            placeholder="Your phone number"
                          />
                        </div>
                        {profileFormik.errors.phone && profileFormik.touched.phone && (
                          <p className="mt-1 text-sm text-red-600">{profileFormik.errors.phone}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <input
                          type="text"
                          value={adminData.role}
                          disabled
                          className="w-full rounded-lg border border-gray-300 bg-gray-100 pl-3 cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {activeTab === 'password' && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6">Change Password</h2>
                  <form onSubmit={passwordFormik.handleSubmit}>
                    <div className="space-y-6 mb-8">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiLock className="text-gray-400" />
                          </div>
                          <input
                            type={showCurrentPassword ? "text" : "password"}
                            name="currentPassword"
                            value={passwordFormik.values.currentPassword}
                            onChange={passwordFormik.handleChange}
                            onBlur={passwordFormik.handleBlur}
                            className={`pl-10 w-full rounded-lg border ${passwordFormik.errors.currentPassword && passwordFormik.touched.currentPassword ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500`}
                            placeholder="Your current password"
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          >
                            {showCurrentPassword ? <FiEyeOff className="text-gray-400" /> : <FiEye className="text-gray-400" />}
                          </button>
                        </div>
                        {passwordFormik.errors.currentPassword && passwordFormik.touched.currentPassword && (
                          <p className="mt-1 text-sm text-red-600">{passwordFormik.errors.currentPassword}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiLock className="text-gray-400" />
                          </div>
                          <input
                            type={showNewPassword ? "text" : "password"}
                            name="newPassword"
                            value={passwordFormik.values.newPassword}
                            onChange={passwordFormik.handleChange}
                            onBlur={passwordFormik.handleBlur}
                            className={`pl-10 w-full rounded-lg border ${passwordFormik.errors.newPassword && passwordFormik.touched.newPassword ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500`}
                            placeholder="Your new password"
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? <FiEyeOff className="text-gray-400" /> : <FiEye className="text-gray-400" />}
                          </button>
                        </div>
                        {passwordFormik.errors.newPassword && passwordFormik.touched.newPassword && (
                          <p className="mt-1 text-sm text-red-600">{passwordFormik.errors.newPassword}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiLock className="text-gray-400" />
                          </div>
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={passwordFormik.values.confirmPassword}
                            onChange={passwordFormik.handleChange}
                            onBlur={passwordFormik.handleBlur}
                            className={`pl-10 w-full rounded-lg border ${passwordFormik.errors.confirmPassword && passwordFormik.touched.confirmPassword ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500`}
                            placeholder="Confirm your new password"
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <FiEyeOff className="text-gray-400" /> : <FiEye className="text-gray-400" />}
                          </button>
                        </div>
                        {passwordFormik.errors.confirmPassword && passwordFormik.touched.confirmPassword && (
                          <p className="mt-1 text-sm text-red-600">{passwordFormik.errors.confirmPassword}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isLoading ? 'Updating...' : 'Update Password'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {activeTab === 'security' && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6">Security Settings</h2>
                  <div className="space-y-6">
                    <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-800">Two-Factor Authentication</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                          Enable
                        </button>
                      </div>
                    </div>

                    <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-800">Login History</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Last login: {adminData.lastLogin}
                          </p>
                        </div>
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors">
                          View All
                        </button>
                      </div>
                    </div>

                    <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-800">Active Sessions</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            1 active session (this device)
                          </p>
                        </div>
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors">
                          Manage Sessions
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Account;
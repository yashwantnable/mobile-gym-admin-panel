import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff, FiCheck, FiEdit } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { CiLocationOn } from 'react-icons/ci';
import { useSelector } from 'react-redux';
import InputField from '../../Components/InputField';
import { MasterApi } from '../../Api/Master.api';
import { TrainerApi } from '../../Api/Trainer.api';
import { useLoading } from '../../Components/loader/LoaderContext';

const Account = () => {
  const { handleLoading } = useLoading();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [countryData, setCountryData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [countryId, setCountryId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const user = useSelector((state) => state?.store?.currentUser);
  const [preview, setPreview] = useState(user.profile_image);
  const [success, setSuccess] = useState('');

   const [isEditing, setIsEditing] = useState(false);

  const startEdit   = () => setIsEditing(true);
  const cancelEdit  = () => {
    profileFormik.resetForm();   // revert unsaved changes
    setIsEditing(false);
  };

  const handleFile = (e) => {
    const file = e.currentTarget.files[0];
    if (file) {
      formik.setFieldValue('profile_image', file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleCountry = async () => {
    try {
      const res = await MasterApi.country();
      setCountryData(res?.data?.data);
    } catch (err) {
      console.log(err);
    }
  };

  const   GENDER_OPTS = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' },
  ];
  const STATUS_OPTS = [
    { value: 'AVAILABLE', label: 'Available' },
    { value: 'BUSY', label: 'Busy' },
    { value: 'NOT_AVAILABLE', label: 'Not Available' },
  ];

  // Mock admin data
  // const user = {
  //   first_name: 'Alex Johnson',
  //   email: 'alex.johnson@pawsandclaws.com',
  //   phone_number: '+1 (555) 123-4567',
  //   role: 'Super Admin',
  //   joinDate: 'January 15, 2022',
  //   lastLogin: 'Today at 10:30 AM',
  //   avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  // };

  // Profile form validation schema
  const profileSchema = Yup.object({
    first_name: Yup.string().required('First name is required'),
    last_name: Yup.string().required('Last name is required'),
    email: Yup.string().email().required('Email is required'),
    phone_number: Yup.string().required('Phone number is required'),
    address: Yup.string().required('Address is required'),
    gender: Yup.string().oneOf(GENDER_OPTS),
    age: Yup.number().min(18).max(100),
    experienceYear: Yup.number().min(0).max(50),
    userStatus: Yup.string().oneOf(STATUS_OPTS),
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
      .required('Please confirm your password'),
  });

  // Profile form
  const profileFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      first_name: user.first_name ?? '',
      last_name: user.last_name ?? '',
      email: user.email ?? '',
      phone_number: user.phone_number ?? '',
      address: user.address ?? '',
      gender: user.gender ?? '',
      age: user.age ?? '',
      specialization: user.specialization ?? '',
      experienceYear: user.experienceYear ?? '',
      userStatus: user.userStatus ?? 'AVAILABLE',
      country: user.country?._id ?? '',
      city: user.city?._id ?? '',
      profile_image: null,
    },
    // validationSchema: profileSchema,
    onSubmit:async (values) => {
      handleLoading(true);
      try{
        const res = await TrainerApi.trainerProfileUpdate(values);
      }catch(err){
        console.error("error:",err)
      }finally{
        handleLoading(false);
      }
    },
  });

  const handleCountryChange = async (e) => {
    const selectedCountryId = e.target.value;
    // console.log("country id:",e.target.value);
    
    setCountryId(selectedCountryId);
    profileFormik.setFieldValue('country', selectedCountryId);

    if (selectedCountryId) {
      try {
        const res = await MasterApi.city(selectedCountryId);
        setCityData(res.data?.data);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const countryOptions = countryData.map((item) => {
    return {
      value: item?._id,
      label: `${item?.name}`,
    };
  });

  const cityOptions = cityData.map((item) => ({
    value: item?._id,
    label: item?.name,
  }));

  // Password form
  const passwordFormik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
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
    },
  });

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  useEffect(() => {
    handleCountry();
  }, []);
  return (
    <div className='min-h-screen bg-gray-50 p-4 md:p-8'>
      <motion.div
        initial='hidden'
        animate='visible'
        variants={fadeIn}
        className='max-w-6xl mx-auto'
      >
        {/* Header */}
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-8'>
          <div>
            <h1 className='text-3xl font-bold text-gray-800'>Account Settings</h1>
            <p className='text-gray-500'>Manage your admin account details</p>
          </div>
          {successMessage && (
            <div className='flex items-center bg-green-100 text-green-700 px-4 py-2 rounded-md mt-4 md:mt-0'>
              <FiCheck className='mr-2' />
              {successMessage}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className='bg-white rounded-xl shadow-md overflow-hidden'>
          <div className='flex flex-col md:flex-row'>
            {/* Sidebar Navigation */}
            <div className='w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-200'>
              <div className='p-6 flex flex-col items-center'>
                <div className='relative mb-4'>
                  <img
                    src={user.profile_image}
                    alt='Admin'
                    className='w-24 h-24 rounded-full object-cover border-4 border-white shadow-md'
                  />
                  <div className='absolute bottom-0 right-0 bg-green-500 rounded-full p-1.5'>
                    <div className='w-4 h-4 rounded-full bg-green-500'></div>
                  </div>
                </div>
                <h2 className='text-xl font-semibold text-gray-800'>{user.first_name}</h2>
                <p className='text-gray-500 text-sm'>{user.role}</p>
              </div>
              <nav className='space-y-1 p-2'>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'profile' ? 'bg-indigo-50 text-primary' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <FiUser className='mr-3' />
                  Profile Information
                </button>
                <button
                  onClick={() => setActiveTab('password')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'password' ? 'bg-indigo-50 text-primary' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <FiLock className='mr-3' />
                  Password
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'security' ? 'bg-indigo-50 text-primary' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <FiLock className='mr-3' />
                  Security
                </button>
              </nav>
            </div>

            {/* Content Area */}
            <div className='flex-1 p-6 md:p-8'>
              {activeTab === 'profile' && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* ── Header + edit button ───────────────────────────── */}
                  <div className='flex items-center justify-between mb-6'>
                    <h2 className='text-2xl font-semibold text-gray-800'>Profile Information</h2>

                    {!isEditing ? (
                      <button
                        onClick={startEdit}
                        className='flex items-center gap-1 text-primary hover:underline'
                      >
                        <FiEdit />
                        Edit
                      </button>
                    ) : (
                      <button
                        onClick={cancelEdit}
                        className='text-sm text-rose-600 hover:underline'
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  {/* ── Form ───────────────────────────────────────────── */}
                  <form
                    onSubmit={profileFormik.handleSubmit}
                    className='space-y-8'
                    autoComplete='off'
                  >
                    {/* ── Avatar ───────────────────────────────────────── */}
                    <div className='flex items-center gap-6'>
                      <img
                        src={preview}
                        alt='avatar'
                        className='h-20 w-20 rounded-full object-cover border'
                      />
                      {isEditing && (
                        <label className='cursor-pointer bg-primary text-white px-4 py-2 rounded-md'>
                          Change photo
                          <input
                            type='file'
                            name='profile_image'
                            accept='image/*'
                            onChange={handleFile}
                            className='hidden'
                          />
                        </label>
                      )}
                    </div>

                    {/* ── Basic contact info ───────────────────────────── */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <InputField
                        name='first_name'
                        label='First Name'
                        icon={FiUser}
                        value={profileFormik.values.first_name}
                        error={profileFormik.touched.first_name && profileFormik.errors.first_name}
                        onChange={profileFormik.handleChange}
                        onBlur={profileFormik.handleBlur}
                        placeholder='Nick'
                        isRequired
                        disabled={!isEditing}
                      />

                      <InputField
                        name='last_name'
                        label='Last Name'
                        icon={FiUser}
                        value={profileFormik.values.last_name}
                        error={profileFormik.touched.last_name && profileFormik.errors.last_name}
                        onChange={profileFormik.handleChange}
                        onBlur={profileFormik.handleBlur}
                        placeholder='Mitchell'
                        isRequired
                        disabled={!isEditing}
                      />

                      <InputField
                        name='email'
                        label='Email'
                        type='email'
                        icon={FiMail}
                        value={profileFormik.values.email}
                        error={profileFormik.touched.email && profileFormik.errors.email}
                        onChange={profileFormik.handleChange}
                        onBlur={profileFormik.handleBlur}
                        placeholder='nick@gmail.com'
                        isRequired
                        disabled={!isEditing}
                      />

                      <InputField
                        name='phone_number'
                        label='Phone Number'
                        type='tel'
                        icon={FiPhone}
                        value={profileFormik.values.phone_number}
                        error={
                          profileFormik.touched.phone_number && profileFormik.errors.phone_number
                        }
                        onChange={profileFormik.handleChange}
                        onBlur={profileFormik.handleBlur}
                        placeholder='+971 …'
                        isRequired
                        disabled={!isEditing}
                      />

                      <InputField
                        name='address'
                        label='Address'
                        icon={CiLocationOn}
                        value={profileFormik.values.address}
                        error={profileFormik.touched.address && profileFormik.errors.address}
                        onChange={profileFormik.handleChange}
                        onBlur={profileFormik.handleBlur}
                        placeholder='street 5, Dubai'
                        isRequired
                        disabled={!isEditing}
                      />
                    </div>

                    {/* ── Demographics ─────────────────────────────────── */}
                    {/* {JSON.stringify(profileFormik.values.gender)} */}
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                      <InputField
                        name='gender'
                        label='Gender'
                        type='select'
                        options={GENDER_OPTS}
                        value={profileFormik.values.gender}
                        error={profileFormik.touched.gender && profileFormik.errors.gender}
                        onChange={profileFormik.handleChange}
                        onBlur={profileFormik.handleBlur}
                        disabled={!isEditing}
                      />

                      <InputField
                        name='age'
                        label='Age'
                        type='number'
                        value={profileFormik.values.age}
                        error={profileFormik.touched.age && profileFormik.errors.age}
                        onChange={profileFormik.handleChange}
                        onBlur={profileFormik.handleBlur}
                        placeholder='34'
                        disabled={!isEditing}
                      />

                      <InputField
                        name='userStatus'
                        label='User Status'
                        type='select'
                        options={STATUS_OPTS}
                        value={profileFormik.values.userStatus}
                        error={profileFormik.touched.userStatus && profileFormik.errors.userStatus}
                        onChange={profileFormik.handleChange}
                        onBlur={profileFormik.handleBlur}
                        disabled={!isEditing}
                      />
                    </div>

                    {/* ── Location ─────────────────────────────────────── */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <InputField
                        name='country'
                        label='Country'
                        type='select'
                        options={countryOptions}
                        value={profileFormik.values.country}
                        error={profileFormik.touched.country && profileFormik.errors.country}
                        onChange={handleCountryChange}
                        onBlur={profileFormik.handleBlur}
                        isRequired
                        disabled={!isEditing}
                      />

                      <InputField
                        name='city'
                        label='City'
                        type='select'
                        options={cityOptions}
                        value={profileFormik.values.city}
                        error={profileFormik.touched.city && profileFormik.errors.city}
                        onChange={profileFormik.handleChange}
                        onBlur={profileFormik.handleBlur}
                        isRequired
                        disabled={!isEditing}
                      />
                    </div>

                    {/* ── Professional ─────────────────────────────────── */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <InputField
                        name='specialization'
                        label='Specialization (comma separated)'
                        value={profileFormik.values.specialization}
                        error={
                          profileFormik.touched.specialization &&
                          profileFormik.errors.specialization
                        }
                        onChange={profileFormik.handleChange}
                        onBlur={profileFormik.handleBlur}
                        placeholder='yoga, zumba'
                        disabled={!isEditing}
                      />

                      <InputField
                        name='experienceYear'
                        label='Years of Experience'
                        type='number'
                        value={profileFormik.values.experienceYear}
                        error={
                          profileFormik.touched.experienceYear &&
                          profileFormik.errors.experienceYear
                        }
                        onChange={profileFormik.handleChange}
                        onBlur={profileFormik.handleBlur}
                        placeholder='3'
                        disabled={!isEditing}
                      />
                    </div>

                    {/* ── Submit & success ─────────────────────────────── */}
                    {isEditing && (
                      <div className='flex justify-end'>
                        <button
                          type='submit'
                          disabled={isLoading}
                          className='px-6 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-70'
                        >
                          {isLoading ? 'Saving…' : 'Save Changes'}
                        </button>
                      </div>
                    )}

                    {successMessage && (
                      <p className='text-green-600 text-sm text-right'>{successMessage}</p>
                    )}
                  </form>
                </motion.div>
              )}

              {activeTab === 'password' && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className='text-2xl font-semibold text-gray-800 mb-6'>Change Password</h2>
                  <form onSubmit={passwordFormik.handleSubmit}>
                    <div className='space-y-6 mb-8'>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Current Password
                        </label>
                        <div className='relative'>
                          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                            <FiLock className='text-gray-400' />
                          </div>
                          <input
                            type={showCurrentPassword ? 'text' : 'password'}
                            name='currentPassword'
                            value={passwordFormik.values.currentPassword}
                            onChange={passwordFormik.handleChange}
                            onBlur={passwordFormik.handleBlur}
                            className={`pl-10 w-full rounded-lg border ${passwordFormik.errors.currentPassword && passwordFormik.touched.currentPassword ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500`}
                            placeholder='Your current password'
                          />
                          <button
                            type='button'
                            className='absolute inset-y-0 right-0 pr-3 flex items-center'
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          >
                            {showCurrentPassword ? (
                              <FiEyeOff className='text-gray-400' />
                            ) : (
                              <FiEye className='text-gray-400' />
                            )}
                          </button>
                        </div>
                        {passwordFormik.errors.currentPassword &&
                          passwordFormik.touched.currentPassword && (
                            <p className='mt-1 text-sm text-red-600'>
                              {passwordFormik.errors.currentPassword}
                            </p>
                          )}
                      </div>

                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          New Password
                        </label>
                        <div className='relative'>
                          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                            <FiLock className='text-gray-400' />
                          </div>
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            name='newPassword'
                            value={passwordFormik.values.newPassword}
                            onChange={passwordFormik.handleChange}
                            onBlur={passwordFormik.handleBlur}
                            className={`pl-10 w-full rounded-lg border ${passwordFormik.errors.newPassword && passwordFormik.touched.newPassword ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500`}
                            placeholder='Your new password'
                          />
                          <button
                            type='button'
                            className='absolute inset-y-0 right-0 pr-3 flex items-center'
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? (
                              <FiEyeOff className='text-gray-400' />
                            ) : (
                              <FiEye className='text-gray-400' />
                            )}
                          </button>
                        </div>
                        {passwordFormik.errors.newPassword &&
                          passwordFormik.touched.newPassword && (
                            <p className='mt-1 text-sm text-red-600'>
                              {passwordFormik.errors.newPassword}
                            </p>
                          )}
                      </div>

                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Confirm New Password
                        </label>
                        <div className='relative'>
                          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                            <FiLock className='text-gray-400' />
                          </div>
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            name='confirmPassword'
                            value={passwordFormik.values.confirmPassword}
                            onChange={passwordFormik.handleChange}
                            onBlur={passwordFormik.handleBlur}
                            className={`pl-10 w-full rounded-lg border ${passwordFormik.errors.confirmPassword && passwordFormik.touched.confirmPassword ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500`}
                            placeholder='Confirm your new password'
                          />
                          <button
                            type='button'
                            className='absolute inset-y-0 right-0 pr-3 flex items-center'
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <FiEyeOff className='text-gray-400' />
                            ) : (
                              <FiEye className='text-gray-400' />
                            )}
                          </button>
                        </div>
                        {passwordFormik.errors.confirmPassword &&
                          passwordFormik.touched.confirmPassword && (
                            <p className='mt-1 text-sm text-red-600'>
                              {passwordFormik.errors.confirmPassword}
                            </p>
                          )}
                      </div>
                    </div>

                    <div className='flex justify-end'>
                      <button
                        type='submit'
                        disabled={isLoading}
                        className='px-6 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed'
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
                  <h2 className='text-2xl font-semibold text-gray-800 mb-6'>Security Settings</h2>
                  <div className='space-y-6'>
                    <div className='p-6 bg-gray-50 rounded-lg border border-gray-200'>
                      <div className='flex justify-between items-start'>
                        <div>
                          <h3 className='font-medium text-gray-800'>Two-Factor Authentication</h3>
                          <p className='text-sm text-gray-500 mt-1'>
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <button className='px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors'>
                          Enable
                        </button>
                      </div>
                    </div>

                    <div className='p-6 bg-gray-50 rounded-lg border border-gray-200'>
                      <div className='flex justify-between items-start'>
                        <div>
                          <h3 className='font-medium text-gray-800'>Login History</h3>
                          <p className='text-sm text-gray-500 mt-1'>Last login: {user.lastLogin}</p>
                        </div>
                        <button className='px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors'>
                          View All
                        </button>
                      </div>
                    </div>

                    <div className='p-6 bg-gray-50 rounded-lg border border-gray-200'>
                      <div className='flex justify-between items-start'>
                        <div>
                          <h3 className='font-medium text-gray-800'>Active Sessions</h3>
                          <p className='text-sm text-gray-500 mt-1'>
                            1 active session (this device)
                          </p>
                        </div>
                        <button className='px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors'>
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

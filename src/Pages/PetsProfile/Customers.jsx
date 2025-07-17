import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FaPlus, FaTrash, FaUpload, FaTimes, FaRegEdit, FaEye } from 'react-icons/fa';
import SidebarField from '../../Components/SideBarField';
import Button from '../../Components/Button';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import InputField from '../../Components/InputField';
import { CustomerApi } from '../../Api/customer.api';
import { toast } from 'react-toastify';
import { MasterApi } from '../../Api/Master.api';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { toFormData } from '../formHandling';
import DeleteModal from '../../Components/DeleteModal';
import { useLoading } from '../../Components/loader/LoaderContext';
import { Table2 } from '../../Components/Table/Table2';
import { columns, dummyCustomerList } from './customerData';
import { FiCalendar, FiClock, FiMapPin } from 'react-icons/fi';
import Modal from '../../Components/Modal';

const Customers = () => {
  const [open, setOpen] = useState(false);
  const [countryData, setCountryData] = useState([]);
  const [userSubscriptions, setUserSubscriptions] = useState([]);
  const [userClasses, setUserClasses] = useState([]);
  const [userPackages, setUserPackages] = useState([]);
  const [countryId, setCountryId] = useState([]);
  const [activeTab, setActiveTab] = useState('Subscription');
  const [cityData, setCityData] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRefs = useRef([]);
  const [locationOptions, setLocationOptions] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);
  const [filters, setFilters] = useState({
    country: '',
    city: '',
    gender: '',
    isActive: '',
  });
   const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const { handleLoading } = useLoading();

  // const handleLoading = (state) => setLoading(state);

  const getAllCustomers = async () => {
    handleLoading(true);
    try {
      const cleanedFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== '')
      );
      const res = await CustomerApi.getAllCustomer(cleanedFilters);
      setAllUsers(res.data?.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch customers');
    }
    handleLoading(false);
  };

  const handleCountryChange = async (e) => {
    const selectedCountryId = e.target.value;
    setCountryId(selectedCountryId);
    formik.setFieldValue('country', selectedCountryId);

    if (selectedCountryId) {
      try {
        const res = await MasterApi.city(selectedCountryId);
        setCityData(res.data?.data);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const getSubscriptionByUserId = async (userId) => {
    try {
      handleLoading(true);
      const res = await CustomerApi.getUserSubscription(userId);
      setUserSubscriptions(res?.data?.data);
      const singleClassSubscriptions = userSubscriptions.filter(
        (item) => item.subscription?.isSingleClass === true
      );

      setUserClasses(singleClassSubscriptions);
    } catch (err) {
      console.error(err);
    } finally {
      handleLoading(false);
    }
  };

  const getPackagesByUserId = async (userId) => {
    try {
      handleLoading(true);
      const res = await CustomerApi.getUserPackage(userId);
      setUserPackages(res?.data?.data);
      console.log('customer res:', res);
    } catch (err) {
      console.error(err);
    } finally {
      handleLoading(false);
    }
  };

  useEffect(() => {
    getPackagesByUserId(selectedRow?._id);
  }, [activeTab === 'Packages']);

  console.log('selectedRow:', selectedRow);
  console.log('userSubscriptions:', userSubscriptions);
  console.log('userClasses:', userClasses);

  const formik = useFormik({
    initialValues: {
      first_name: '',
      last_name: '',
      phone_number: '',
      email: '',
      address: '',
    },

    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        const payload = {
          ...(!selectedRow
            ? {
                // first_name: values.first_name,
                // last_name: values.last_name,
                // phone_number: values.phone_number,
                // address: values.address,
                email: values.email,
              }
            : {}),
          first_name: values.first_name,
          last_name: values.last_name,
          phone_number: values.phone_number,
          address: values.address,
        };

        const formData = toFormData(payload);
        handleLoading(true);

        const res = selectedRow
          ? await CustomerApi.updatePet(selectedRow._id, formData)
          : await CustomerApi.createPet(formData);

        toast.success(res?.data?.message || 'Operation successful');
        getAllPets();
        setOpen(false);
        setSelectedRow(null);
        formik.resetForm();
      } catch (err) {
        console.error('Error:', err);
        toast.error(err.response?.data?.message || 'Operation failed');
      } finally {
        setIsLoading(false);
        handleLoading(false);
      }
    },
  });

  useEffect(() => {
    if (selectedRow) {
      formik.setValues({
        first_name: selectedRow?.first_name || '',
        last_name: selectedRow?.last_name || '',
        phone_number: selectedRow?.phone_number || 'not available',
        email: selectedRow?.email || '',
        address: selectedRow?.address || '',
        gender: selectedRow?.gender || '',
        city: selectedRow?.city || '',
        country: selectedRow?.country || '',
        birthday: selectedRow?.birthday || '',
      });
    }
  }, [selectedRow]);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      handleLoading(true);
      await CustomerApi.deletePet(deleteModal._id);
      toast.success('Pet deleted successfully');
      getAllPets();
      setDeleteModal(null);
    } catch (err) {
      console.error('Error deleting:', err);
      toast.error(err.response?.data?.message || 'Failed to delete pet');
    } finally {
      setIsLoading(false);
      handleLoading(false);
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

  const getCityName = async (countryId) => {
    try {
      const res = await MasterApi.city(countryId);
      setCityData(res.data?.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getCityName(selectedRow?.city);
    getSubscriptionByUserId(selectedRow?._id);
  }, [selectedRow]);

  const countryOptions = countryData?.map((item) => {
    return {
      value: item?._id,
      label: `${item?.name}`,
    };
  });

  const cityOptions = cityData?.map((item) => ({
    value: item?._id,
    label: item?.name,
  }));

  const handleModalClose = () => {
    setOpen(false);
    setSelectedRow(null);
    formik.resetForm();
  };

  const formatTime12Hour = (timeStr) => {
    const [hourStr, minute] = timeStr.split(':');
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12; // Convert '0' to '12'
    return `${hour}:${minute} ${ampm}`;
  };

  const tabs = ['Subscription', 'Classes', 'Packages'];

  const customerColumns = useMemo(
    () => [
      {
        headerName: 'Name',
        field: 'name',
        cellRenderer: (params) => {
          const first = params?.data?.first_name || '';
          const last = params?.data?.last_name || '';
          return `${first} ${last}`.trim() || 'N/A';
        },
      },
      {
        headerName: 'email',
        field: 'Email',
        cellRenderer: (params) => params?.data?.email ?? 'N/A',
      },
      {
        headerName: 'Age',
        field: 'age',
        cellRenderer: (params) => params?.data?.age ?? 'N/A',
      },
      {
        headerName: 'Gender',
        field: 'gender',
        cellRenderer: (params) => params?.data?.gender || 'N/A',
      },

      {
        headerName: 'Location',
        field: 'location',
        cellRenderer: (params) => {
          const street = params?.data?.address || '';
          const city = params?.data?.city?.name || '';
          const country = params?.data?.country?.name || '';
          return `${street}${city ? ', ' + city : ''}${country ? ', ' + country : ''}` || 'N/A';
        },
      },
      {
        headerName: 'Address',
        field: 'address',
        cellRenderer: (params) => params?.data?.address || 'N/A',
      },
      {
        headerName: 'Contact No',
        field: 'phone_number',
        cellRenderer: (params) => params?.data?.phone_number || 'N/A',
      },
      {
        headerName: 'Birthday',
        field: 'birthday',
        cellRenderer: (params) => {
          const date = params?.data?.birthday;
          return date ? new Date(date).toLocaleDateString() : 'N/A';
        },
      },
      {
        headerName: 'Status',
        field: 'status',
        cellRenderer: (params) => params?.data?.status || 'N/A',
      },

      {
        headerName: 'Actions',
        field: 'actions',
        minWidth: 150,
        cellRenderer: (params) => (
          <div className='flex items-center space-x-3 mt-2'>
            <button
              className='text-primary transition-colors cursor-pointer'
              onClick={() => {
                setOpen(true);
                setSelectedRow(params?.data);
              }}
            >
              <FaEye size={18} />
            </button>
            {/* <button
          className="text-red-600 hover:text-red-800 transition-colors cursor-pointer"
          onClick={() => setDeleteModal(params?.data)}
        >
          <MdOutlineDeleteOutline size={20} />
        </button> */}
          </div>
        ),
      },
    ],
    [setOpen, setSelectedRow, setDeleteModal]
  );

  useEffect(() => {
    getAllCustomers();
    handleCountry();
  }, []);

  return (
    <>
      <div className='p-5'>
        <div>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-4xl font-bold text-primary'>Customers</h2>
          </div>
 {/* Filter Bar */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 p-4 bg-white rounded-xl shadow-sm'>
          
          {/* Category Dropdown */}
          <div className='space-y-1'>
            <label className='block text-sm font-medium text-gray-700'>Category</label>
            <select
              name='categoryId'
              value={filters.categoryId}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9Ii82QjcyODkiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1jaGV2cm9uLWRvd24iPjxwYXRoIGQ9Im02IDkgNiA2IDYtNiIvPjwvc3ZnPg==')] bg-no-repeat bg-[right_0.75rem_center] bg-[length:1.25rem_1.25rem]"
            >
              <option value='' className='text-gray-400'>
                All Categories
              </option>
              {categoryOptions.map((category) => (
                <option
                  key={category._id}
                  value={category._id}
                  className='py-2 hover:bg-blue-50 hover:text-blue-600'
                >
                  {category.cName}
                </option>
              ))}
            </select>
          </div>

          {/* Location Dropdown */}
          <div className='space-y-1'>
            <label className='block text-sm font-medium text-gray-700'>Location</label>
            <select
              name='location'
              value={filters.location}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9Ii82QjcyODkiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1jaGV2cm9uLWRvd24iPjxwYXRoIGQ9Im02IDkgNiA2IDYtNiIvPjwvc3ZnPg==')] bg-no-repeat bg-[right_0.75rem_center] bg-[length:1.25rem_1.25rem]"
            >
              <option value='' className='text-gray-400'>
                All Locations
              </option>
              {locationOptions.map((loc) => (
                <option
                  key={loc._id}
                  value={loc._id}
                  className='py-2 hover:bg-blue-50 hover:text-blue-600'
                >
                  {loc?.streetName}, {loc?.City?.name}
                </option>
              ))}
            </select>
          </div>

          {/* isExpired Dropdown */}
          <div className='space-y-1'>
            <label className='block text-sm font-medium text-gray-700'>Expired</label>
            <select
              name='isExpired'
              value={filters.isExpired}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9Ii82QjcyODkiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1jaGV2cm9uLWRvd24iPjxwYXRoIGQ9Im02IDkgNiA2IDYtNiIvPjwvc3ZnPg==')] bg-no-repeat bg-[right_0.75rem_center] bg-[length:1.25rem_1.25rem]"
            >
              <option value='' className='text-gray-400'>
                All
              </option>
              <option value={true} className='py-2 hover:bg-blue-50 hover:text-blue-600'>
                Expired
              </option>
              <option value={false} className='py-2 hover:bg-blue-50 hover:text-blue-600'>
                Not Expired
              </option>
            </select>
          </div>
        </div>


          <Table2
            column={customerColumns}
            internalRowData={allUsers}
            searchLabel={'Customers'}
            sheetName={'pet'}
            setModalOpen={setOpen}
            isAdd={false}
          />
        </div>

        <Modal isOpen={open} onClose={handleModalClose} title={`Customer Details`}>
          <form onSubmit={formik.handleSubmit} className='space-y-6'>
            <div className='space-y-4'>
              <div className='space-y-4'>
                <div className='flex justify-between items-center'>
                  <h3 className='text-xl font-semibold text-gray-800 pb-2'>Client Information</h3>
                  {selectedRow?.status && (
                    <span
                      className={`
          text-sm font-medium px-3 py-1 rounded-full
          ${
            selectedRow.status === 'Approved'
              ? 'bg-green-100 text-green-700'
              : selectedRow.status === 'Pending'
                ? 'bg-yellow-100 text-yellow-700'
                : selectedRow.status === 'Rejected'
                  ? 'bg-red-100 text-red-700'
                  : selectedRow.status === 'Blocked'
                    ? 'bg-gray-200 text-gray-700'
                    : 'bg-blue-100 text-blue-700'
          }
        `}
                    >
                      {selectedRow.status}
                    </span>
                  )}
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <InputField
                  name='first_name'
                  label='First Name'
                  placeholder='Enter First Name'
                  isRequired
                  value={formik.values.first_name}
                  onChange={formik.handleChange}
                  error={formik.touched.first_name && formik.errors.first_name}
                  disabled={!!selectedRow}
                />
                <InputField
                  name='last_name'
                  label='Last Name'
                  placeholder='Enter Last Name'
                  isRequired
                  value={formik.values.last_name}
                  error={formik.touched.last_name && formik.errors.last_name}
                  onChange={formik.handleChange}
                  disabled={!!selectedRow}
                />
                <InputField
                  name='phone_number'
                  label='Contact Number'
                  placeholder='Enter Phone Number'
                  value={formik.values.phone_number}
                  onChange={formik.handleChange}
                  error={formik.touched.phone_number && formik.errors.phone_number}
                  disabled={!!selectedRow}
                />
                <InputField
                  name='email'
                  label='Email Address'
                  placeholder='Enter Email'
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && formik.errors.email}
                  isRequired
                  disabled={!!selectedRow}
                />
              </div>

              <InputField
                name='address'
                label='Address'
                placeholder='Enter Full Address'
                value={formik.values.address}
                onChange={formik.handleChange}
                error={formik.touched.address && formik.errors.address}
                disabled={!!selectedRow}
              />

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <InputField
                  name='birthday'
                  label='Birthday'
                  type='date'
                  value={formik.values.birthday}
                  onChange={formik.handleChange}
                  error={formik.touched.birthday && formik.errors.birthday}
                />

                <InputField
                  name='gender'
                  label='Gender'
                  type='select'
                  options={[
                    { label: 'Select Gender', value: '' },
                    { label: 'Male', value: 'Male' },
                    { label: 'Female', value: 'Female' },
                    { label: 'Others', value: 'Others' },
                  ]}
                  value={formik.values.gender}
                  onChange={formik.handleChange}
                  error={formik.touched.gender && formik.errors.gender}
                />

                <InputField
                  name='country'
                  label='Country'
                  type='select'
                  options={[{ label: 'Select Country', value: '' }, ...countryOptions]}
                  value={formik.values.country}
                  onChange={formik.handleChange}
                  error={formik.touched.country && formik.errors.country}
                  disabled={true}
                />

                <InputField
                  name='city'
                  label='City'
                  type='select'
                  options={[{ label: 'Select City', value: '' }, ...cityOptions]}
                  value={formik.values.city}
                  onChange={formik.handleChange}
                  error={formik.touched.city && formik.errors.city}
                />

                {/* <InputField
        name="zipcode"
        label="Zipcode"
        placeholder="Enter Zipcode"
        value={formik.values.zipcode}
        onChange={formik.handleChange}
        error={formik.touched.zipcode && formik.errors.zipcode}
      /> */}

                {/* <InputField
        name="status"
        label="Status"
        type="select"
        options={[
          { label: "Pending", value: "Pending" },
          { label: "Approved", value: "Approved" },
          { label: "Unapproved", value: "Unapproved" },
          { label: "Blocked", value: "Blocked" },
          { label: "Rejected", value: "Rejected" },
        ]}
        value={formik.values.status}
        onChange={formik.handleChange}
        error={formik.touched.status && formik.errors.status}
      /> */}
              </div>
            </div>
            <div className='w-full'>
              <h3 className='text-2xl font-bold text-gray-800 pb-4 mb-6 border-b border-gray-200'>
                Customer Bookings
              </h3>
              <div className='flex space-x-6 pb-2 mb-4'>
                {tabs.map((tab) => (
                  <h2
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`cursor-pointer text-2xl font-semibold transition-colors duration-200 ${
                      activeTab === tab
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-gray-500 hover:text-primary'
                    }`}
                  >
                    {tab}
                  </h2>
                ))}
              </div>

              {activeTab === 'Subscription' &&
                (userSubscriptions.length > 0 ? (
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {userSubscriptions.map((booking, index) => {
                      const sub = booking.subscription;
                      const address = sub?.Address;

                      return (
                        <div
                          key={booking._id || index}
                          className='p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white border border-gray-100'
                        >
                          <div className='flex flex-col md:flex-row gap-6'>
                            {sub?.media && (
                              <div className='w-full md:w-1/3 h-48 overflow-hidden rounded-lg'>
                                <img
                                  src={sub.media}
                                  alt='Subscription'
                                  className='w-full h-full object-cover'
                                />
                              </div>
                            )}

                            <div className='flex-1'>
                              <div className='flex justify-between items-start mb-2'>
                                <h2 className='text-xl font-bold text-gray-800'>{sub?.name}</h2>
                                <span className='bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full'>
                                  AED {sub?.price}
                                </span>
                              </div>

                              <div className='space-y-2 text-gray-600'>
                                <p className='flex items-center gap-2'>
                                  <svg
                                    className='w-4 h-4 text-purple-500'
                                    fill='none'
                                    stroke='currentColor'
                                    viewBox='0 0 24 24'
                                  >
                                    <path
                                      strokeLinecap='round'
                                      strokeLinejoin='round'
                                      strokeWidth={2}
                                      d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                                    />
                                  </svg>
                                  <span>
                                    <strong>Trainer:</strong> {sub?.trainer?.first_name}{' '}
                                    {sub?.trainer?.last_name}
                                  </span>
                                </p>

                                <p className='flex items-center gap-2'>
                                  <svg
                                    className='w-4 h-4 text-green-500'
                                    fill='none'
                                    stroke='currentColor'
                                    viewBox='0 0 24 24'
                                  >
                                    <path
                                      strokeLinecap='round'
                                      strokeLinejoin='round'
                                      strokeWidth={2}
                                      d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
                                    />
                                  </svg>
                                  <span>
                                    <strong>Category:</strong> {sub?.categoryId?.cName}
                                  </span>
                                </p>

                                <p className='flex items-center gap-2'>
                                  <svg
                                    className='w-4 h-4 text-yellow-500'
                                    fill='none'
                                    stroke='currentColor'
                                    viewBox='0 0 24 24'
                                  >
                                    <path
                                      strokeLinecap='round'
                                      strokeLinejoin='round'
                                      strokeWidth={2}
                                      d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                                    />
                                  </svg>
                                  <span>
                                    <strong>Session:</strong> {sub?.sessionType?.sessionName}
                                  </span>
                                </p>
                              </div>

                              <div className='mt-4 space-y-2 text-sm'>
                                <div className='flex items-center gap-2 text-gray-600'>
                                  <svg
                                    className='w-4 h-4 text-red-500'
                                    fill='none'
                                    stroke='currentColor'
                                    viewBox='0 0 24 24'
                                  >
                                    <path
                                      strokeLinecap='round'
                                      strokeLinejoin='round'
                                      strokeWidth={2}
                                      d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                                    />
                                  </svg>
                                  <span>
                                    {formatTime12Hour(sub.startTime)} -{' '}
                                    {formatTime12Hour(sub.endTime)}
                                  </span>
                                </div>

                                <div className='flex items-center gap-2 text-gray-600'>
                                  <svg
                                    className='w-4 h-4 text-blue-500'
                                    fill='none'
                                    stroke='currentColor'
                                    viewBox='0 0 24 24'
                                  >
                                    <path
                                      strokeLinecap='round'
                                      strokeLinejoin='round'
                                      strokeWidth={2}
                                      d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                                    />
                                  </svg>
                                  {sub.date?.length === 2 ? (
                                    <span>
                                      {new Date(sub.date[0]).toLocaleDateString()} to{' '}
                                      {new Date(sub.date[1]).toLocaleDateString()}
                                    </span>
                                  ) : sub.date?.length === 1 ? (
                                    <span>{new Date(sub.date[0]).toLocaleDateString()}</span>
                                  ) : null}
                                </div>

                                <div className='flex items-start gap-2 text-gray-600'>
                                  <svg
                                    className='w-4 h-4 text-green-600 mt-0.5'
                                    fill='none'
                                    stroke='currentColor'
                                    viewBox='0 0 24 24'
                                  >
                                    <path
                                      strokeLinecap='round'
                                      strokeLinejoin='round'
                                      strokeWidth={2}
                                      d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                                    />
                                    <path
                                      strokeLinecap='round'
                                      strokeLinejoin='round'
                                      strokeWidth={2}
                                      d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                                    />
                                  </svg>
                                  <span className='flex-1'>
                                    {address?.streetName}, {address?.city?.name},{' '}
                                    {address?.country?.name}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className='text-center py-12 bg-gray-50 rounded-lg'>
                    <svg
                      className='mx-auto h-12 w-12 text-gray-400'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                      />
                    </svg>
                    <h4 className='mt-3 text-lg font-medium text-gray-900'>No subscriptions yet</h4>
                    <p className='mt-1 text-gray-500'>
                      This customer hasn't subscribed to any classes.
                    </p>
                  </div>
                ))}

              {activeTab === 'Classes' &&
                (userClasses.length > 0 ? (
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {userClasses.map((booking, index) => {
                      const sub = booking.subscription;
                      const address = sub?.Address;

                      return (
                        <div
                          key={booking._id || index}
                          className='p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white border border-gray-100'
                        >
                          <div className='flex flex-col md:flex-row gap-6'>
                            {sub?.media && (
                              <div className='w-full md:w-1/3 h-48 overflow-hidden rounded-lg'>
                                <img
                                  src={sub.media}
                                  alt='Subscription'
                                  className='w-full h-full object-cover'
                                />
                              </div>
                            )}

                            <div className='flex-1'>
                              <div className='flex justify-between items-start mb-2'>
                                <h2 className='text-xl font-bold text-gray-800'>{sub?.name}</h2>
                                <span className='bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full'>
                                  AED {sub?.price}
                                </span>
                              </div>

                              <div className='space-y-2 text-gray-600'>
                                <p className='flex items-center gap-2'>
                                  <svg
                                    className='w-4 h-4 text-purple-500'
                                    fill='none'
                                    stroke='currentColor'
                                    viewBox='0 0 24 24'
                                  >
                                    <path
                                      strokeLinecap='round'
                                      strokeLinejoin='round'
                                      strokeWidth={2}
                                      d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                                    />
                                  </svg>
                                  <span>
                                    <strong>Trainer:</strong> {sub?.trainer?.first_name}{' '}
                                    {sub?.trainer?.last_name}
                                  </span>
                                </p>

                                <p className='flex items-center gap-2'>
                                  <svg
                                    className='w-4 h-4 text-green-500'
                                    fill='none'
                                    stroke='currentColor'
                                    viewBox='0 0 24 24'
                                  >
                                    <path
                                      strokeLinecap='round'
                                      strokeLinejoin='round'
                                      strokeWidth={2}
                                      d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
                                    />
                                  </svg>
                                  <span>
                                    <strong>Category:</strong> {sub?.categoryId?.cName}
                                  </span>
                                </p>

                                <p className='flex items-center gap-2'>
                                  <svg
                                    className='w-4 h-4 text-yellow-500'
                                    fill='none'
                                    stroke='currentColor'
                                    viewBox='0 0 24 24'
                                  >
                                    <path
                                      strokeLinecap='round'
                                      strokeLinejoin='round'
                                      strokeWidth={2}
                                      d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                                    />
                                  </svg>
                                  <span>
                                    <strong>Session:</strong> {sub?.sessionType?.sessionName}
                                  </span>
                                </p>
                              </div>

                              <div className='mt-4 space-y-2 text-sm'>
                                <div className='flex items-center gap-2 text-gray-600'>
                                  <svg
                                    className='w-4 h-4 text-red-500'
                                    fill='none'
                                    stroke='currentColor'
                                    viewBox='0 0 24 24'
                                  >
                                    <path
                                      strokeLinecap='round'
                                      strokeLinejoin='round'
                                      strokeWidth={2}
                                      d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                                    />
                                  </svg>
                                  <span>
                                    {formatTime12Hour(sub.startTime)} -{' '}
                                    {formatTime12Hour(sub.endTime)}
                                  </span>
                                </div>

                                <div className='flex items-center gap-2 text-gray-600'>
                                  <svg
                                    className='w-4 h-4 text-blue-500'
                                    fill='none'
                                    stroke='currentColor'
                                    viewBox='0 0 24 24'
                                  >
                                    <path
                                      strokeLinecap='round'
                                      strokeLinejoin='round'
                                      strokeWidth={2}
                                      d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                                    />
                                  </svg>
                                  {sub.date?.length === 2 ? (
                                    <span>
                                      {new Date(sub.date[0]).toLocaleDateString()} to{' '}
                                      {new Date(sub.date[1]).toLocaleDateString()}
                                    </span>
                                  ) : sub.date?.length === 1 ? (
                                    <span>{new Date(sub.date[0]).toLocaleDateString()}</span>
                                  ) : null}
                                </div>

                                <div className='flex items-start gap-2 text-gray-600'>
                                  <svg
                                    className='w-4 h-4 text-green-600 mt-0.5'
                                    fill='none'
                                    stroke='currentColor'
                                    viewBox='0 0 24 24'
                                  >
                                    <path
                                      strokeLinecap='round'
                                      strokeLinejoin='round'
                                      strokeWidth={2}
                                      d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                                    />
                                    <path
                                      strokeLinecap='round'
                                      strokeLinejoin='round'
                                      strokeWidth={2}
                                      d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                                    />
                                  </svg>
                                  <span className='flex-1'>
                                    {address?.streetName}, {address?.city?.name},{' '}
                                    {address?.country?.name}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className='text-center py-12 bg-gray-50 rounded-lg'>
                    <svg
                      className='mx-auto h-12 w-12 text-gray-400'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                      />
                    </svg>
                    <h4 className='mt-3 text-lg font-medium text-gray-900'>No classes yet</h4>
                    <p className='mt-1 text-gray-500'>
                      This customer hasn't subscribed to any classes.
                    </p>
                  </div>
                ))}

              {activeTab === 'Packages' &&
                (userPackages.length > 0 ? (
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {userPackages.map((booking, index) => {
                      const pkg = booking.package;
                      const joinedClasses = booking.joinClasses?.filter((j) => j.classId);

                      return (
                        <div
                          key={booking._id || index}
                          className='p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white border border-gray-100'
                        >
                          <div className='flex flex-col md:flex-row gap-6'>
                            {pkg?.image && (
                              <div className='w-full md:w-1/3 h-48 overflow-hidden rounded-lg'>
                                <img
                                  src={pkg.image}
                                  alt='Package'
                                  className='w-full h-full object-cover'
                                />
                              </div>
                            )}

                            <div className='flex-1'>
                              <div className='flex justify-between items-start mb-2'>
                                <h2 className='text-xl font-bold text-gray-800'>{pkg?.name}</h2>
                                <span className='bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full'>
                                  AED {pkg?.price}
                                </span>
                              </div>

                              {joinedClasses?.length > 0 && (
                                <div className='mt-2 space-y-1 text-gray-700'>
                                  <h3 className='text-sm font-semibold text-gray-800'>
                                    Joined Classes:
                                  </h3>
                                  <ul className='list-disc pl-5 text-sm'>
                                    {joinedClasses.map((j, i) => (
                                      <li key={i}>{j.classId?.name}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              <div className='mt-4 text-sm text-gray-700'>
                                <p>
                                  <strong>Used:</strong> {booking.joinClasses.length} /{' '}
                                  {pkg.numberOfClasses}
                                </p>
                                <p>
                                  <strong>Activated:</strong> {booking.activate ? 'Yes' : 'No'}
                                </p>
                                <p>
                                  <strong>Expired:</strong> {booking.expired ? 'Yes' : 'No'}{' '}
                                  {booking.expiredAt
                                    ? `(on ${new Date(booking.expiredAt).toLocaleDateString()})`
                                    : ''}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className='text-center py-12 bg-gray-50 rounded-lg'>
                    <svg
                      className='mx-auto h-12 w-12 text-gray-400'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                      />
                    </svg>
                    <h4 className='mt-3 text-lg font-medium text-gray-900'>No Packages yet</h4>
                    <p className='mt-1 text-gray-500'>
                      This customer hasn't subscribed to any Packages.
                    </p>
                  </div>
                ))}
            </div>
          </form>
        </Modal>

        {/* {open && (
          <SidebarField
            title={selectedRow ? 'Customer Details' : 'Add New Customer'}
            handleClose={handleModalClose}
            button2={
              <Button
                variant='outline'
                onClick={handleModalClose}
                text='Close'
                disabled={isLoading}
              />
            }
          >
            <form onSubmit={formik.handleSubmit} className='space-y-6'>
              <div className='space-y-4'>
                <div className='space-y-4'>
                  <div className='flex justify-between items-center'>
                    <h3 className='text-xl font-semibold text-gray-800 pb-2'>Client Information</h3>
                    {selectedRow?.status && (
                      <span
                        className={`
          text-sm font-medium px-3 py-1 rounded-full
          ${
            selectedRow.status === 'Approved'
              ? 'bg-green-100 text-green-700'
              : selectedRow.status === 'Pending'
                ? 'bg-yellow-100 text-yellow-700'
                : selectedRow.status === 'Rejected'
                  ? 'bg-red-100 text-red-700'
                  : selectedRow.status === 'Blocked'
                    ? 'bg-gray-200 text-gray-700'
                    : 'bg-blue-100 text-blue-700'
          }
        `}
                      >
                        {selectedRow.status}
                      </span>
                    )}
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <InputField
                    name='first_name'
                    label='First Name'
                    placeholder='Enter First Name'
                    isRequired
                    value={formik.values.first_name}
                    onChange={formik.handleChange}
                    error={formik.touched.first_name && formik.errors.first_name}
                    disabled={!!selectedRow}
                  />
                  <InputField
                    name='last_name'
                    label='Last Name'
                    placeholder='Enter Last Name'
                    isRequired
                    value={formik.values.last_name}
                    error={formik.touched.last_name && formik.errors.last_name}
                    onChange={formik.handleChange}
                    disabled={!!selectedRow}
                  />
                  <InputField
                    name='phone_number'
                    label='Contact Number'
                    placeholder='Enter Phone Number'
                    value={formik.values.phone_number}
                    onChange={formik.handleChange}
                    error={formik.touched.phone_number && formik.errors.phone_number}
                    disabled={!!selectedRow}
                  />
                  <InputField
                    name='email'
                    label='Email Address'
                    placeholder='Enter Email'
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && formik.errors.email}
                    isRequired
                    disabled={!!selectedRow}
                  />
                </div>

                <InputField
                  name='address'
                  label='Address'
                  placeholder='Enter Full Address'
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  error={formik.touched.address && formik.errors.address}
                  disabled={!!selectedRow}
                />

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <InputField
                    name='birthday'
                    label='Birthday'
                    type='date'
                    value={formik.values.birthday}
                    onChange={formik.handleChange}
                    error={formik.touched.birthday && formik.errors.birthday}
                  />

                  <InputField
                    name='gender'
                    label='Gender'
                    type='select'
                    options={[
                      { label: 'Select Gender', value: '' },
                      { label: 'Male', value: 'Male' },
                      { label: 'Female', value: 'Female' },
                      { label: 'Others', value: 'Others' },
                    ]}
                    value={formik.values.gender}
                    onChange={formik.handleChange}
                    error={formik.touched.gender && formik.errors.gender}
                  />

                  <InputField
                    name='country'
                    label='Country'
                    type='select'
                    options={[{ label: 'Select Country', value: '' }, ...countryOptions]}
                    value={formik.values.country}
                    onChange={formik.handleChange}
                    error={formik.touched.country && formik.errors.country}
                    disabled={true}
                  />

                  <InputField
                    name='city'
                    label='City'
                    type='select'
                    options={[{ label: 'Select City', value: '' }, ...cityOptions]}
                    value={formik.values.city}
                    onChange={formik.handleChange}
                    error={formik.touched.city && formik.errors.city}
                  />

                </div>
              </div>
              <div className='w-[100%]'>
                <h3 className='text-xl font-semibold text-gray-800 pb-2 border-t border-gray-300 pt-3'>Customer Subscriptions</h3>
                {userSubscriptions.length > 0 ? (
  userSubscriptions.map((booking, index) => {
    const sub = booking.subscription;
    const address = sub?.Address;

    return (
      <div
        key={booking._id || index}
        className='p-4 w-full shadow-md rounded-lg mb-6 bg-white'
      >
        <div className='flex gap-4'>
          <div className='w-50'>
            {sub?.media && (
              <img
                src={sub.media}
                alt='Subscription'
                className='w-full max-h-64 object-cover rounded-md'
              />
            )}
          </div>
          <div>
            <h2 className='text-xl font-bold text-gray-800 mb-2'>{sub?.name}</h2>
            <p>
              <strong>Trainer:</strong> {sub?.trainer?.first_name} {sub?.trainer?.last_name}
            </p>
            <p>
              <strong>Category:</strong> {sub?.categoryId?.cName}
            </p>
            <p>
              <strong>Session:</strong> {sub?.sessionType?.sessionName}
            </p>
            <p>
              <strong>Price:</strong> AED {sub?.price}
            </p>
          </div>
        </div>

        <div className='flex mt-2 gap-8'>
          <div className='flex items-center gap-1 text-sm text-gray-600'>
            <FiClock className='text-yellow-500' />
            <span>
              {formatTime12Hour(sub.startTime)} - {formatTime12Hour(sub.endTime)}
            </span>
          </div>

          <div className='flex items-center gap-1 text-sm text-gray-600'>
            <FiCalendar />
            {sub.date?.length === 2 ? (
              <span>
                {new Date(sub.date[0]).toLocaleDateString()} to{' '}
                {new Date(sub.date[1]).toLocaleDateString()}
              </span>
            ) : (
              sub.date?.length === 1 && (
                <span>{new Date(sub.date[0]).toLocaleDateString()}</span>
              )
            )}
          </div>
        </div>

        <div className='flex items-center gap-1 text-sm text-gray-600 line-clamp-1'>
          <FiMapPin className='text-red-500' />
          <span>
            {address?.streetName}, {address?.city?.name}, {address?.country?.name}
          </span>
        </div>
      </div>
    );
  })
) : (
  <div>
    <h4>User didn't subscribe to any classes or packages.</h4>
  </div>
)}

              </div>
            </form>
          </SidebarField>
        )} */}
      </div>
      <DeleteModal
        deleteModal={deleteModal}
        setDeleteModal={setDeleteModal}
        handleDelete={handleDelete}
        isLoading={isLoading}
      />
    </>
  );
};

export default Customers;

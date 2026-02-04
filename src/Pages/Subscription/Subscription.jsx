import React, { useEffect, useMemo, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import SidebarField from '../../Components/SideBarField';
import Button from '../../Components/Button';
import InputField from '../../Components/InputField';
import { PackageApi, SubscriptionApi } from '../../Api/Subscription.api';
import { toast } from 'react-toastify';
import { CategoryApi } from '../../Api/Category.Api';
import { MasterApi } from '../../Api/Master.api';
import DeleteModal from '../../Components/DeleteModal';
import DatePicker from 'react-datepicker';
import { FiEdit, FiPlus, FiTrash, FiTrash2, FiCalendar, FiClock, FiMapPin } from 'react-icons/fi';
import { TrainerApi } from '../../Api/Trainer.api';
import { useLoading } from '../../Components/loader/LoaderContext';
import WeeklyCalendar from './WeeklyCalendar';
import Modal from '../../Components/Modal';
import PackageComp from './PackageComp';
import ClassCalendar from './ClassCalendar';
import { Table2 } from '../../Components/Table/Table2';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import SubscriptionTable from './SubscriptionTable';

const Subscription = () => {
  const { handleLoading } = useLoading();
  const [open, setOpen] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [activeTab, setActiveTab] = useState('subscription');
  const [isExpire, setIsExpire] = useState(false);
  const [allSubscription, setAllSubscription] = useState([]);
  const [allClasses, setAllClasses] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [allTrainer, setAllTrainer] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [useMap, setUseMap] = useState(false);
  const [allSessions, setAllSessions] = useState([]);
  const [deleteModal, setDeleteModal] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [tenureOptions, setTenureOptions] = useState([]);
  const [filters, setFilters] = useState({
    trainerId: '',
    categoryId: '',
    location: '',
    isExpired: '',
  });

  const handleClearFilters = () => {
    setFilters({
      trainerId: '',
      categoryId: '',
      location: '',
      subscriptionId: '',
      country: '',
      city: '',
    });

    // Optional: Refetch data with empty filters
    fetchData({ expired, isSingleClass: false });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ [name]: value }));
  };

  const Columns = useMemo(
    () => [
      {
        headerName: 'Name',
        field: 'name',
        cellRenderer: (params) => params?.data?.name || 'N/A',
      },
      {
        headerName: 'Trainer',
        field: 'trainer',
        cellRenderer: (params) => {
          const trainer = params?.data?.trainer;
          return trainer ? `${trainer.first_name || ''} ${trainer.last_name || ''}`.trim() : 'N/A';
        },
      },
      {
        headerName: 'Date',
        field: 'date',
        cellRenderer: (params) => {
          const dates = params?.data?.date;
          if (!dates?.length) return 'N/A';
          if (dates.length === 2) {
            return `${new Date(dates[0]).toLocaleDateString()} - ${new Date(
              dates[1]
            ).toLocaleDateString()}`;
          }
          return new Date(dates[0]).toLocaleDateString();
        },
      },
      {
        headerName: 'Time',
        field: 'startTime',
        cellRenderer: (params) => {
          const start = params?.data?.startTime;
          const end = params?.data?.endTime;
          if (!start || !end) return 'N/A';
          return `${formatTime12Hour(start)} - ${formatTime12Hour(end)}`;
        },
      },
      {
        headerName: 'Location',
        field: 'Address',
        cellRenderer: (params) => {
          const a = params?.data?.Address;
          const street = a?.streetName || '';
          const city = a?.city?.name || '';
          const country = a?.country?.name || '';
          return `${street}${city ? ', ' + city : ''}${country ? ', ' + country : ''}` || 'N/A';
        },
      },
      {
        headerName: 'Price (AED)',
        field: 'price',
        cellRenderer: (params) => `AED ${params?.data?.price ?? 'N/A'}`,
      },
      {
        headerName: 'Status',
        field: 'status',
        cellRenderer: (params) => params?.data?.status || 'Active',
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
                setOpen('subscription');
                setSelectedRow(params?.data);
              }}
            >
              <FiEdit size={18} />
            </button>
            <button
              className='text-red-600 hover:text-red-800 transition-colors cursor-pointer'
              onClick={() => setDeleteModal(params?.data)}
            >
              <MdOutlineDeleteOutline size={20} />
            </button>
          </div>
        ),
      },
    ],
    [setOpen, setSelectedRow, setDeleteModal]
  );

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

  const subscriptionValidationSchema = Yup.object().shape({
    media: Yup.mixed().required('Image is required'),

    name: Yup.string().required('Name is required'),

    categoryId: Yup.string().required('Category is required'),

    sessionType: Yup.string().required('Session Type is required'),

    trainer: Yup.string().required('Trainer is required'),

    Address: Yup.string().required('Location is required'),

    date: Yup.array()
      .of(Yup.date().nullable())
      .test(
        'valid-date-range',
        'Date must be a single date or a valid range of two dates',
        (value) =>
          Array.isArray(value) &&
          (value.length === 1 || value.length === 2) &&
          value[0] !== null &&
          (value.length === 1 || value[1] !== null)
      )
      .required('Date is required'),

    startTime: Yup.string().required('Start Time is required'),

    endTime: Yup.string()
      .required('End Time is required')
      .test('is-after-start', 'End Time must be after Start Time', function (endTime) {
        const { startTime } = this.parent;
        if (!startTime || !endTime) return true;
        return startTime < endTime;
      }),

    price: Yup.number().typeError('Price must be a number').required('Price is required'),

    description: Yup.string(),
  });

  const allSubscriptions = async (expired) => {
    try {
      handleLoading(true);
      const res = await SubscriptionApi.getAllSubscription(expired || false);
      const allData = res?.data?.data || [];

      setAllSubscription(allData);

      console.log('all subscriptions:', res?.data?.data);
    } catch (err) {
      toast.error('Error fetching subscriptions');
      console.error(err);
    } finally {
      handleLoading(false);
    }
  };

  // const getAllClass = async (expired) => {
  //   try {
  //     handleLoading(true);

  //     const payload = {
  //       expired: expired || false,
  //     };

  //     if (activeTab === "classes") {
  //       payload.isSingleClass = true;
  //     }

  //     const res = await SubscriptionApi.getAllSubscriptionFilter(payload);
  //     const allData = res?.data?.data?.subscriptions || [];
  //     console.log("allData:",allData)
  //     setAllSubscription(allData);

  //     console.log('all subscriptions:', allData);
  //   } catch (err) {
  //     toast.error('Error fetching subscriptions');
  //     console.error(err);
  //   } finally {
  //     handleLoading(false);
  //   }
  // };
  const fetchSubscriptions = async (expired = false) => {
    try {
      handleLoading(true);
      let allData = [];

      if (activeTab === 'classes') {
        const payload = {
          expired,
          isSingleClass: true,
        };
        const res = await SubscriptionApi.getAllSubscriptionFilter(payload);
        allData = res?.data?.data?.subscriptions || [];
      } else {
        const payload = {
          expired,
          isSingleClass: false,
          ...filters,
        };
        const res = await SubscriptionApi.getAllSubscriptionFilter(payload);
        allData = res?.data?.data?.subscriptions || [];
        console.log('all subscriptions:', allData);
      }

      setAllSubscription(allData);
    } catch (err) {
      toast.error('Error fetching subscriptions');
      console.error(err);
    } finally {
      handleLoading(false);
    }
  };

  const handleEventClick = (eventData) => {
    // Prefill formik values
    formik.setValues({
      ...formik.initialValues,
      ...eventData,
      trainer: eventData.trainer?._id || '',
      categoryId: eventData.categoryId?._id || '',
      sessionType: eventData.sessionType?._id || '',
      Address: eventData.Address?._id || '',
      date: eventData.date,
    });

    // Open modal
    setOpen('class');
  };

  // useEffect(() => {
  //   getAllClass(false);
  // }, [activeTab === "classes"]);

  console.log('all single classes:', allClasses);
  const getAllLocations = async (isExpire) => {
    try {
      handleLoading(true);
      const res = await MasterApi.getAllLocation(isExpire);
      setLocationData(res?.data?.data?.allLocationMasters || []);
      //   console.log(res?.data?.data?.allLocationMasters);
    } catch (err) {
      console.error('Error fetching locations:', err);
      toast.error('Failed to fetch locations');
    } finally {
      handleLoading(false);
    }
  };

  const getAllTrainer = async () => {
    handleLoading(true);
    try {
      const res = await TrainerApi.getAllTrainers();
      console.log('trainers:', res?.data?.data);
      setAllTrainer(res?.data?.data);
    } catch (err) {
      toast.error(err);
    } finally {
      handleLoading(false);
    }
  };

  const formatTime12Hour = (timeStr) => {
    const [hourStr, minute] = timeStr.split(':');
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? 'pm' : 'am';
    hour = hour % 12 || 12; // Convert '0' to '12'
    return `${hour}:${minute} ${ampm}`;
  };

  const handleDelete = async () => {
    try {
      const res = await SubscriptionApi.DeleteSubscription(deleteModal || deleteModal?._id);
      toast.success('Subscription deleted successfully');
      setDeleteModal(null);
      fetchSubscriptions();
    } catch (err) {
      toast.error('error:', err);
    }
  };

  const getSessionByCatagoryId = async (catagoryId) => {
    try {
      const res = await MasterApi.getSessionByCatagoryId(catagoryId);
      setAllSessions(res?.data?.data);
      console.log('all sessions:', res?.data?.data);
    } catch (err) {
      // toast.error('error:', err);
      setAllSessions();
    }
  };

  const getAllTenures = async () => {
    try {
      const res = await MasterApi.getAllTenure();
      setTenureOptions(res?.data?.data);
      console.log('All Tenures:', res?.data?.data);
    } catch (err) {
      toast.error('error:', err);
    }
  };

  const getAllCategories = async () => {
    try {
      const categories = await CategoryApi.getAllCategory();
      console.log('categories:', categories?.data?.data);
      setCategoryOptions(categories?.data?.data);
    } catch (err) {
      console.error(err);
    }
  };
  const weekdays = [
    { label: 'Mon', value: 'Mon' },
    { label: 'Tue', value: 'Tue' },
    { label: 'Wed', value: 'Wed' },
    { label: 'Thu', value: 'Thu' },
    { label: 'Fri', value: 'Fri' },
    { label: 'Sat', value: 'Sat' },
    { label: 'Sun', value: 'Sun' },
  ];
  console.log('selectedRow:', selectedRow);
  const formik = useFormik({
    initialValues: {
      name: selectedRow?.name || '',
      Address: selectedRow?.Address || '',
      categoryId: selectedRow?.categoryId?._id || '',
      media: selectedRow?.media || '',
      sessionType: selectedRow?.sessionType?._id || '',
      trainer: selectedRow?.trainer?._id || '',
      date: selectedRow?.date || [null, null],
      startTime: selectedRow?.startTime || '',
      endTime: selectedRow?.endTime || '',
      price: selectedRow?.price || '',
      description: selectedRow?.description || '',
      isSingleClass: selectedRow?.isSingleClass ?? activeTab === 'classes',
    },
    validationSchema: subscriptionValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();

      formData.append('name', values.name);
      formData.append('categoryId', values.categoryId);
      formData.append('sessionType', values.sessionType);
      formData.append('price', values.price);
      formData.append('description', values.description);
      formData.append('trainer', values.trainer);
      formData.append('startTime', values.startTime);
      formData.append('endTime', values.endTime);
      formData.append('Address', values.Address);
      formData.append('isSingleClass', String(values.isSingleClass));

      if (values.date) {
        formData.append('date', JSON.stringify(values.date));
      }

      if (values.features && values.features.length > 0) {
        formData.append('features', JSON.stringify(values.features));
      }
  
      if (values.media) {
        formData.append('media', values.media);
      }

      try {
        handleLoading(true);
        let res;
        if (selectedRow) {
          res = await SubscriptionApi.updateSubscription(selectedRow._id, formData);
          toast.success('Subscription updated successfully');
        } else {
          res = await SubscriptionApi.createSubscription(formData);
          toast.success('Subscription created successfully');
        }

        resetForm();
        fetchSubscriptions();
        setOpen(null);
        setSelectedRow(null);
      } catch (error) {
        console.error('Submission error:', error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } finally {
        handleLoading(false);
        selectedRow(null);
      }
    },
  });

  const handleCountry = async () => {
    try {
      const res = await MasterApi.country();
      setCountryData(res?.data?.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCountryChange = async (e) => {
    const selectedCountryId = e.target.value;
    // setCountryId(selectedCountryId);
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

  const toLocalISO = (d) => {
  if (!d) return null;
  // Create a new Date object with the same year, month, and day in the local timezone
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so +1
  const day = String(d.getDate()).padStart(2, '0');
  // Return ISO string in the format YYYY-MM-DD
  return `${year}-${month}-${day}`;
};

  const currentDate = new Date().toISOString().split('T')[0];
  const handleDateClick = (date) => {
    if (activeTab === 'subscriptions') {
      openModal('subscription', null, date);
    } else if (activeTab === 'packages') {
      openModal('package', null, date);
    } else if (activeTab === 'classes') {
      const dateClasses = getClassesForDate(date);
      openModal('class', dateClasses, date);
    }
  };

  const getClassesForDate = (targetDate) => {
    const selectedDate = new Date(targetDate).toDateString();

    return allClasses.filter((cls) => {
      const classDate = new Date(cls.date[0]).toDateString();
      return classDate === selectedDate;
    });
  };

  const tabs = [
    { key: 'subscription', label: 'Programs' },
    { key: 'classes', label: 'Classes' },
    { key: 'packages', label: 'Membership' },
  ];

  const tabOption = {};

  const getSubscriptionsForDate = (date) => {
    return allSubscription.filter((sub) => date >= sub.startDate && date <= sub.endDate);
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [activeTab, filters]);

  useEffect(() => {
    fetchSubscriptions();
    getAllLocations();
    getAllCategories();
    handleCountry();
    getAllTrainer();
    getAllTenures();
  }, []);

  return (
    <div className='p-10'>
      <div className='flex justify-between mb-4'>
        <div className='flex space-x-6 pb-2 mb-4'>
          {tabs.map((tab) => (
            <h2
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`cursor-pointer text-2xl font-semibold transition-colors duration-200 ${
                activeTab === tab.key
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-primary'
              }`}
            >
              {tab.label}
            </h2>
          ))}
        </div>
        <div className='flex gap-2'>
          {activeTab === 'subscription' && (
            <Button text='Create Program' onClick={() => setOpen('subscription')} />
          )}
          {activeTab === 'classes' && (
            <Button text='Create Class' onClick={() => setOpen('class')} />
          )}
          {/* {activeTab === 'packages' && (
            <Button text='Create package' onClick={() => setOpen('package')} />
          )} */}
        </div>
      </div>

      {/* Subscription Cards Section */}

      {/* Weekly Calendar */}
      {activeTab === 'classes' && (
        <div className='bg-white rounded-lg shadow-lg'>
          <div className='p-6'>
            <ClassCalendar
              allClasses={allSubscription}
              onEventClick={handleEventClick}
              setSelectedRow={setSelectedRow}
            />
          </div>
        </div>
      )}

      {activeTab === 'subscription' && (
        <div>
          <SubscriptionTable
            allSubscription={allSubscription}
            filters={filters}
            setFilters={setFilters}
            handleClearFilters={handleClearFilters}
            setDeleteModal={setDeleteModal}
            handleChange={handleFilterChange}
            setSelectedRow={setSelectedRow}
            setOpen={setOpen}
          />
        </div>
      )}

      {open === 'subscription' && (
        <SidebarField
          title={selectedRow ? 'Edit Subscription' : 'Create Subscription'}
          handleClose={() => {
            setOpen(null);
            setSelectedRow(null);
            formik.resetForm();
          }}
          button1={
            <Button
              onClick={formik.handleSubmit}
              text={selectedRow ? 'Update' : 'Save'}
              type='submit'
              disabled={!formik.isValid || formik.isSubmitting}
            />
          }
          button2={
            <Button
              variant='outline'
              onClick={() => {
                setOpen(null);
                setSelectedRow(null);
                formik.resetForm();
              }}
              text='Cancel'
            />
          }
        >
          <form onSubmit={formik.handleSubmit} className='space-y-4'>
            {/* Image Upload */}
            <InputField
              name='media'
              label='Image'
              type='file'
              accept='image/*'
              isRequired
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  formik.setFieldValue('media', file);
                }
              }}
              onBlur={formik.handleBlur}
              error={formik.touched.media && formik.errors.media}
            />

            {/* Image Preview */}
            {formik.values.media && typeof formik.values.media === 'object' && (
              <img
                src={URL.createObjectURL(formik.values.media)}
                alt='Preview'
                className='w-32 h-32 object-cover rounded-md mt-2 border'
              />
            )}

            {/* Name */}
            <InputField
              name='name'
              label='Name'
              placeholder='Enter subscription name'
              isRequired
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && formik.errors.name}
            />

            {/* Category */}
            <InputField
              name='categoryId'
              label='Category'
              type='select'
              options={categoryOptions.map((cat) => ({
                label: `${cat.cName}`,
                value: cat._id,
              }))}
              value={formik.values.categoryId}
              onChange={(e) => {
                const selectedCategoryId = e.target.value;
                formik.setFieldValue('categoryId', selectedCategoryId);
                getSessionByCatagoryId(selectedCategoryId);
              }}
              onBlur={formik.handleBlur}
              error={formik.touched.categoryId && formik.errors.categoryId}
              isRequired
            />

            {/* Session */}
            <InputField
              name='sessionType'
              label='Types'
              type='select'
              options={allSessions?.map((cat) => ({
                label: `${cat.sessionName}`,
                value: cat._id,
              }))}
              value={formik.values.sessionType}
              onChange={(e) => {
                const selectedCategoryId = e.target.value;
                formik.setFieldValue('sessionType', selectedCategoryId);
                // getSessionByCatagoryId(selectedCategoryId);
              }}
              onBlur={formik.handleBlur}
              error={formik.touched.sessionType && formik.errors.sessionType}
              isRequired
            />

            {/* trainer */}
            <InputField
              name='trainer'
              label='Trainers'
              type='select'
              options={allTrainer?.map((cat) => ({
                label: `${cat.first_name} ${cat.last_name}`,
                value: cat._id,
              }))}
              value={formik.values.trainer}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.trainer && formik.errors.trainer}
              isRequired
            />

            {/* Location */}
            <InputField
              name='Address'
              label='Location'
              type='select'
              options={locationData?.map((loc) => ({
                label: `${loc?.streetName}, ${loc?.landmark}, ${loc?.City?.name}, ${loc?.Country?.name}`,
                value: loc?._id,
              }))}
              value={formik.values.Address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.Address && formik.errors.Address}
              isRequired
            />

            {/* Date Range */}
            <div>
              <label className='block text-md font-medium text-gray-700 mb-1'>
                Dates <span className='text-red-500'>*</span>
              </label>
              <DatePicker
                selected={formik.values.date?.[0] || null}
                startDate={formik.values.date?.[0] || null}
                endDate={formik.values.date?.[1] || null}
                onChange={(dates) => {
                  const [start, end] = dates;

                  // If only start is selected, make end same as start
                  if (start && !end) {
                    formik.setFieldValue('date', [start]);
                  } else if (start && end) {
                    formik.setFieldValue('date', [start, end]);
                  } else {
                    formik.setFieldValue('date', []);
                  }
                }}
                selectsRange
                required
                isClearable
                minDate={new Date()}
                placeholderText='Select dates'
                dateFormat='dd/MM/yyyy'
                className='border outline-none border-gray-300 rounded-lg px-3 py-2 w-full bg-white'
              />
            </div>

            {/* Time Fields */}
            <div className='flex justify-between gap-4'>
              <div className='w-full'>
                <InputField
                  name='startTime'
                  label='Start Time'
                  type='time'
                  isRequired
                  value={formik.values.startTime}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.startTime && formik.errors.startTime}
                />
              </div>
              <div className='w-full'>
                <InputField
                  name='endTime'
                  label='End Time'
                  type='time'
                  isRequired
                  value={formik.values.endTime}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.endTime && formik.errors.endTime}
                />
              </div>
            </div>

            {/* Price */}
            <InputField
              name='price'
              label='Price'
              type='number'
              placeholder='Enter price'
              isRequired
              value={formik.values.price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.price && formik.errors.price}
            />

            {/* Description */}
            <InputField
              name='description'
              label='Description'
              placeholder='Enter description'
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.description && formik.errors.description}
            />
          </form>
        </SidebarField>
      )}

      <Modal
        isOpen={open === 'class'}
        onClose={() => {
          setOpen(null);
          formik.resetForm();
          setSelectedRow(null);
        }}
        title={`Manage Classes`}
      >
        <form onSubmit={formik.handleSubmit} className='space-y-4'>
          <InputField
            name='media'
            label='Image'
            type='file'
            accept='image/*'
            isRequired
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                formik.setFieldValue('media', file);
              }
            }}
            onBlur={formik.handleBlur}
            error={formik.touched.media && formik.errors.media}
          />

          <InputField
            name='name'
            label='Name'
            placeholder='Enter name'
            isRequired
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && formik.errors.name}
          />

          <div className='flex gap-4'>
            <div className='w-full'>
              <InputField
                name='price'
                label='Price'
                placeholder='Enter price'
                isRequired
                type='number'
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.price && formik.errors.price}
              />
            </div>

            <div className='w-full'>
              {/* trainer */}
              <InputField
                name='trainer'
                label='Trainers'
                type='select'
                options={allTrainer?.map((cat) => ({
                  label: `${cat.first_name} ${cat.last_name}`,
                  value: cat._id,
                }))}
                value={formik.values.trainer}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.trainer && formik.errors.trainer}
                isRequired
              />
            </div>
          </div>

          <div className='flex gap-4 justify-between'>
            {/* Category */}
            <div className='w-[50%]'>
              <InputField
                name='categoryId'
                label='Category'
                type='select'
                options={categoryOptions.map((cat) => ({
                  label: `${cat.cName}`,
                  value: cat._id,
                }))}
                value={formik.values.categoryId}
                onChange={(e) => {
                  const selectedCategoryId = e.target.value;
                  formik.setFieldValue('categoryId', selectedCategoryId);
                  getSessionByCatagoryId(selectedCategoryId);
                }}
                onBlur={formik.handleBlur}
                error={formik.touched.categoryId && formik.errors.categoryId}
                isRequired
              />
            </div>
            {/* Session */}
            <div className='w-[50%]'>
              <InputField
                name='sessionType'
                label='Types'
                type='select'
                options={allSessions?.map((cat) => ({
                  label: `${cat.sessionName}`,
                  value: cat._id,
                }))}
                value={formik.values.sessionType}
                onChange={(e) => {
                  const selectedCategoryId = e.target.value;
                  formik.setFieldValue('sessionType', selectedCategoryId);
                  // getSessionByCatagoryId(selectedCategoryId);
                }}
                onBlur={formik.handleBlur}
                error={formik.touched.sessionType && formik.errors.sessionType}
                isRequired
              />
            </div>
          </div>

          {/* Time Fields */}
          <div className='flex justify-between gap-4'>
            {/* Single Date */}
            <div className='w-full'>
              <label className='block text-md font-medium text-gray-700 mb-1'>
                Date <span className='text-red-500'>*</span>
              </label>

              <DatePicker
                /* single date value */
                selected={formik.values.date?.[0] ? new Date(formik.values.date[0]) : null}
                /* update Formik */
                onChange={(date) => {
                  formik.setFieldValue('date', date ? [toLocalISO(date)] : []); 
                }}
                required
                isClearable
                minDate={new Date()}
                placeholderText='Select date'
                dateFormat='dd/MM/yyyy'
                className='border outline-none border-gray-300 rounded-lg px-3 py-2 w-full bg-white'
              />
            </div>

            <div className='w-full'>
              <InputField
                name='startTime'
                label='Start Time'
                type='time'
                isRequired
                value={formik.values.startTime}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.startTime && formik.errors.startTime}
              />
            </div>
            <div className='w-full'>
              <InputField
                name='endTime'
                label='End Time'
                type='time'
                isRequired
                value={formik.values.endTime}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.endTime && formik.errors.endTime}
              />
            </div>
          </div>

          {/* Location */}
          <InputField
            name='Address'
            label='Location'
            type='select'
            options={locationData?.map((loc) => ({
              label: `${loc?.streetName}, ${loc?.landmark}, ${loc?.City?.name}, ${loc?.Country?.name}`,
              value: loc?._id,
            }))}
            value={formik.values.Address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.Address && formik.errors.Address}
            isRequired
          />

          <InputField
            name='description'
            label='Description'
            type={'textarea'}
            placeholder='Enter description'
            isRequired
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.description && formik.errors.description}
          />

          {/* You can add coordinates input or other fields here */}

          <div className='flex gap-4 justify-center'>
            {selectedRow && (
              <button
                onClick={() => setDeleteModal(selectedRow)}
                className='px-4 py-2 border border-red-500 text-red-500 rounded-lg'
              >
                Delete
              </button>
            )}
            <button type='submit' className='px-4 py-2 bg-primary text-white rounded-lg'>
              {selectedRow ? 'update' : 'Submit'}
            </button>
          </div>
        </form>
      </Modal>

      <PackageComp setOpen={setOpen} isOpen={open === 'package'} activeTab={activeTab} />

      {deleteModal && (
        <DeleteModal
          deleteModal={deleteModal}
          setDeleteModal={setDeleteModal}
          handleDelete={handleDelete}
          title='Delete Promo Code'
          message={`Are you sure you want to delete the promo code "${deleteModal.code}"? This action cannot be undone.`}
        />
      )}
    </div>
  );
};

export default Subscription;

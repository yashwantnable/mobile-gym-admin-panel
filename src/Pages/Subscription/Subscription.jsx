import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import SidebarField from '../../Components/SideBarField';
import Button from '../../Components/Button';
import InputField from '../../Components/InputField';
import { SubscriptionApi } from '../../Api/Subscription.api';
import { toast } from 'react-toastify';
import { CategoryApi } from '../../Api/Category.Api';
import { MasterApi } from '../../Api/Master.api';
import { FiEdit } from 'react-icons/fi';
import { FiTrash2 } from 'react-icons/fi';
import DeleteModal from '../../Components/DeleteModal';
import DatePicker from 'react-datepicker';
import { MapLocationPicker } from '../../Components/LocationMArker';

const Subscription = () => {
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [allSubscription, setAllSubscription] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [useMap, setUseMap] = useState(false);
  const [allSessions, setAllSessions] = useState([]);
  const [deleteModal, setDeleteModal] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [tenureOptions, setTenureOptions] = useState([]);

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

  const styles = {
    switch: {
      position: 'relative',
      display: 'inline-block',
      width: '46px',
      height: '22px',
    },
    input: {
      opacity: 0,
      width: 0,
      height: 0,
    },
    slider: {
      position: 'absolute',
      cursor: 'pointer',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#ccc',
      transition: '.4s',
      borderRadius: '34px',
    },
    sliderBefore: {
      position: 'absolute',
      content: '""',
      height: '16px',
      width: '16px',
      left: '1px',
      bottom: '4px',
      backgroundColor: 'white',
      transition: '.4s',
      borderRadius: '50%',
    },
  };

  const subscriptionValidationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    categoryId: Yup.string().required('Category is required'),
    sessionType: Yup.string().required('Session Type is required'),
    price: Yup.number().required('Price is required'),
    address: Yup.string().required('Location is required'),
    //   date: Yup.array()
    // .of(Yup.date())
    // .test('valid-date', 'Date must be a single date or a range of two dates', (value) => {
    //   return (
    //     Array.isArray(value) &&
    //     (value.length === 1 || value.length === 2) &&
    //     value[0] !== null &&
    //     (value.length === 1 || value[1] !== null)
    //   );
    // }),

    startTime: Yup.string().required('Start Time is required'),
    endTime: Yup.string().required('End Time is required'),
  });

  const allSubscriptions = async () => {
    try {
      const res = await SubscriptionApi.getAllSubscription();
      setAllSubscription(res?.data?.data);
      console.log('all subscriptions:', res?.data?.data);
    } catch (err) {
      toast.error('error:', err);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await SubscriptionApi.DeleteSubscription(deleteModal?._id);
      toast.success('Subscription deleted successfully');
      setDeleteModal(null);
      allSubscriptions();
    } catch (err) {
      toast.error('error:', err);
    }
  };

  const getAllSession = async () => {
    try {
      const res = await MasterApi.getAllSession();
      setAllSessions(res?.data?.data);
      console.log('all sessions:', res?.data?.data);
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

  const formik = useFormik({
    initialValues: {
      name: selectedRow?.name || '',
      categoryId: selectedRow?.categoryId?._id || '',
      media: selectedRow?.media || '',
      sessionType: selectedRow?.sessionType?._id || '',
      date: selectedRow?.date || [null, null],
      startTime: selectedRow?.startTime || '',
      endTime: selectedRow?.endTime || '',
      price: selectedRow?.price || '',
      description: selectedRow?.description || '',
      streetName: selectedRow?.streetName || '',
      country: selectedRow?.country?._id || "",
      city: selectedRow?.city?._id || "",
    },
    // validationSchema: subscriptionValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();

  //     const addressParts = [
  //   values.streetName,
  //   values.city,
  //   values.country
  // ].filter(Boolean);

  // const fullAddress = addressParts.join(', ');


      formData.append('name', values.name);
      formData.append('categoryId', values.categoryId);
      formData.append('sessionType', values.sessionType);
      formData.append('price', values.price);
      formData.append('description', values.description);
      // formData.append('address', fullAddress);
      formData.append('streetName', values.streetName);
      formData.append('city', values.city);
      formData.append('country', values.country);
      formData.append('startTime', values.startTime);
      formData.append('endTime', values.endTime);

      if (values.date) {
        formData.append('date', JSON.stringify(values.date));
      }

      if (values.media) {
        formData.append('media', values.media);
      }

      try {
        let res;
        if (selectedRow?._id) {
          res = await SubscriptionApi.updateSubscription(selectedRow._id, formData);
          toast.success('Subscription updated successfully');
        } else {
          res = await SubscriptionApi.createSubscription(formData);
          toast.success('Subscription created successfully');
        }

        resetForm();
        allSubscriptions();
        setOpen(false);
        setSelectedRow(null);
      } catch (error) {
        console.error('Submission error:', error);
        toast.error('Failed to save subscription');
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

  // useEffect(() => {
  //   handleCountryChange();
  // }, [selectedRow]);

  useEffect(() => {
    handleCountry();
    // getTrainer();
  }, []);

  useEffect(() => {
    allSubscriptions();
    getAllCategories();
    // getAllSession();
    getAllTenures();
  }, []);

  return (
    <div className='p-10'>
      <div className='flex justify-between mb-4'>
        <h2 className='text-4xl font-bold text-primary'>Subscription</h2>
        <Button text='Create Subscription' onClick={() => setOpen(true)} />
      </div>

      {/* Subscription Cards Section */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 mt-10 mx-auto'>
        {allSubscription.map((sub) => (
          <div
            key={sub._id}
            className='relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-2 flex flex-col justify-between'
          >
            {/* Top-right action buttons */}
            <div className='absolute top-3 right-3 z-10 flex gap-2'>
              <button
                onClick={() => {
                  setSelectedRow(sub);
                  setOpen(true);
                }}
                className='p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition'
              >
                <FiEdit size={16} />
              </button>
              <button
                onClick={() => {
                  setDeleteModal(sub);
                }}
                className='p-2 border border-red-500 text-red-500 rounded-full hover:bg-red-50 transition'
              >
                <FiTrash2 size={16} />
              </button>
            </div>

            {/* Image */}
            {sub.media && (
              <div className='rounded-xl overflow-hidden mb-4 h-44'>
                <img
                  src={sub.media}
                  alt={sub.name}
                  className='w-full h-full object-cover transition-transform duration-300 hover:scale-105'
                />
              </div>
            )}

            {/* Content */}
            <div className='flex flex-col gap-1'>
              <h2 className='text-xl font-bold text-primary capitalize'>{sub.name}</h2>
              <p className='text-sm text-gray-500'>
                {sub.categoryId?.cName} — {sub.categoryId?.cLevel}
              </p>

              {/* Dates */}
              {sub.date?.length === 2 && (
                <p className='text-sm text-gray-600'>
                  📅 {new Date(sub.date[0]).toLocaleDateString()} to{' '}
                  {new Date(sub.date[1]).toLocaleDateString()}
                </p>
              )}
              {sub.date?.length === 1 && (
                <p className='text-sm text-gray-600'>
                  📅 {new Date(sub.date[0]).toLocaleDateString()}
                </p>
              )}

              {/* Time */}
              <p className='text-sm text-gray-600'>
                🕒 {sub.startTime} - {sub.endTime}
              </p>

              {/* Tenure (Optional) */}
              {sub.duration?.name && (
                <p className='text-sm text-gray-600'>🗓️ Tenure: {sub.duration.name}</p>
              )}

              {/* Location and Price */}
              <p className='text-sm text-gray-600'>📍 {sub.address}</p>
              <p className='text-sm text-green-600 font-semibold'>💰 ${sub.price}</p>

              {/* Description */}
              {sub.description && <p className='text-sm text-gray-700 mt-2'>{sub.description}</p>}
            </div>
          </div>
        ))}
      </div>

      {open && (
        <SidebarField
          title={selectedRow ? 'Edit Subscription' : 'Create Subscription'}
          handleClose={() => {
            setOpen(false);
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
                setOpen(false);
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
            <div className='flex justify-between items-center border-t pt-4 border-gray-300'>
              <p>Address</p>
              <button
                type='button'
                onClick={() => setUseMap(!useMap)}
                className='px-4 py-2 rounded border border-primary text-primary text-sm'
              >
                {useMap ? 'Enter Address Manually' : 'Choose on Map'}
              </button>
            </div>

            {useMap ? (
              <>
                <MapLocationPicker formik={formik} />
                {formik.touched.location && formik.errors.location && (
                  <p className='text-red-500 text-sm mt-1'>{formik.errors.location}</p>
                )}
                <div>
                  <label className='block text-sm text-gray-600 mt-2'>Street</label>
                  <input
                    type='text'
                    className='w-full px-3 py-2 border rounded'
                    value={formik.values.streetName || ''}
                    onChange={formik.handleChange}
                  />
                </div>
              </>
            ) : (
              <div className=''>
                <InputField
                  name='country'
                  label='Country'
                  type='select'
                  options={countryOptions}
                  isRequired
                  value={formik.values.country}
                  error={formik.touched.country && formik.errors.country}
                  onChange={handleCountryChange}
                  onBlur={formik.handleBlur}
                />
                {/* {JSON.stringify(formik.values.city)} */}
                <InputField
                  name='city'
                  label='City'
                  type='select'
                  options={cityOptions}
                  isRequired
                  value={formik.values.city}
                  error={formik.touched.city && formik.errors.city}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <InputField
                  name='streetName'
                  label='Street'
                  type='text'
                  isRequired
                  value={formik.values.streetName}
                  error={formik.touched.streetName && formik.errors.streetName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
            )}

            {/* map  */}
            {/* <div>
            
              <label className='block text-md font-medium text-gray-700 mb-1'>
                Choose Location <span className='text-red-500'>*</span>
              </label>
              <MapLocationPicker formik={formik} />
              {formik.touched.location && formik.errors.location && (
                <p className='text-red-500 text-sm mt-1'>{formik.errors.location}</p>
              )}
            </div> */}

            {/* Location */}
            {/* <InputField
              name='location'
              label='Location'
              placeholder='Enter location'
              isRequired
              value={formik.values.location}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.location && formik.errors.location}
            /> */}

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

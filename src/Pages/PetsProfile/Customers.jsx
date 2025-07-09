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

const Customers = () => {
  const [open, setOpen] = useState(false);
  const [countryData, setCountryData] = useState([]);
  const [userSubscriptions, setUserSubscriptions] = useState([]);
  const [countryId, setCountryId] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRefs = useRef([]);

  const { handleLoading } = useLoading();

  const getAllCustomers = async () => {
    handleLoading(true);
    try {
      const res = await CustomerApi.getAllCustomer();
      setAllUsers(res.data?.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch pets');
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
      console.log('customer res:', res);
    } catch (err) {
      console.error(err);
    } finally {
      handleLoading(false);
    }
  };

  console.log('selectedRow:', selectedRow);
  console.log('userSubscriptions:', userSubscriptions);

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

          <Table2
            column={customerColumns}
            internalRowData={allUsers}
            searchLabel={'Customers'}
            sheetName={'pet'}
            setModalOpen={setOpen}
            isAdd={false}
          />
        </div>

        {open && (
          <SidebarField
            title={selectedRow ? 'Update Customer' : 'Add New Customer'}
            handleClose={handleModalClose}
            // button1={
            //   <Button
            //     onClick={formik.handleSubmit}
            //     text={selectedRow ? "Update" : "Save"}
            //     type="submit"
            //     disabled={isLoading}
            //   />
            // }
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
        )}
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

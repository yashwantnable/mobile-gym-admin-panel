import React, { useEffect, useMemo, useState } from 'react';
import { FaEye } from 'react-icons/fa';
import { SubscriptionApi } from '../../Api/Subscription.api';
import { useLoading } from '../../Components/loader/LoaderContext';
import { useSelector } from 'react-redux';
import { Table2 } from '../../Components/Table/Table2';
import Modal from '../../Components/Modal';
import { MasterApi } from '../../Api/Master.api';
import InputField from '../../Components/InputField';

// ───────────────────────────────────────────────────────────
// Helper to convert 24‑h → 12‑h
const formatTime12Hour = (timeString = '') => {
  if (!timeString) return '';
  const [h, m] = timeString.split(':');
  const hour = +h % 12 || 12;
  const ampm = +h >= 12 ? 'PM' : 'AM';
  return `${hour}:${m} ${ampm}`;
};

const DetailCard = ({ icon, label, value }) => (
  <div className='bg-white p-3 rounded-lg border border-gray-200 shadow-sm'>
    <div className='flex items-center space-x-2 text-gray-500 mb-1'>
      {icon}
      <span className='text-sm font-medium'>{label}</span>
    </div>
    <p className='text-gray-800 font-semibold'>{value}</p>
  </div>
);

// Simple label/value pair for the details modal
const DetailRow = ({ label, value }) => (
  <p className='flex'>
    <span className='w-40 font-medium text-gray-600'>{label}:</span>
    <span>{value ?? 'N/A'}</span>
  </p>
);
// ───────────────────────────────────────────────────────────

const TrainerSessions = () => {
  const { handleLoading } = useLoading();
  const user = useSelector((state) => state.store.currentUser);
  const trainerId = user?._id;
  const [trainerClasses, setTrainerClasses] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [locationData, setLocationData] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [error, setError]               = useState(null);
  const [actionMode, setActionMode] = useState(null); // "CHECKED_IN" | "REJECTED" | null
  const [rejectReason, setRejectReason] = useState('');
  const [saving, setSaving] = useState(false);

  // Fetch sessions created by this trainer
  const getClassesDetails = async (trainerId, expired) => {
    try {
      handleLoading(true);
      const res = await SubscriptionApi.SubscriptionByTrainerId(trainerId, expired);
      setTrainerClasses(res?.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      handleLoading(false);
    }
  };

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'nonExpired', label: 'Non-Expired' },
    { key: 'expired', label: 'Expired' },
  ];


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
    
  const handleStatusChange = async (nextStatus) => {
    // setSaving(true);
    // setError(null);
    // try {
    //   const res=await 
    //   }

    //   // bubble up to parent or refetch list
    //   onStatusUpdated?.(nextStatus);
    //   // reset local UI
    //   setActionMode(null);
    //   setRejectReason('');
    // } catch (err) {
    //   setError(err.response?.data?.message || 'Something went wrong');
    // } finally {
    //   setSaving(false);
    // }
  };

  const getAllLocations = async () => {
    try {
      handleLoading(true);

      const res = await MasterApi.getAllLocation();
      setLocationData(res?.data?.data?.allLocationMasters || []);
      //   console.log(res?.data?.data?.allLocationMasters);
    } catch (err) {
      console.error('Error fetching locations:', err);
      toast.error('Failed to fetch locations');
    } finally {
      handleLoading(false);
    }
  };

  // Table columns
  const columns = useMemo(
    () => [
      { headerName: 'Class Name', field: 'name' },
      {
        headerName: 'Category',
        field: 'categoryId.cName',
        cellRenderer: ({ data }) => data?.categoryId?.cName ?? 'N/A',
      },
      {
        headerName: 'Session Type',
        field: 'sessionType.sessionName',
        cellRenderer: ({ data }) => data?.sessionType?.sessionName ?? 'N/A',
      },
      {
        headerName: 'Date',
        field: 'date',
        cellRenderer: ({ data }) =>
          data?.date?.length
            ? new Date(data.date[0]).toLocaleDateString({
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })
            : 'N/A',
      },
      {
        headerName: 'Time',
        field: 'time',
        cellRenderer: ({ data }) =>
          data?.startTime && data?.endTime
            ? `${formatTime12Hour(data.startTime)} – ${formatTime12Hour(data.endTime)}`
            : 'N/A',
      },
      {
        headerName: 'Price (AED)',
        field: 'price',
        cellRenderer: ({ data }) => `AED ${data?.price ?? 'N/A'}`,
      },
      {
        headerName: 'Actions',
        field: 'actions',
        minWidth: 120,
        cellRenderer: ({ data }) => (
          <button
            title='View'
            onClick={() => {
              setSelectedRow(data);
              setOpen(true);
            }}
            className='text-primary hover:text-primary/80 transition-colors'
          >
            <FaEye size={18} />
          </button>
        ),
      },
    ],
    []
  );

  useEffect(() => {
    const isExpired = activeTab === 'all' ? undefined : activeTab === 'expired'; // true if expired, false if non-expired
    if (trainerId) {
      getClassesDetails(trainerId, isExpired);
    }
  }, [activeTab, trainerId]);

  useEffect(() => {
    getAllLocations();
    getClassesDetails(user?._id);
  }, []);

  return (
    <div className='p-5'>
      <h2 className='mb-4 text-4xl font-bold text-primary'>My Sessions</h2>
      {/* Tabs */}
      <div className='flex space-x-4 mb-4 '>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-2 px-4 text-sm font-medium border-b-2 ${
              activeTab === tab.key
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <Table2
        column={columns}
        internalRowData={trainerClasses}
        searchLabel='Classes'
        sheetName='Classes'
      />

      {/* ───────────── Details Modal ───────────── */}
      <Modal
        isOpen={open}
        onClose={() => {
          setOpen(false);
          setSelectedRow(null);
        }}
        title='Class Details'
        className='max-w-3xl'
      >
        {selectedRow && (
          <div className='flex flex-col md:flex-row gap-6 p-1'>
            {/* Image Section */}
            <div className='w-full md:w-1/3'>
              {selectedRow.media ? (
                <img
                  src={selectedRow.media}
                  alt='Class'
                  className='w-full h-64 md:h-full rounded-xl object-cover shadow-lg'
                />
              ) : (
                <div className='w-full h-64 md:h-full bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center shadow-lg'>
                  <svg
                    className='w-16 h-16 text-gray-400'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={1}
                      d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className='w-full md:w-2/3 space-y-4'>
              <h2 className='text-2xl font-bold text-gray-800'>{selectedRow.name}</h2>

              {/* Status Badge */}
              <div
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${selectedRow.isExpired ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}
              >
                {selectedRow.isExpired ? 'Expired' : 'Active'}
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <DetailCard
                  icon={
                    <svg
                      className='w-5 h-5 text-purple-600'
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
                  }
                  label='Category'
                  value={selectedRow.categoryId?.cName || 'N/A'}
                />

                <DetailCard
                  icon={
                    <svg
                      className='w-5 h-5 text-blue-600'
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
                  }
                  label='Session Type'
                  value={selectedRow.sessionType?.sessionName || 'N/A'}
                />

                <DetailCard
                  icon={
                    <svg
                      className='w-5 h-5 text-green-600'
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
                  }
                  label='Date'
                  value={
                    selectedRow.date?.length
                      ? new Date(selectedRow.date[0]).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : 'N/A'
                  }
                />

                <DetailCard
                  icon={
                    <svg
                      className='w-5 h-5 text-orange-600'
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
                  }
                  label='Time'
                  value={
                    selectedRow.startTime && selectedRow.endTime
                      ? `${formatTime12Hour(selectedRow.startTime)} – ${formatTime12Hour(selectedRow.endTime)}`
                      : 'N/A'
                  }
                />
              </div>

              {/* Location Section */}
              <div className='mt-4'>
                <label className='block text-sm font-medium text-gray-700 mb-1 flex items-center'>
                  <svg
                    className='w-5 h-5 text-indigo-600 mr-2'
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
                  Location
                </label>
                <div className='p-3 bg-gray-50 rounded-lg border border-gray-200'>
                  <p className='text-gray-800'>
                    {` ${selectedRow.Address.streetName}, ${selectedRow.Address.landmark}, ${selectedRow.Address.city.name}, ${selectedRow.Address.country.name}`}
                  </p>
                </div>
              </div>

              {/* ─── Trainer actions ───────────────────────────────────── */}
              {/* Action buttons */}
              {actionMode === null && (
                <div className='flex justify-end gap-4'>
                  <button
                    onClick={() => handleStatusChange('CHECKED_IN')}
                    disabled={saving}
                    className='px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60 transition-colors'
                  >
                    {saving ? 'Saving…' : 'Check In'}
                  </button>

                  <button
                    onClick={() => setActionMode('REJECTED')}
                    disabled={saving}
                    className='px-4 py-2 rounded-md bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-60 transition-colors'
                  >
                    Reject
                  </button>
                </div>
              )}

              {/* Reject flow */}
              {actionMode === 'REJECTED' && (
                <div className='space-y-3'>
                  <textarea
                    rows={3}
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder='Enter reject reason'
                    className='w-full border rounded-lg p-3 outline-none'
                  />

                  <div className='flex justify-end gap-3'>
                    <button
                      onClick={() => {
                        setActionMode(null);
                        setRejectReason('');
                      }}
                      disabled={saving}
                      className='px-4 py-2 rounded-md border disabled:opacity-60'
                    >
                      Cancel
                    </button>

                    <button
                      onClick={() => handleStatusChange('REJECTED')}
                      disabled={!rejectReason.trim() || saving}
                      className='px-4 py-2 rounded-md bg-primary text-white disabled:opacity-60'
                    >
                      {saving ? 'Saving…' : 'Save'}
                    </button>
                  </div>
                </div>
              )}

              {/* Simple inline error */}
              {error && <p className='text-sm text-rose-600'>{error}</p>}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TrainerSessions;

import React, { useEffect, useMemo, useState } from 'react';
import { FaEye } from 'react-icons/fa';
import { SubscriptionApi } from '../../Api/Subscription.api';
import { useLoading } from '../../Components/loader/LoaderContext';
import { useSelector } from 'react-redux';
import { Table2 } from '../../Components/Table/Table2';
import Modal from '../../Components/Modal';
import { MasterApi } from '../../Api/Master.api';
import InputField from '../../Components/InputField';
import { TrainerApi } from '../../Api/Trainer.api';
import { toast } from 'react-toastify';
import SmallCalendar from '../../Components/SmallCalendar.jsx';
import FilterPanel from '../../Components/FilterPanel.jsx';
import WeekView from "../../Components/WeekView";

// ───────────────────────────────────────────────────────────
// Helper to convert 24‑h → 12‑h 534612821827
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
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [classes, setClasses] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [error, setError]               = useState(null);
  const [actionMode, setActionMode] = useState(null); // "CHECKED_IN" | "REJECTED" | null
  const [rejectReason, setRejectReason] = useState('');
  const [saving, setSaving] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [filteredClasses, setFilteredClasses] = useState([]);
  console.log("selectedDate:",selectedDate)
 const [filters, setFilters] = useState({
  location: [],
  categoryId: [],
  sessionTypeId: [],
  minPrice: '',
  maxPrice: '',
  sortBy: 'relevance',
  order: 'desc',
  isExpired: false,
  isSingleClass: "",
  page: 1,
  limit: 100,
});

 const getUniqueValues = (field) => {
    const values = [...new Set(classes.map((cls) => cls[field]))].filter(
      Boolean
    );
    // console.log(`Unique ${field} values:`, values);
    return values;
  };


    const getUniqueOptions = (nameField, idField) => {
    const unique = new Map();
    classes.forEach((item) => {
      const name = item[nameField];
      const id = item[idField];
      if (name && id && !unique.has(id)) {
        unique.set(id, name);
      }
    });
    return Array.from(unique.entries()).map(([id, name]) => ({ id, name }));
  };


   const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

//     const getAllClasses = async () => {
//     handleLoading(true);
//     try {
//       const res = await SubscriptionApi.getAllSubscriptionFilter({ isSingleClass: true });
//       const apiClasses = res?.data?.data?.subscriptions;

     
//       console.log("apiClasses:",apiClasses);

//       setClasses(apiClasses);
//       setFilteredClasses(apiClasses);
//     } catch (err) {
//       console.log(err);
//     } finally {
//       handleLoading(false);
//     }
//   };

// useEffect(()=>{
//   getAllClasses();
// },[])

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

 const handleReset = () => {
    setFilters((prev) => ({
      ...prev,
      location: [],
      categoryId: [],
      sessionTypeId: [],
      page: 1,
    }));
  };



 
  // Fetch sessions created by this trainer
  const getClassesDetails = async () => {
  try {
    handleLoading(true);
    // Build payload from filters
    const payload = {
      sortBy: filters.sortBy,
      order: filters.order,
      minPrice: filters.minPrice || undefined,
      maxPrice: filters.maxPrice || undefined,
      categoryId: filters.categoryId.length ? filters.categoryId : undefined,
      sessionTypeId: filters.sessionTypeId.length ? filters.sessionTypeId : undefined,
      location: filters.location.length ? filters.location : undefined,
      isExpired: filters.isExpired,
      isSingleClass: filters.isSingleClass,
      page: filters.page,
      limit: filters.limit,
    };
    const res = await SubscriptionApi.trainerSubscriptionsfilters(payload);
    setTrainerClasses(res?.data?.data?.subscriptions || []);
  } catch (err) {
    console.error(err);
  } finally {
    handleLoading(false);
  }
};

   const handleClassClick = (classItem) => {
    setSelectedClass(classItem);
    setShowModal(true);
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
  if (!selectedRow?._id) return;

  try {
    // Get user's current location
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        const payload = {
          status: "CHECKIN",
          trainerLocation: [longitude, latitude],
        };

        console.log("subscriptionId:", selectedRow._id);
        console.log("payload:", payload);

        const res = await TrainerApi.trainerCheckIn(selectedRow._id, payload);

        // onStatusUpdated?.(nextStatus);
        setActionMode(null);
        setRejectReason('');
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Failed to get current location. Please enable location access.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  } catch (err) {
    console.error(err);
    toast.error(err?.message || "Something went wrong");
  }
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
        headerName: 'Date(s)',
        field: 'date',
        cellRenderer: ({ data }) => {
          if (Array.isArray(data.date) && data.date.length > 1) {
            const start = new Date(data.date[0]).toLocaleDateString('en-US', {
              year: 'numeric', month: 'short', day: 'numeric',
            });
            const end = new Date(data.date[data.date.length - 1]).toLocaleDateString('en-US', {
              year: 'numeric', month: 'short', day: 'numeric',
            });
            return `${start} - ${end}`;
          } else if (Array.isArray(data.date) && data.date.length === 1) {
            return new Date(data.date[0]).toLocaleDateString('en-US', {
              year: 'numeric', month: 'short', day: 'numeric',
            });
          } else if (typeof data.date === 'string') {
            return new Date(data.date).toLocaleDateString('en-US', {
              year: 'numeric', month: 'short', day: 'numeric',
            });
          }
          return 'N/A';
        },
      },
      {
        headerName: 'Single/Range',
        field: 'isSingleClass',
        cellRenderer: ({ data }) => data.isSingleClass ? 'Single' : 'Range',
      },
      {
        headerName: 'Expired',
        field: 'isExpired',
        cellRenderer: ({ data }) => data.isExpired ? 'Expired' : 'Active',
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
  if (trainerId) {
    getClassesDetails();
  }
}, [filters, trainerId]);

  useEffect(() => {
    getAllLocations();
    getClassesDetails(user?._id);
  }, []);

  const filterClassesByDate = (classes, selectedDate) => {
  if (!selectedDate) return classes;
  const selectedDateString = selectedDate.toISOString().split('T')[0];
  const selectedTime = selectedDate.setHours(0,0,0,0);

  return classes.filter(cls => {
    if (Array.isArray(cls.date)) {
      // Check if any date matches exactly
      const anyMatch = cls.date.some(d => d.split('T')[0] === selectedDateString);
      if (anyMatch) return true;

      // Check if selectedDate is between first and last date in the array
      if (cls.date.length >= 2) {
        const start = new Date(cls.date[0]).setHours(0,0,0,0);
        const end = new Date(cls.date[cls.date.length - 1]).setHours(0,0,0,0);
        if (selectedTime >= start && selectedTime <= end) return true;
      }
      return false;
    }
    // Single date
    return cls.date && cls.date.split('T')[0] === selectedDateString;
  });
};

  return (
    <div className='p-5'>
      <h2 className='mb-4 text-4xl font-bold text-primary'>My Sessions</h2>

    {/* side filters */}
     <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar - Header, Small Calendar + Filter Panel */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              {/* Sidebar Header and Description */}
             
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">
                    Calendar
                  </h2>
                </div>
                <div className="p-4">
                  <SmallCalendar
                    selectedDate={selectedDate}
                    onDateSelect={handleDateSelect}
                    classesData={classes}
                  />
                  <button
                    className="mt-3 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors w-full"
                    onClick={() => setSelectedDate(null)}
                    disabled={!selectedDate}
                  >
                    Clear Date
                  </button>
                </div>
              </div>

              <FilterPanel
                filters={filters}
                setFilters={setFilters}
                onFilterChange={handleFilterChange}
                onReset={handleReset}
                locations={getUniqueOptions("location", "locationId")}
                categories={getUniqueOptions("category", "categoryId")}
                sessionTypes={getUniqueOptions("sessionType", "sessionTypeId")}
              />
            </div>
            {/* Main Content - Week View */}
            <div className="lg:col-span-9">
              {/* Mobile Filters */}
              {showFilters && (
                <div className="lg:hidden mb-6 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-lg font-medium text-gray-900">
                      Filters
                    </h2>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="p-4">
                    <FilterPanel
                      filters={filters}
                      setFilters={setFilters}
                      onFilterChange={handleFilterChange}
                      onReset={handleReset}
                      locations={getUniqueValues("location")}
                      categories={getUniqueValues("category")}
                      sessionTypes={getUniqueValues("sessionType")}
                    />
                  </div>
                </div>
              )}
              {/* Week View */}
              {/* <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-[100vh]">
                <div className="px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg  text-gray-900 font-bold">
                      Schedule for{" "}
                      {selectedDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </h2>
                    <div className="text-sm text-gray-500">
                      {trainerClasses.length} classes found
                    </div>
                  </div>
                </div>
                <div className="overflow-hidden">
                  <WeekView
                    classes={[trainerClasses]}
                    selectedDate={selectedDate}
                    onClassClick={handleClassClick}
                    selectedPackage={selectedPackage}
                  />
                </div>
              </div> */}

              <Table2
        column={columns}
        internalRowData={filterClassesByDate(trainerClasses, selectedDate)}
        searchLabel='Classes'
        sheetName='Classes'
      />


            </div>
          </div>


      {/* Tabs */}
      {/* <div className='flex space-x-4 mb-4 '>
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
      </div> */}

      
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
                    onClick={() => setActionMode('REJECTED')}
                    disabled={saving}
                    className='px-4 py-2 rounded-md bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-60 transition-colors'
                  >
                    Reject
                  </button>

                  <button
                    onClick={() => handleStatusChange('CHECKED_IN')}
                    disabled={saving}
                    className='px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60 transition-colors'
                  >
                    {saving ? 'Saving…' : 'Check In'}
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

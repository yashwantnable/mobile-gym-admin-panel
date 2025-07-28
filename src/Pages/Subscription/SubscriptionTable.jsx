import React, { useEffect, useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table';
import { TrainerApi } from '../../Api/Trainer.api';
import { SubscriptionApi } from '../../Api/Subscription.api';
import { MasterApi } from '../../Api/Master.api';
import { CategoryApi } from '../../Api/Category.Api';
import { Table2 } from '../../Components/Table/Table2';
import { FiEdit } from 'react-icons/fi';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import SmallCalendar from '../../Components/SmallCalendar';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { HiMapPin } from 'react-icons/hi2';
import { HiOutlineSquares2X2 } from 'react-icons/hi2';
import { FaUser } from 'react-icons/fa';

const SubscriptionTable = ({
  setOpen,
  handleClearFilters,
  allSubscription,
  setFilters,
  filters,
  handleChange,
  setSelectedRow,
  setDeleteModal,
  expired = false,
}) => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [trainerOptions, setTrainerOptions] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dropdownOpen, setDropDownOpen] = useState({
    location: false,
    category: false,
    trainer: false,
  });
  // const [filters, setFilters] = useState({
  //   trainerId: '',
  //   categoryId: '',
  //   location: '',
  //   isExpired: '',
  // });
  console.log('allSubscription:', allSubscription);

  const handleApplyFilters = () => {
    const parsedFilters = {
      trainerId: filters.trainerId || undefined,
      categoryId: filters.categoryId || undefined,
      locationId: filters.location || undefined,
      isExpired: filters.isExpired === '' ? undefined : filters.isExpired === 'true' ? true : false,
    };
    onFilterChange(parsedFilters);
  };

  // Fetch filter dropdown options
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [trainersRes, locationsRes, categoriesRes] = await Promise.all([
          TrainerApi.getAllTrainers(),
          MasterApi.getAllLocation(),
          CategoryApi.getAllCategory(),
        ]);
        setTrainerOptions(trainersRes?.data?.data || []);
        setLocationOptions(locationsRes?.data?.data?.allLocationMasters || []);
        setCategoryOptions(categoriesRes?.data?.data || []);
      } catch (err) {
        console.error('Error loading dropdown filters:', err);
      }
    };
    fetchOptions();
  }, []);

  // useEffect(() => {
  //   const fetchInitialData = async () => {
  //     try {
  //       const response = await SubscriptionApi.getAllSubscriptionFilter();
  //       setSubscriptions(response.data || []);
  //     } catch (err) {
  //       console.error('Error fetching subscriptions:', err);
  //     }
  //   };
  //   fetchInitialData();
  // }, []);

  // Fetch filtered subscriptions
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await SubscriptionApi.getAllSubscriptionFilter({
  //         ...filters,
  //         isExpired: expired, // add `isExpired` as part of the payload
  //       });
  //       setSubscriptions(response.data || []);
  //       console.log('response:', response?.data?.data?.subscriptions);
  //     } catch (err) {
  //       console.error('Error fetching subscriptions:', err);
  //     }
  //   };
  //   fetchData();
  // }, [filters, expired]);

  const toggle = (key) => setDropDownOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
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

  const formatTime12Hour = (timeStr) => {
    const [hourStr, minute] = timeStr.split(':');
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? 'pm' : 'am';
    hour = hour % 12 || 12; // Convert '0' to '12'
    return `${hour}:${minute} ${ampm}`;
  };

  // Filter subscriptions by selected date (frontend only)
  const filterByDate = (subscriptions, selectedDate) => {
    if (!selectedDate) return subscriptions;
    const selectedDateString = selectedDate.toISOString().split('T')[0];
    return subscriptions.filter((sub) => {
      if (Array.isArray(sub.date)) {
        return sub.date.some((d) => d.split('T')[0] === selectedDateString);
      }
      return sub.date && sub.date.split('T')[0] === selectedDateString;
    });
  };

  // console.log("subscriptions:",subscriptions?.data?.subscriptions);

  return (
    <div className='p-6'>
      <div className='grid grid-cols-1 md:grid-cols-12 gap-6'>
        {/* Left: Calendar and Filters */}
        <div className='md:col-span-4 flex flex-col gap-6'>
          {/* Calendar Filter */}
          <div className='mb-2 max-w-xs md:max-w-full'>
            <SmallCalendar
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              classesData={allSubscription}
            />
            <button
              className='mt-2 px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 w-full'
              onClick={() => setSelectedDate(null)}
              disabled={!selectedDate}
            >
              Clear Date
            </button>
          </div>
          {/* Filters */}
          <div className='bg-white rounded-xl shadow-sm p-4 space-y-4 w-full max-w-xs'>
            <h2 className='text-lg font-semibold'>FILTERS</h2>
            <input
              type='text'
              placeholder='Search...'
              className='w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500'
            />

            {/* Location */}
            <div>
              <button
                className='flex justify-between items-center w-full text-left py-2 text-sm font-medium text-gray-700'
                onClick={() => toggle('location')}
              >
                Location
                {dropdownOpen.location ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </button>
              {dropdownOpen.location && (
                <div className='pl-2 mt-2 space-y-1'>
                  {/* <div
              className="cursor-pointer text-sm hover:text-blue-600"
              onClick={() => handleFilterChange('location', '')}
            >
              All Locations
            </div> */}
                  {locationOptions.map((loc) => (
                    <div
                      key={loc._id}
                      className={`flex items-center gap-2 cursor-pointer text-sm hover:text-blue-600 ${
                        filters.location === loc._id ? 'text-blue-600 font-semibold' : ''
                      }`}
                      onClick={() => handleFilterChange('location', loc._id)}
                    >
                      <HiMapPin size={16} />
                      {loc.streetName}, {loc?.City?.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Category */}
            <div>
              <button
                className='flex justify-between items-center w-full text-left py-2 text-sm font-medium text-gray-700'
                onClick={() => toggle('category')}
              >
                Category
                {dropdownOpen.category ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </button>
              {dropdownOpen.category && (
                <div className='pl-2 mt-2 space-y-1'>
                  {/* <div
              className="cursor-pointer text-sm hover:text-blue-600"
              onClick={() => handleFilterChange('categoryId', '')}
            >
              All Categories
            </div> */}
                  {categoryOptions.map((category) => (
                    <div
                      key={category._id}
                      className={`flex items-center gap-2 cursor-pointer text-sm hover:text-blue-600 ${
                        filters.categoryId === category._id ? 'text-blue-600 font-semibold' : ''
                      }`}
                      onClick={() => handleFilterChange('categoryId', category._id)}
                    >
                      <HiOutlineSquares2X2 size={16} />
                      {category.cName}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Session Type */}
            <div>
              <button
                className='flex justify-between items-center w-full text-left py-2 text-sm font-medium text-gray-700'
                onClick={() => toggle('trainer')}
              >
                Trainer
                {dropdownOpen.trainer ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </button>
              {dropdownOpen.trainer && (
                <div className='pl-2 mt-2 space-y-1'>
                  {/* <div
              className="cursor-pointer text-sm hover:text-blue-600"
              onClick={() => handleFilterChange('sessionTypeId', '')}
            >
              All Session Types
            </div> */}
                  {trainerOptions.map((s) => (
                    <div
                      key={s._id}
                      className={`flex items-center gap-2 cursor-pointer text-sm hover:text-blue-600 ${
                        filters.trainerId === s._id ? 'text-blue-600 font-semibold' : ''
                      }`}
                      onClick={() => handleFilterChange('trainerId', s._id)}
                    >
                      <FaUser size={14} />
                      {s.first_name} {s.last_name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Clear Filters */}
            <div>
              <button
                onClick={handleClearFilters}
                className='w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-lg shadow-sm hover:bg-blue-600 hover:text-white transition'
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
        {/* Right: Table */}
        <div className='md:col-span-8'>
          <Table2
            column={Columns}
            internalRowData={filterByDate(allSubscription, selectedDate)}
            searchLabel={'Subscription'}
            sheetName={'Subscription'}
            setModalOpen={setOpen}
          />
        </div>
      </div>
    </div>
  );
};

export default SubscriptionTable;

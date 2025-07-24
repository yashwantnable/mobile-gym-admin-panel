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

  // console.log("subscriptions:",subscriptions?.data?.subscriptions);

  return (
    <div className='p-6'>
      <div className='p-6'>
        {/* Filter Bar */}
       {/* <div className='flex flex-wrap justify-around gap-6 mb-8 p-4 bg-white rounded-xl shadow-sm items-end'> */}
       <div className='grid grid-cols-1 md:grid-cols-5 gap-6 mb-8 p-4 bg-white rounded-xl shadow-sm items-end'>
          {/* Trainer Dropdown */}
          <div className='space-y-1'>
            <label className='block text-sm font-medium text-gray-700'>Trainer</label>
            <select
              name='trainerId'
              value={filters.trainerId}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9Ii82QjcyODkiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1jaGV2cm9uLWRvd24iPjxwYXRoIGQ9Im02IDkgNiA2IDYtNiIvPjwvc3ZnPg==')] bg-no-repeat bg-[right_0.75rem_center] bg-[length:1.25rem_1.25rem]"
            >
              <option value='' className='text-gray-400'>
                All Trainers
              </option>
              {trainerOptions.map((trainer) => (
                <option
                  key={trainer._id}
                  value={trainer._id}
                  className='py-2 hover:bg-blue-50 hover:text-blue-600'
                >
                  {trainer.first_name} {trainer.last_name}
                </option>
              ))}
            </select>
          </div>

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

           {/* Clear Filters Button */}
        <div className='space-y-1'>
          <button
            onClick={handleClearFilters}
            className='w-full px-4 py-2 border border-primary text-primary rounded-lg shadow-sm hover:bg-primary hover:text-white transition-all'
          >
            Clear Filters
          </button>
        </div>
        </div>

       

        {/* Apply Filters Button */}
        {/* <div className="mb-6">
        <button
          onClick={handleApplyFilters}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Apply Filters
        </button>
      </div> */}

        {/* Subscription Table */}
        <Table2
          column={Columns}
          internalRowData={allSubscription}
          searchLabel={'Subscription'}
          sheetName={'Subscription'}
          setModalOpen={setOpen}
        />
      </div>
    </div>
  );
};

export default SubscriptionTable;

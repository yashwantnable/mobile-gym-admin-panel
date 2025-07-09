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
 

const SubscriptionTable = ({ setOpen,setSelectedRow,setDeleteModal,expired=false}) => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [trainerOptions, setTrainerOptions] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [filters, setFilters] = useState({
    trainerId: "",
    categoryId: "",
    location: "",
    isExpired: "",
  });
 console.log("locationOptions:",locationOptions);
 
   const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ [name]: value }));
  };

  const handleApplyFilters = () => {
    const parsedFilters = {
      trainerId: filters.trainerId || undefined,
      categoryId: filters.categoryId || undefined,
      locationId: filters.location || undefined,
      isExpired:
        filters.isExpired === ""
          ? undefined
          : filters.isExpired === "true"
          ? true
          : false,
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

  useEffect(() => {
  const fetchInitialData = async () => {
    try {
      const response = await SubscriptionApi.getAllSubscriptionFilter();
      setSubscriptions(response.data || []);
    } catch (err) {
      console.error('Error fetching subscriptions:', err);
    }
  };
  fetchInitialData();
}, []); // runs once on first render only


  // Fetch filtered subscriptions
  useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await SubscriptionApi.getAllSubscriptionFilter({
        ...filters,
        isExpired: expired, // add `isExpired` as part of the payload
      });
      setSubscriptions(response.data || []);
      console.log("response:",response?.data?.data?.subscriptions);
      
    } catch (err) {
      console.error('Error fetching subscriptions:', err);
    }
  };
  fetchData();
}, [filters, expired]);


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
    <div className="p-6">
        
      <div className="p-6">
      {/* Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Trainer Dropdown */}
        <div>
          <label className="block text-sm font-medium mb-1">Trainer</label>
          <select
            name="trainerId"
            value={filters.trainerId}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">All Trainers</option>
            {trainerOptions.map((trainer) => (
              <option key={trainer._id} value={trainer._id}>
                {trainer.first_name}
                {trainer.last_name}
              </option>
            ))}
          </select>
        </div>

        {/* Category Dropdown */}
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            name="categoryId"
            value={filters.categoryId}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">All Categories</option>
            {categoryOptions.map((category) => (
              <option key={category._id} value={category._id}>
                {category.cName}
              </option>
            ))}
          </select>
        </div>

        {/* Location Dropdown */}
        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <select
            name="location"
            value={filters.location}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">All Locations</option>
            {locationOptions.map((loc) => (
              <option key={loc._id} value={loc._id}>
                {loc?.streetName},{loc?.City?.name}
              </option>
            ))}
          </select>
        </div>

        {/* isExpired Dropdown */}
        <div>
          <label className="block text-sm font-medium mb-1">Expired</label>
          <select
            name="isExpired"
            value={filters.isExpired}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">All</option>
            <option value={true}>Expired</option>
            <option value={false}>Not Expired</option>
          </select>
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
        internalRowData={subscriptions?.data?.subscriptions}
        searchLabel={"Subscription"}
        sheetName={"Subscription"}
        setModalOpen={setOpen}
      />
    </div>
    </div>
  );
};

export default SubscriptionTable;

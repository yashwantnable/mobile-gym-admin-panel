import React, { useEffect, useMemo, useState } from 'react';
import { ServiceApi } from '../../Api/Service.api';
import { useLoading } from '../../Components/loader/LoaderContext';
import { Table2 } from '../../Components/Table/Table2';
import { FaEye } from 'react-icons/fa';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { RatingApi } from '../../Api/Ratings.api';

const ServiceRating = () => {
  const [allServiceRatings, setAllServiceRatings] = useState(null);
  const [allSubServiceData, setAllSubServiceData] = useState(null);
  const [selectedRow, setSelectedRow] = useState();
  const [reviewOpen, setReviewOpen] = useState(false);
  const { handleLoading } = useLoading();

  const ReviewColumns = useMemo(
  () => [
    {
      headerName: 'Customer Name',
      field: 'customer.first_name',
      minWidth: 160,
      valueGetter: (params) => params.data?.customer?.first_name || 'N/A',
    },
    {
      headerName: 'Subscription Name',
      field: 'subscription.name',
      minWidth: 200,
      valueGetter: (params) => params.data?.subscription?.name || 'N/A',
    },
    {
      headerName: 'Rating',
      field: 'rating',
      minWidth: 100,
    },
    {
      headerName: 'Review',
      field: 'review',
      minWidth: 300,
    },
  ],
  []
);

const dummySubscriptionReviews = [
  {
    id: 1,
    customer: {
      first_name: "Alice",
    },
    subscription: {
      name: "Yoga Monthly Plan",
    },
    rating: 4.5,
    review: "The yoga sessions were calming and well-structured.",
  },
  {
    id: 2,
    customer: {
      first_name: "David",
    },
    subscription: {
      name: "Strength Training - Weekly",
    },
    rating: 4.8,
    review: "Great strength workouts, I feel more energized!",
  },
  {
    id: 3,
    customer: {
      first_name: "Sophia",
    },
    subscription: {
      name: "Zumba Daily",
    },
    rating: 4.2,
    review: "Fun and active! Could use a bit more variety.",
  },
  {
    id: 4,
    customer: {
      first_name: "Mohammed",
    },
    subscription: {
      name: "Cardio Burn Package",
    },
    rating: 5.0,
    review: "Excellent results! Loved the trainer’s enthusiasm.",
  },
  {
    id: 5,
    customer: {
      first_name: "Emily",
    },
    subscription: {
      name: "Personalized Fitness Plan",
    },
    rating: 4.7,
    review: "Tailored to my needs. I’ve made great progress!",
  },
];


  const columns = useMemo(
    () => [
      // {
      //   headerName: "S.No",
      //   minWidth: 80,
      //   cellRenderer: (params) => params.node.rowIndex + 1,
      // },
      {
        headerName: 'Sub-Service Name',
        field: 'name',
        minWidth: 180,
      },
      {
        headerName: 'Service Type',
        field: 'serviceTypeId.name',
        minWidth: 160,
        cellRenderer: (params) => params.data?.serviceTypeId?.name || 'N/A',
      },
      {
        headerName: 'Grooming Details',
        field: 'groomingDetails',
        minWidth: 300,
        cellRenderer: (params) =>
          params.data?.groomingDetails
            ?.map((gd) => `${gd.weightType}: ${gd.price} AED`)
            .join(' | ') || 'N/A',
      },
      {
        headerName: 'Image',
        field: 'image',
        minWidth: 120,
        cellRenderer: (params) => (
          <img
            src={params.data?.image}
            alt='sub-service'
            className='w-16 h-16 object-cover rounded'
          />
        ),
      },
      {
        headerName: 'Review',
        field: 'actions',
        minWidth: 150,
        cellRenderer: (params) => (
          <div className='text-xl flex items-center py-2'>
            <button
              className='rounded cursor-pointer'
              onClick={() => {
                setReviewOpen(true);
                setSelectedRow(params?.data);
              }}
            >
              <FaEye />
            </button>
            {/* <button
                  className="px-4 rounded cursor-pointer text-red-500"
                  onClick={() => {
                    setOpen(false);
                    setDeleteModal(params?.data);
                  }}
                >
                  <MdOutlineDeleteOutline />
                </button> */}
          </div>
        ),
      },
    ],
    []
  );

  const getAllSubServiceReviews = async () => {
    handleLoading(true);
    try {
      const res = await RatingApi.getAllServiceReview(selectedRow?._id);
      setAllServiceRatings(res.data.data.reviews || []);
      console.log('sub survice reviews:', res.data.reviews);
    } catch (err) {
      console.error('Error fetching currencies:', err);
      toast.error('Failed to fetch currencies');
    } finally {
      handleLoading(false);
    }
  };
  useEffect(() => {
    // getAllSubServiceReviews();
  }, [selectedRow]);

  const getAllSubService = async () => {
    handleLoading(true);
    try {
      const res = await ServiceApi.service();
      setAllSubServiceData(res.data.data || []);
      //   console.log(res);
    } catch (err) {
      console.error('Error fetching currencies:', err);
      toast.error('Failed to fetch currencies');
    } finally {
      handleLoading(false);
    }
  };
  console.log('allServiceRatings:', allServiceRatings);

  useEffect(() => {
    // getAllSubService();
  }, []);

  return (
    <div className='p-5'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-4xl font-bold text-primary'>Subscription Reviews</h2>
      </div>
      
        <Table2
          column={ReviewColumns}
          internalRowData={dummySubscriptionReviews}
          searchLabel={'Sub Services Ratings'}
          sheetName={'subservices Ratings'}
          // setModalOpen={setOpen}
          // isAdd={true}
          setSelectedRow={setSelectedRow}
          // isBack={true}
        />
      
    </div>
  );
};

export default ServiceRating;

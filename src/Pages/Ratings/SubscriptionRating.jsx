import React, { useEffect, useMemo, useState } from 'react';
import { ServiceApi } from '../../Api/Service.api';
import { useLoading } from '../../Components/loader/LoaderContext';
import { Table2 } from '../../Components/Table/Table2';
import { FaEye } from 'react-icons/fa';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { RatingApi } from '../../Api/Ratings.api';

const SubscriptionRating = () => {
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

// const dummySubscriptionReviews = [
//   {
//     id: 1,
//     customer: {
//       first_name: "Alice",
//     },
//     subscription: {
//       name: "Yoga Monthly Plan",
//     },
//     rating: 4.5,
//     review: "The yoga sessions were calming and well-structured.",
//   },
//   {
//     id: 2,
//     customer: {
//       first_name: "David",
//     },
//     subscription: {
//       name: "Strength Training - Weekly",
//     },
//     rating: 4.8,
//     review: "Great strength workouts, I feel more energized!",
//   },
//   {
//     id: 3,
//     customer: {
//       first_name: "Sophia",
//     },
//     subscription: {
//       name: "Zumba Daily",
//     },
//     rating: 4.2,
//     review: "Fun and active! Could use a bit more variety.",
//   },
//   {
//     id: 4,
//     customer: {
//       first_name: "Mohammed",
//     },
//     subscription: {
//       name: "Cardio Burn Package",
//     },
//     rating: 5.0,
//     review: "Excellent results! Loved the trainer’s enthusiasm.",
//   },
//   {
//     id: 5,
//     customer: {
//       first_name: "Emily",
//     },
//     subscription: {
//       name: "Personalized Fitness Plan",
//     },
//     rating: 4.7,
//     review: "Tailored to my needs. I’ve made great progress!",
//   },
// ];



  const getAllSubscriptionReviews = async () => {
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
    getAllSubscriptionReviews();
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

export default SubscriptionRating;

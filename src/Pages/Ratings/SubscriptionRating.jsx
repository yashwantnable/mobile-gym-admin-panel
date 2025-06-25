import React, { useEffect, useMemo, useState } from 'react';
import { ServiceApi } from '../../Api/Service.api';
import { useLoading } from '../../Components/loader/LoaderContext';
import { Table2 } from '../../Components/Table/Table2';
import { FaEye } from 'react-icons/fa';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { RatingApi } from '../../Api/Ratings.api';

const SubscriptionRating = () => {
  const [allSubscriptionReviews, setAllSubscriptionReviews] = useState(null);
  // const [allSubServiceData, setAllSubServiceData] = useState(null);
  const [selectedRow, setSelectedRow] = useState();
  const [reviewOpen, setReviewOpen] = useState(false);
  const { handleLoading } = useLoading();


const ReviewColumns = useMemo(
  () => [
    {
      headerName: 'Customer Name',
      field: 'created_by.first_name',
      minWidth: 160,
      valueGetter: (params) =>
        params.data?.created_by?.first_name?.trim() || 'N/A',
    },
    {
      headerName: 'Customer Email',
      field: 'created_by.email',
      minWidth: 200,
      valueGetter: (params) => params.data?.created_by?.email || 'N/A',
    },
    {
      headerName: 'Trainer Name',
      field: 'trainer.first_name',
      minWidth: 160,
      valueGetter: (params) =>
        params.data?.trainer?.first_name?.trim() || 'N/A',
    },
    {
      headerName: 'Trainer Email',
      field: 'trainer.email',
      minWidth: 200,
      valueGetter: (params) => params.data?.trainer?.email || 'N/A',
    },
    {
      headerName: 'Subscription Name',
      field: 'subscriptionId.name',
      minWidth: 200,
      valueGetter: (params) =>
        params.data?.subscriptionId?.name || 'N/A',
    },
    {
      headerName: 'Subscription Location',
      field: 'subscriptionId.location',
      minWidth: 150,
      valueGetter: (params) =>
        params.data?.subscriptionId?.location || 'N/A',
    },
    {
      headerName: 'Session Name',
      field: 'sessionId.sessionName',
      minWidth: 180,
      valueGetter: (params) =>
        params.data?.sessionId?.sessionName || 'N/A',
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
    {
      headerName: 'Created At',
      field: 'createdAt',
      minWidth: 180,
      valueGetter: (params) =>
        new Date(params.data?.createdAt).toLocaleString() || 'N/A',
    },
  ],
  []
);




  const getAllSubscriptionReviews = async () => {
    handleLoading(true);
    try {
      const res = await RatingApi.getAllSubscriptionReview(selectedRow?._id);
      setAllSubscriptionReviews(res.data.data.reviews || []);
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

  // const getAllSubService = async () => {
  //   handleLoading(true);
  //   try {
  //     const res = await ServiceApi.service();
  //     setAllSubServiceData(res.data.data || []);
  //     //   console.log(res);
  //   } catch (err) {
  //     console.error('Error fetching currencies:', err);
  //     toast.error('Failed to fetch currencies');
  //   } finally {
  //     handleLoading(false);
  //   }
  // };
  console.log('allSubscriptionReviews:', allSubscriptionReviews);

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
          internalRowData={allSubscriptionReviews}
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

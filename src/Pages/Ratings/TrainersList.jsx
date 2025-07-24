import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
// import trainersWithReviews from "./TrainersReview";
import { Table2 } from '../../Components/Table/Table2';
import { RatingApi } from '../../Api/Ratings.api';
import { toast } from 'react-toastify';
import { TrainerApi } from '../../Api/Trainer.api';
import { useLoading } from '../../Components/loader/LoaderContext';

const TrainersList = () => {
  const navigate = useNavigate();
  const { handleLoading } = useLoading();
  const [trainerReviews, setTrainerReviews] = useState(null);
  const [allTrainers, setAllTrainers] = useState(null);

  const columns = [
    {
      headerName: 'Photo',
      field: 'profile_image',
      minWidth: 100,
      cellRenderer: (params) => (
        <img
          src={params.data.profile_image}
          alt='Trainer'
          className='w-14 h-14 rounded-full object-cover'
        />
      ),
    },
    {
      headerName: 'Name',
      field: 'name',
      minWidth: 150,
      cellRenderer: (params) =>
        `${params.data.first_name || ''} ${params.data.last_name || ''}`.trim(),
    },
    {
      headerName: 'Email',
      field: 'email',
      minWidth: 200,
    },
    {
      headerName: 'Total Reviews',
      field: 'totalReviews',
      minWidth: 150,
      cellRenderer: (params) => params.data.totalReviews || 0,
    },
    {
      headerName: 'Average Rating',
      field: 'averageRating',
      minWidth: 150,
      cellRenderer: (params) => params.data.averageRating || 0,
    },
    {
      headerName: 'Specialization',
      field: 'specialization',
      minWidth: 200,
    },
    {
      headerName: 'Action',
      field: 'action',
      minWidth: 150,
      cellRenderer: (params) => (
        <button
          onClick={() => navigate(`/ratings/trainer/${params.data._id}`)}
          className='bg-primary text-white px-4 py-1 rounded-md hover:bg-primary-dark transition'
        >
          View Reviews
        </button>
      ),
    },
  ];

  const getAllTrainerReviews = async () => {
    try {
      handleLoading(true);
      const res = await RatingApi.getAllTrainerRatings();
      setTrainerReviews(res?.data?.data);
      console.log('trainer revires:', res?.data?.data);
    } catch (err) {
      toast.error('error:', err);
    } finally {
      handleLoading(false);
    }
  };

  const getAllTrainers = async () => {
    try {
      handleLoading(true);
      const res = await TrainerApi.getAllTrainers();
      setAllTrainers(res?.data?.data);
      console.log('all trainer:', res?.data?.data);
    } catch (err) {
      toast.error('error:', err);
    } finally {
      handleLoading(false);
    }
  };

  //  const trainersWithRating = trainersWithReviews.map((trainer) => ({
  //   ...trainer,
  //   rating:
  //     trainer.reviews.reduce((sum, r) => sum + r.rating, 0) /
  //     trainer.reviews.length,
  // }));

  useEffect(() => {
    getAllTrainerReviews();
    getAllTrainers();
  }, []);
  return (
    <div className='p-6'>
      <h2 className='text-4xl font-bold text-primary mb-6'>Our Trainers</h2>
      <div className=''>
        <Table2
          column={columns}
          internalRowData={allTrainers}
          onRowClicked={(trainer) => navigate(`/ratings/trainer/${trainer.id}`)}
          sheetName='Trainer List'
          searchLabel='Trainer'
        />
      </div>
    </div>
  );
};

export default TrainersList;

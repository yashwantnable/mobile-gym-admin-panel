// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { Table2 } from "../../Components/Table/Table2";
// // import trainersWithReviews from "./TrainersReview";
// import { SlArrowLeft } from "react-icons/sl";
// import {TrainerApi} from "../../Api/Trainer.api.js"
// import { toast } from "react-toastify";
// import { useLoading } from "../../Components/loader/LoaderContext.jsx";
// import moment from "moment/moment.js";
// import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

// const TrainerReviewPage = () => {
//   const { _id } = useParams();
//   const navigate = useNavigate();
//   const { handleLoading } = useLoading();
//   const [trainerReviews,setTrainerReviews]=useState([])
//   const [trainer,setTrainer]=useState([])
//   console.log("_id:",_id)
//  const getTrainerDetailsById=async(_id)=>{
//   try{
//   handleLoading(true)
//   console.log("_id:",_id)
//   const res= await TrainerApi.getSingleTrainer(_id);
//   setTrainer(res?.data?.data)
//   console.log("setTrainer:",res?.data?.data);

//   }catch(err){
//     toast.error("eror:",err)
//   }finally{
//     handleLoading(false)
//   }
//  }
//  const getTrainerReviewById=async(_id)=>{
//   try{
//   handleLoading(true)
//   const res= await TrainerApi.trainerReviewbyId(_id);
//   setTrainerReviews(res?.data?.data)
//   console.log("triner review by id:",res?.data?.data);

//   }catch(err){
//     toast.error("eror:",err)
//   }finally{
//     handleLoading(false)
//   }
//  }

//  const renderStars = (rating) => {
//   const stars = [];
//   const fullStars = Math.floor(rating);
//   const hasHalfStar = rating % 1 >= 0.5;

//   for (let i = 0; i < 5; i++) {
//     if (i < fullStars) {
//       stars.push(<FaStar key={i} className="text-yellow-500" />);
//     } else if (i === fullStars && hasHalfStar) {
//       stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" />);
//     } else {
//       stars.push(<FaRegStar key={i} className="text-yellow-300" />);
//     }
//   }

//   return <div className="flex items-center space-x-1">{stars}</div>;
// };

//  const columns = [
//   {
//     headerName: "Review",
//     field: "review",
//     minWidth: 250,
//   },
// {
//     headerName: "Rating",
//     field: "rating",
//     minWidth: 150,
//     cellRenderer: (params) => renderStars(params.data.rating),
//   },

//   {
//   headerName: "User",
//   field: "user",
//   minWidth: 200,
//   cellRenderer: (params) => {
//     const user = params.data.user;
//     if (!user) return "N/A";

//     return (
//       <div className="flex items-center space-x-2">
//         <img
//           src={user.profile_image}
//           alt="User"
//           className="w-8 h-8 rounded-full object-cover"
//         />
//         <span>{${user.first_name || ""} ${user.last_name || ""}.trim()}</span>
//       </div>
//     );
//   },
// },
//   {
//     headerName: "Review Date",
//     field: "createdAt",
//     minWidth: 150,
//     cellRenderer: (params) => moment(params.data.createdAt).format("DD MMM YYYY"),
//   },
// ];

//   if (!trainerReviews) return <div className="p-6">Trainer not found.</div>;
// useEffect(()=>{
//   getTrainerDetailsById(_id);
//   getTrainerReviewById(_id);
// },[])
//   return (
//     <div className="p-6">
//       <h2 className="text-3xl font-bold text-primary mb-4 flex items-center gap-2">
//         <SlArrowLeft size={18} onClick={() => navigate(/ratings/trainers)} className="cursor-pointer"/>
//         {trainer?.first_name}'s Reviews & Ratings
//       </h2>
//       <Table2
//         column={columns}
//         internalRowData={trainerReviews}
//         sheetName={${trainer?.first_name}-reviews}
//         // isBack={true}
//       />
//     </div>
//   );
// };

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Table2 } from '../../Components/Table/Table2';
import { SlArrowLeft } from 'react-icons/sl';
import { toast } from 'react-toastify';
import { useLoading } from '../../Components/loader/LoaderContext.jsx';
import moment from 'moment/moment.js';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { RatingApi } from '../../Api/Ratings.api.js';
import { TrainerApi } from '../../Api/Trainer.api.js';
import { FaReply, FaEye, FaEyeSlash } from 'react-icons/fa';

const TrainerReviewPage = () => {
  const { _id } = useParams();
  const navigate = useNavigate();
  const { handleLoading } = useLoading();

  const [trainerReviews, setTrainerReviews] = useState([]);
  const [trainer, setTrainer] = useState([]);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [currentReview, setCurrentReview] = useState(null);
  const [replyText, setReplyText] = useState('');

  const getTrainerDetailsById = async (_id) => {
    try {
      handleLoading(true);
      const res = await TrainerApi.getSingleTrainer(_id);
      setTrainer(res?.data?.data);
    } catch (err) {
      toast.error('Failed to fetch trainer');
    } finally {
      handleLoading(false);
    }
  };

  const getTrainerReviewById = async (_id) => {
    try {
      handleLoading(true);
      const res = await TrainerApi.trainerReviewbyId(_id);
      setTrainerReviews(res?.data?.data);
    } catch (err) {
      toast.error('Failed to fetch reviews');
    } finally {
      handleLoading(false);
    }
  };

  const toggleHide = async (review) => {
    try {
      await RatingApi.toggleTrainerReviewVisibility(review._id);
      toast.success(review.is_hidden ? 'Review made visible' : 'Review hidden');
      getTrainerReviewById(_id);
    } catch (err) {
      toast.error('Failed to toggle visibility');
    }
  };

  const handleReply = (review) => {
    setCurrentReview(review);
    setReplyText(review.reply || '');
    setReplyModalOpen(true);
  };

  const handleReplySubmit = async () => {
    if (!replyText.trim()) return toast.error('Reply cannot be empty');

    try {
      await RatingApi.replyToTrainerReview(currentReview._id, { reply: replyText.trim() });
      toast.success('Reply added successfully');
      setReplyModalOpen(false);
      setReplyText('');
      setCurrentReview(null);
      getTrainerReviewById(_id);
    } catch {
      toast.error('Failed to add reply');
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) stars.push(<FaStar key={i} className='text-yellow-500' />);
      else if (i === fullStars && hasHalfStar)
        stars.push(<FaStarHalfAlt key={i} className='text-yellow-500' />);
      else stars.push(<FaRegStar key={i} className='text-yellow-300' />);
    }

    return <div className='flex items-center space-x-1'>{stars}</div>;
  };

  const columns = [
    {
      headerName: 'Review',
      field: 'review',
      minWidth: 250,
    },
    {
      headerName: 'Rating',
      field: 'rating',
      minWidth: 150,
      cellRenderer: (params) => renderStars(params.data.rating),
    },
    {
      headerName: 'User',
      field: 'user',
      minWidth: 200,
      cellRenderer: (params) => {
        const user = params.data.user;
        if (!user) return 'N/A';
        return (
          <div className='flex items-center space-x-2'>
            <img
              src={user.profile_image}
              alt='User'
              className='w-8 h-8 rounded-full object-cover'
            />
            <span>{`${user.first_name || ''} ${user.last_name || ''}`.trim()}</span>
          </div>
        );
      },
    },
    {
      headerName: 'Review Date',
      field: 'createdAt',
      minWidth: 150,
      cellRenderer: (params) => moment(params.data.createdAt).format('DD MMM YYYY, hh:mm A'),
    },
    {
      headerName: 'Actions',
      field: 'actions',
      minWidth: 150,
      cellRenderer: (params) => {
        const isHidden = params.data?.is_hidden;
        return (
          <div className='flex gap-4 items-center'>
            <FaReply
              className='text-blue-600 cursor-pointer'
              title='Reply'
              onClick={() => handleReply(params.data)}
            />
            {isHidden ? (
              <FaEye
                className='text-green-600 cursor-pointer'
                title='Unhide'
                onClick={() => toggleHide(params.data)}
              />
            ) : (
              <FaEyeSlash
                className='text-red-600 cursor-pointer'
                title='Hide'
                onClick={() => toggleHide(params.data)}
              />
            )}
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    getTrainerDetailsById(_id);
    getTrainerReviewById(_id);
  }, [_id]);

  if (!trainerReviews) return <div className='p-6'>Trainer not found.</div>;

  return (
    <div className='p-6'>
      <h2 className='text-3xl font-bold text-primary mb-4 flex items-center gap-2'>
        <SlArrowLeft
          size={18}
          onClick={() => navigate(`/ratings/trainers`)}
          className='cursor-pointer'
        />
        {trainer?.first_name}'s Reviews & Ratings
      </h2>

      <Table2
        column={columns}
        internalRowData={trainerReviews}
        sheetName={`${trainer?.first_name}-reviews`}
      />

      {replyModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30'>
          <div className='bg-white p-6 rounded-lg w-[90%] max-w-md shadow-lg'>
            <h2 className='text-xl font-semibold mb-4'>Reply to Review</h2>
            <textarea
              className='w-full border rounded p-2 h-32 resize-none focus:outline-none focus:ring'
              placeholder='Enter your reply...'
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <div className='flex justify-end mt-4 gap-2'>
              <button
                onClick={() => setReplyModalOpen(false)}
                className='px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 hover:shadow-xl'
              >
                Cancel
              </button>
              <button
                onClick={handleReplySubmit}
                className='px-4 py-2 bg-primary text-white rounded hover:shadow-xl'
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerReviewPage;

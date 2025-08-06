import React, { useEffect, useMemo, useState } from 'react';
import { ServiceApi } from '../../Api/Service.api';
import { useLoading } from '../../Components/loader/LoaderContext';
import { Table2 } from '../../Components/Table/Table2';
import { FaEye, FaEyeSlash, FaReply } from 'react-icons/fa';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { RatingApi } from '../../Api/Ratings.api';
import { toast } from 'react-toastify';

const SubscriptionRating = () => {
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [currentReview, setCurrentReview] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [allSubscriptionReviews, setAllSubscriptionReviews] = useState(null);
  // const [allSubServiceData, setAllSubServiceData] = useState(null);
  const [selectedRow, setSelectedRow] = useState();
  const [reviewOpen, setReviewOpen] = useState(false);
  const { handleLoading } = useLoading();

  const ReviewColumns = useMemo(
    () => [
      {
        headerName: 'Name',
        field: 'created_by.first_name',
        minWidth: 160,
        valueGetter: (params) => params.data?.created_by?.first_name?.trim() || 'N/A',
      },
      {
        headerName: 'Email',
        field: 'created_by.email',
        minWidth: 200,
        valueGetter: (params) => params.data?.created_by?.email || 'N/A',
      },
      // {
      //   headerName: 'Trainer Name',
      //   field: 'trainer.first_name',
      //   minWidth: 160,
      //   valueGetter: (params) =>
      //     params.data?.trainer?.first_name?.trim() || 'N/A',
      // },
      // {
      //   headerName: 'Trainer Email',
      //   field: 'trainer.email',
      //   minWidth: 200,
      //   valueGetter: (params) => params.data?.trainer?.email || 'N/A',
      // },
      {
        headerName: 'Subscription',
        field: 'subscriptionId.name',
        minWidth: 200,
        valueGetter: (params) => params.data?.subscriptionId?.name || 'N/A',
      },
      // {
      //   headerName: 'Subscription Location',
      //   field: 'subscriptionId.streetName',
      //   minWidth: 150,
      //   valueGetter: (params) =>
      //     params.data?.subscriptionId?.streetName || 'N/A',
      // },
      // {
      //   headerName: 'Session',
      //   field: 'subscriptionId.sessionType',
      //   minWidth: 180,
      //   valueGetter: (params) =>
      //     params.data?.subscriptionId?.sessionType || 'N/A',
      // },
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
        cellRenderer: (params) => {
          const date = new Date(params.value);
          return date.toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          }); // Example: "06 Aug 2025, 11:45 AM"
        },
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
    ],
    []
  );

  const handleReply = (rowData) => {
  setCurrentReview(rowData);
  setReplyText(rowData.reply || '');
  setReplyModalOpen(true);
};

const handleReplySubmit = async () => {
  try {
    await RatingApi.replyToSubscriptionReview(currentReview._id, { reply: replyText });
    toast.success('Reply submitted successfully');
    setReplyModalOpen(false);
    setCurrentReview(null);
    setReplyText('');
    getAllSubscriptionReviews();
  } catch (error) {
    console.error('Reply failed', error);
    toast.error('Failed to submit reply');
  }
};



  const toggleHide = async (rowData) => {
    try {
      await RatingApi.toggleSubscriptionReviewVisibility(rowData._id);
      toast.success(`Review ${rowData.is_hidden ? 'unhidden' : 'hidden'} successfully`);
      getAllSubscriptionReviews();
    } catch (error) {
      console.error('Hide/unhide failed', error);
      toast.error('Failed to update visibility');
    }
  };

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
      {replyModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/10">
    <div className="bg-white p-6 rounded-lg w-[90%] max-w-md shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Reply to Review</h2>
      <textarea
        className="w-full border rounded p-2 h-32 resize-none focus:outline-none focus:ring"
        placeholder="Enter your reply..."
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
      />
      <div className="flex justify-end mt-4 gap-2">
        <button
          onClick={() => setReplyModalOpen(false)}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 hover:shadow-xl"
        >
          Cancel
        </button>
        <button
          onClick={handleReplySubmit}
          className="px-4 py-2 bg-primary text-white rounded hover:shadow-xl"
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

export default SubscriptionRating;

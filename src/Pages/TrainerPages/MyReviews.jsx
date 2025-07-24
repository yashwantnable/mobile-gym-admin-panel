import React, { useEffect, useState } from 'react';
import { TrainerApi } from '../../Api/Trainer.api';
import { useLoading } from '../../Components/loader/LoaderContext';
import { FaStar, FaRegStar, FaStarHalfAlt, FaUserCircle } from 'react-icons/fa';

const MyReviews = () => {
    const { handleLoading } = useLoading();
    const [trainerReviews, setTrainerReviews] = useState([]);

    const getTrainerReviews = async () => {
        handleLoading(true);
        try {
            const res = await TrainerApi.trainerReview();
            setTrainerReviews(res?.data?.data || []);
        } catch (err) {
            console.error("Error fetching reviews:", err);
        } finally {
            handleLoading(false);
        }
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(<FaStar key={i} className="text-yellow-400" />);
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
            } else {
                stars.push(<FaRegStar key={i} className="text-yellow-400" />);
            }
        }
        return stars;
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    useEffect(() => {
        getTrainerReviews();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 text-center">
                <h2 className='text-4xl font-bold text-primary'>My Reviews</h2>
                <p className="text-gray-600">What clients say about your training</p>
            </div>

            {trainerReviews.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                    <p className="text-gray-500 text-lg">No reviews yet</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {trainerReviews.map((review) => (
                        <div 
                            key={review._id} 
                            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100"
                        >
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        {review.created_by?.profile_image ? (
                                            <img 
                                                src={review.created_by.profile_image} 
                                                alt={`${review.created_by.first_name} ${review.created_by.last_name}`}
                                                className="w-10 h-10 rounded-full object-cover"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'block';
                                                }}
                                            />
                                        ) : (
                                            <FaUserCircle className="w-10 h-10 text-gray-400" />
                                        )}
                                        <div>
                                            <h3 className="font-semibold text-gray-800">
                                                {review.created_by?.first_name || 'Anonymous'} {review.created_by?.last_name}
                                            </h3>
                                            <p className="text-xs text-gray-500">
                                                {formatDate(review.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center bg-yellow-50 px-2 py-1 rounded">
                                        <div className="flex mr-1">
                                            {renderStars(review.rating)}
                                        </div>
                                        <span className="text-sm font-medium text-yellow-600">
                                            {review.rating.toFixed(1)}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="mt-4 pl-1">
                                    <p className="text-gray-700 italic">"{review.review}"</p>
                                </div>

                                {review.updated_by && (
                                    <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500">
                                        <p>Updated: {formatDate(review.updatedAt)}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyReviews;
import Api from '../Middleware/axios'

export const RatingApi = {
    getAllTrainerRatings: () => Api.get("/user/get-all-trainer-reviews"),
    getAllSubscriptionReview: () => Api.get(`/user/get-all-subscription-rating-review`),
    getSubscriptionReviewById: (subsciptionId) => Api.get(`/user/get-all-subscription-rating-review/${subsciptionId}`),

    replyToSubscriptionReview: (reviewId,payload) => Api.post(`/user/reply-subscription-review/${reviewId}`,payload),
    toggleSubscriptionReviewVisibility: (reviewId) => Api.put(`/user/review-subscription-visibility/${reviewId}`),
    
    toggleTrainerReviewVisibility: (reviewId) => Api.put(`/user/admin-hide-trainer-review/${reviewId}`),
    replyToTrainerReview: (reviewId,payload) => Api.post(`/user/admin-reply-trainer-review/${reviewId}`,payload),

    // replyToSubscriptionReview: (reviewId,payload) => Api.get(`/user/reply-subscription-review/${reviewId}`,payload),
    // toggleSubscriptionReviewVisibility: (reviewId) => Api.get(`/user/review-subscription-visibility/${reviewId}`),
}
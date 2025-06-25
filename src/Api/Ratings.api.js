import Api from '../Middleware/axios'

export const RatingApi = {
    getAllTrainerRatings: () => Api.get("/user/get-all-trainer-reviews"),
    getAllSubscriptionReview: () => Api.get(`/user/get-all-subscription-rating-review`),
    getSubscriptionReviewById: (subsciptionId) => Api.get(`/user/get-all-subscription-rating-review/${subsciptionId}`),
}
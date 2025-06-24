import Api from '../Middleware/axios'

export const RatingApi = {
    getAllTrainerRatings: () => Api.get("/user/get-all-trainer-reviews"),
    getAllServiceReview: () => Api.get(`/user/get-all-subscription-rating-review`),
    getServiceReviewbySubsciptionId: (subsciptionId) => Api.get(`/user/get-all-subscription-rating-review/${subsciptionId}`),
}
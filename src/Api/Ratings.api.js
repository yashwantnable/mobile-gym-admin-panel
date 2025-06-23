import Api from '../Middleware/axios'

export const RatingApi = {
    getAllTrainerRatings: () => Api.get("/user/get-all-trainer-reviews"),

    getAllServiceReview: (subserviceId) => Api.get(`/admin/get-all-subservice-rating-review/${subserviceId}`),
}
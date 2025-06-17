import Api from '../Middleware/axios'

export const RatingApi = {
    getAllGroomerRatings: () => Api.get("/user/get-all-groomer-reviews"),

    getAllServiceReview: (subserviceId) => Api.get(`/admin/get-all-subservice-rating-review/${subserviceId}`),
}
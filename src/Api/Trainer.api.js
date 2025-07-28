import Api from '../Middleware/axios';

export const TrainerApi = {
  getAllTrainers: () => Api.get('trainer/get-all-trainers'),
  getTrainerStats: () => Api.get('subscription/trainer-class-stats' ),
  getAllTrainerReviews: () => Api.get('/user/get-all-trainer-reviews' ),
  getTrainerByDate: (payload) => Api.post('timeslot/getFreeTrainers', payload),
  createTrainer: (payload) => Api.post('/trainer/create-trainer', payload),
  updateTrainer: (id, payload) => Api.put(`/trainer/update-trainer/${id}`, payload),
  getSingleTrainer: (id) => Api.get(`/trainer/get-trainerBy-id/${id}`),
  DeleteTrainer: (id, payload) => Api.delete(`/trainer/delete-trainer/${id}`, payload),
  trainerReview: () => Api.get(`user/trainer/my-reviews`),
  trainerReviewbyId: (id) => Api.get(`user/get-trainer-review/${id}`),
  
  getAvailableTrainer: (payload) => Api.post('/admin/get-all-available-trainers-booking', payload),
  getAvailableTrainer: (payload) => Api.put('trainer/update-trainer-profiles/:id', payload),

  trainerProfileUpdate: (payload) => Api.put('user/update-user', payload),

  trainerCheckIn: (subscriptionId,payload) => Api.post  (`subscription/subscription-check-in/${subscriptionId}`,payload),
  trainerCheckOut: (subscriptionId,payload) => Api.post  (`subscription/subscription-check-out/${subscriptionId}`,payload),


  // updateSubscriptionStatusByTrainer:(subscriptionId,payload)=> Api.post()
};

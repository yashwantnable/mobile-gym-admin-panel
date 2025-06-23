import Api from '../Middleware/axios';

export const TrainerApi = {
  getAllTrainers: (payload) => Api.get('/trainer/get-all-trainers', payload),
  getTrainerByDate: (payload) => Api.post('timeslot/getFreeTrainers', payload),
  createTrainer: (payload) => Api.post('/trainer/create-trainer', payload),
  updateTrainer: (id, payload) => Api.put(`/trainer/update-trainer/${id}`, payload),
  getSingleTrainer: (id) => Api.get(`/trainer/get-trainerby-id/${id}`),
  DeleteTrainer: (id, payload) => Api.delete(`/trainer/delete-trainer/${id}`, payload),

  getAvailableTrainer: (payload) => Api.post('/admin/get-all-available-trainers-booking', payload),
};

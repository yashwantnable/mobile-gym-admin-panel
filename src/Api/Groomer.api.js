import Api from '../Middleware/axios';

export const GroomerApi = {
  getAllGroomers: (payload) => Api.get('/groomer/get-all-groomers', payload),
  getGroomerByDate: (payload) => Api.post('timeslot/getFreeGroomers', payload),
  createGroomer: (payload) => Api.post('/groomer/create-groomer', payload),
  updateGroomer: (id, payload) => Api.put(`/groomer/update-groomer/${id}`, payload),
  getSingleGroomer: (id, payload) => Api.get(`/groomer/get-groomerby-id/${id}`, payload),
  DeleteGroomer: (id, payload) => Api.delete(`/groomer/delete-groomer/${id}`, payload),

  getAvailableGroomer: (payload) => Api.post('/admin/get-all-available-groomers-booking', payload),
};

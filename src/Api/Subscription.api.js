import Api from '../Middleware/axios';

export const SubscriptionApi = {
  getAllSubscription: (payload) => Api.post('/subscription/get-all-subscription', payload),
  createSubscription: (payload) => Api.post('/subscription/create-subscription', payload),
  updateSubscription: (id, payload) => Api.put(`/subscription/update-subscription/${id}`, payload),
  getSingleSubscription: (id) => Api.get(`/subscription/get-subscription-by-id/${id}`),
  DeleteSubscription: (id, payload) => Api.delete(`/subscription/delete-subscription/${id}`, payload),
};

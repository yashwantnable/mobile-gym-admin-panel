import Api from '../Middleware/axios';

export const SubscriptionApi = {
  getAllSubscription: (exipred,payload) => Api.post(`/subscription/get-all-subscription?isExpired=${exipred}`, payload),
  getAllSubscriptionFilter: (payload) => Api.post(`/subscription//get-subscriptions-filter`, payload),
  createSubscription: (payload) => Api.post('/subscription/create-subscription', payload),
  updateSubscription: (id, payload) => Api.put(`/subscription/update-subscription/${id}`, payload),
  getSingleSubscription: (id) => Api.get(`/subscription/get-subscription-by-id/${id}`),
  getSubscriptionByCatId: (id) => Api.get(`/subscription/get-subscription-by-category-id/${id}`),
  DeleteSubscription: (id, payload) => Api.delete(`/subscription/delete-subscription/${id}`, payload),
  DeleteSubscription: (id, payload) => Api.delete(`/subscription/delete-subscription/${id}`, payload),
  SubscriptionByTrainerId: (trainerId,expired) => Api.get(`/subscription/get-subscriptions-by-trainer/${trainerId}?isExpired=${expired}`),
};
export const PackageApi = {
  getAllPackage: (payload) => Api.post(`/package/get-all-packages?`, payload),
  createPackage: (payload) => Api.post('/package/create-package', payload),
  updatePackage: (id, payload) => Api.put(`/package/update-package/${id}`, payload),
  getSinglePackage: (id) => Api.get(`/package/get-package-by-id/${id}`),
  getPackageByCatId: (id) => Api.get(`/package/get-Package-by-category-id/${id}`),
  DeletePackage: (id, payload) => Api.delete(`/package/delete-package/${id}`, payload),
};

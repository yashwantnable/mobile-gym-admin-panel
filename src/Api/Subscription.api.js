import Api from '../Middleware/axios';

export const SubscriptionApi = {
  getAllSubscription: (exipred,payload) => Api.post(`/subscription/get-all-subscription?isExpired=${exipred}`, payload),
  createSubscription: (payload) => Api.post('/subscription/create-subscription', payload),
  updateSubscription: (id, payload) => Api.put(`/subscription/update-subscription/${id}`, payload),
  getSingleSubscription: (id) => Api.get(`/subscription/get-subscription-by-id/${id}`),
  getSubscriptionByCatId: (id) => Api.get(`/subscription/get-subscription-by-category-id/${id}`),
  DeleteSubscription: (id, payload) => Api.delete(`/subscription/delete-subscription/${id}`, payload),
};
export const PackageApi = {
  getAllPackage: (exipred,payload) => Api.post(`/Package/get-all-Package?isExpired=${exipred}`, payload),
  createPackage: (payload) => Api.post('/Package/create-Package', payload),
  updatePackage: (id, payload) => Api.put(`/Package/update-Package/${id}`, payload),
  getSinglePackage: (id) => Api.get(`/Package/get-Package-by-id/${id}`),
  getPackageByCatId: (id) => Api.get(`/Package/get-Package-by-category-id/${id}`),
  DeletePackage: (id, payload) => Api.delete(`/Package/delete-Package/${id}`, payload),
};

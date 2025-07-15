import Api from '../Middleware/axios'

export const CustomerApi = {
    create: (payload) => Api.post('/admin/create-pet', payload),
    getAllCustomer: (payload) => Api.get('user/get-all-user', payload),
    getUserSubscription: (id) => Api.get(`booking/subscriptions-by-user-id/${id}`),
    getUserPackage: (id) => Api.get(`package-booking/get-package-booking-by-user-id/${id}`),
    getAllUser: () => Api.get('/user/get-all-user'),
};
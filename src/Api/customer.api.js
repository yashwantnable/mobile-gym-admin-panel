import Api from '../Middleware/axios'

export const CustomerApi = {
    create: (payload) => Api.post('/admin/create-pet', payload),
    getAllCustomer: (payload) => Api.get('user/get-all-user', payload),
    getUserSubscription: (id) => Api.get(`booking/subscriptions-by-user-id/${id}`),
    getAllUser: () => Api.get('/user/get-all-user'),
};
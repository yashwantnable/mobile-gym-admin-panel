import Api from '../Middleware/axios';

export const OrderApi = {
  createBooking: (payload) => Api.post('/booking/create-manual-booking', payload),
  updateOrder: (payload) => Api.put(`order/update-order`, payload),
  getAllOrders: () => Api.get(`admin/get-all-orders`),
  deleteBooking: (id) => Api.delete(`booking/delete-booking/${id}`),
};

import Api from "../Middleware/axios";

export const BookingApi = {
  createBooking: (payload) =>
    Api.post("/booking/create-manual-booking", payload),
  // createGroomer: (payload) => Api.post('/groomer/create-groomer', payload),
  updateBooking: (id, payload) =>
    Api.put(`booking/update-booking/${id}`, payload),
  getAllBooking: () => Api.get(`booking/get-all-bookings`),
  deleteBooking: (id) => Api.delete(`booking/delete-booking/${id}`),
};

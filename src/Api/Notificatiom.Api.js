import Api from '../Middleware/axios'

export const NotificationApi = {
  getAllNotification: () => Api.get("user/get-all-notification"),
  updateNotification: (id,payload) => Api.put(`/user/update-notification/${id}`,payload),
  updateAllNotification: () => Api.put(`/user/update-all-notification`),
//   petbreed: () => Api.get("/breed/get-all-breed"),
//   city: (id) => Api.get(`master/get-all-city/${id}`),
//   getAllCurrencies: () => Api.get("currency/get-all-currencies"),
};

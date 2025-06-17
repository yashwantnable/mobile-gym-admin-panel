import Api from "../Middleware/axios";

export const ServiceApi = {
  // Service type apis
  serviceType: () => Api.get("master/get-all-services"),
  createServiceType: (payload) => Api.post("master/create-service", payload),
  updateServiceType: (id, payload) =>
    Api.put(`master/update-service/${id}`, payload),
  deleteServiceType: (id) => Api.delete(`master/delete-service/${id}`),

  // Service apis

  service: () => Api.post("subservice/getAllSubService"),
  singleService: (id) => Api.get(`subservice/getSubServiceById/${id}`),
  createService: (payload) => Api.post("subservice/createSubService", payload),
  updateService: (id, payload) =>
    Api.put(`/subservice/updateSubService/${id}`, payload),
  deleteService: (id) => Api.delete(`/subservice/deleteSubService/${id}`),

  getSubServiceByServiceId: (payload) =>
    Api.post(`/subservice/getAllSubService`, payload),
 
};

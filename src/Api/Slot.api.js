import Api from "../Middleware/axios";

export const SlotApi = {
  // Service type apis
  createSlot: (payload) => Api.post("/timeslot/createTimeslot", payload),
  getAllSlot: (payload) => Api.post(`timeslot/getAllTimeslots`, payload),
  getAllAvailableSlot: (id,payload) => Api.post(`timeslot/getAvailableTimeSlots/${id}`, payload),

  getSlotBySubservice: (payload) =>
    Api.post(`admin/get-planner-dashboard`, payload),
  updateServiceType: (id, payload) =>
    Api.put(`master/update-service/${id}`, payload),
  deleteServiceType: (id) => Api.delete(`master/delete-service/${id}`),

  // Service apis

  service: () => Api.post("subservice/findAllSubService"),
  singleService: (id) => Api.get(`subservice/findSubServiceById/${id}`),
  createService: (payload) => Api.post("subservice/createSubService", payload),
  updateService: (id, payload) =>
    Api.put(`/subservice/updateSubService/${id}`, payload),
  deleteService: (id) => Api.delete(`/subservice/deleteSubService/${id}`),

  markHoliday: (payload) => Api.post("/timeslot/markOfficeHoliday", payload),
  deleteTimeSlot: (id) => Api.delete(`timeslot/deleteTimeslot/${id}`),
};

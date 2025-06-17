import Api from "../Middleware/axios";

export const DashboardApi = {
  getDashboardData: () => Api.get("admin/get-dashboard-details"),
  getPetCount: () => Api.get("admin/get-pet-count-by-type"),
  getMonthlyAppointments: () => Api.get("admin/get-month-wise-data"),
  getGroomerByDate: (payload) => Api.post("timeslot/getFreeGroomers", payload),
  createGroomer: (payload) => Api.post("/groomer/create-groomer", payload),
  updateGroomer: (id, payload) =>
    Api.put(`/groomer/update-groomer/${id}`, payload),
  getSingleGroomer: (id, payload) =>
    Api.get(`/groomer/get-groomerby-id/${id}`, payload),
  DeleteGroomer: (id, payload) =>
    Api.delete(`/groomer/delete-groomer/${id}`, payload),
};

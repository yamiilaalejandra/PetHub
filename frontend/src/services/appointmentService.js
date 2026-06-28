import { api } from "./api";

export const appointmentService = {
  async getAppointments() {
    return api.getTurnos();
  },

  async getAppointmentById(id) {
    return api.request(`/api/turnos/${id}`);
  },

  async getAppointmentHistory(params = {}) {
    const query = new URLSearchParams(params).toString();
    return api.request(`/api/turnos/history${query ? `?${query}` : ""}`);
  },

  async updateAppointment(id, payload) {
    return api.request(`/api/turnos/${id}`, "PUT", payload);
  },
};

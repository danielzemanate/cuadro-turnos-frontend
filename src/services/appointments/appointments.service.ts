import {
  IAppointmentsFilters,
  ICancelAppointmentPayload,
  ICreateAppointmentPayload,
  IRescheduleAppointmentPayload,
} from "../../interfaces/appointments";
import api from "../../lib/api";

const APPOINTMENTS_BASE = import.meta.env.VITE_APP_BACK_APPOINTMENTS;

const buildQuery = (filters: IAppointmentsFilters): string => {
  const entries = Object.entries(filters).filter(
    ([, value]) => value !== null && value !== undefined && value !== "",
  );
  return new URLSearchParams(
    entries.map(([key, value]) => [key, String(value)]),
  ).toString();
};

const AppointmentsService = {
  getAppointments: async (filters: IAppointmentsFilters) => {
    const query = buildQuery(filters);
    return await api.get(
      `${APPOINTMENTS_BASE}api/citas/agenda${query ? `?${query}` : ""}`,
    );
  },

  createAppointment: async (data: ICreateAppointmentPayload) => {
    return await api.post(`${APPOINTMENTS_BASE}api/agendar`, data);
  },

  cancelAppointment: async (
    citaId: number,
    data: ICancelAppointmentPayload,
  ) => {
    return await api.post(
      `${APPOINTMENTS_BASE}api/citas/${citaId}/cancelar`,
      data,
    );
  },

  rescheduleAppointment: async (
    citaId: number,
    data: IRescheduleAppointmentPayload,
  ) => {
    return await api.post(
      `${APPOINTMENTS_BASE}api/citas/${citaId}/reprogramar`,
      data,
    );
  },
};

export default AppointmentsService;

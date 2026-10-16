import {
  ICreateVacationPayload,
  IResolveVacationPayload,
  IVacationAlertsFilters,
  IVacationListFilters,
} from "../../interfaces/vacations";
import api from "../../lib/api";

const VACATIONS_BASE = `${import.meta.env.VITE_APP_BACK_ESE}api/vacaciones`;

const bearerHeaders = (accessToken: string) => ({
  Authorization: `Bearer ${accessToken}`,
});

const buildQuery = (
  filters: IVacationListFilters | IVacationAlertsFilters,
): string => {
  const entries = Object.entries(filters).filter(
    ([, value]) => value !== null && value !== undefined && value !== "",
  );
  return new URLSearchParams(
    entries.map(([key, value]) => [key, String(value)]),
  ).toString();
};

const VacationsService = {
  getOptions: async (accessToken: string) => {
    return await api.get(`${VACATIONS_BASE}/opciones`, {
      headers: bearerHeaders(accessToken),
    });
  },

  getVacations: async (filters: IVacationListFilters, accessToken: string) => {
    const query = buildQuery(filters);
    return await api.get(`${VACATIONS_BASE}${query ? `?${query}` : ""}`, {
      headers: bearerHeaders(accessToken),
    });
  },

  getVacation: async (solicitudId: number, accessToken: string) => {
    return await api.get(`${VACATIONS_BASE}/${solicitudId}`, {
      headers: bearerHeaders(accessToken),
    });
  },

  createVacation: async (data: ICreateVacationPayload, accessToken: string) => {
    return await api.post(`${VACATIONS_BASE}`, data, {
      headers: bearerHeaders(accessToken),
    });
  },

  resolveVacation: async (
    solicitudId: number,
    data: IResolveVacationPayload,
    accessToken: string,
  ) => {
    return await api.patch(`${VACATIONS_BASE}/${solicitudId}/resolver`, data, {
      headers: bearerHeaders(accessToken),
    });
  },

  getAlerts: async (filters: IVacationAlertsFilters, accessToken: string) => {
    const query = buildQuery(filters);
    return await api.get(
      `${VACATIONS_BASE}/alertas${query ? `?${query}` : ""}`,
      { headers: bearerHeaders(accessToken) },
    );
  },
};

export default VacationsService;

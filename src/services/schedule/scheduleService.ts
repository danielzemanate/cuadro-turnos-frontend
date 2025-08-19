import { IScheduleMonthParams } from "../../interfaces/schedule";
import api from "../../lib/api";

const ScheduleService = {
  getOptions: async () => {
    return await api.get(
      `${import.meta.env.VITE_APP_BACK_ESE}api/cuadros/opciones`,
    );
  },
  getSchedulesByMonth: async (params: IScheduleMonthParams) => {
    return await api.get(
      `${import.meta.env.VITE_APP_BACK_ESE}api/cuadros/cuadros-mes`,
      { params },
    );
  },
};

export default ScheduleService;

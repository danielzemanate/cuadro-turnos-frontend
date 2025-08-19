import { constants } from "../../types/types";
import { IOptionsResponse, IScheduleResponse } from "../../interfaces/schedule";

export interface IScheduleState {
  options: IOptionsResponse | null;
  monthData: IScheduleResponse | null;
}

const initialState: IScheduleState = {
  options: null,
  monthData: null,
};

export type IScheduleActions =
  | {
      type: typeof constants.scheduleSetOptions;
      payload: IOptionsResponse;
    }
  | {
      type: typeof constants.scheduleClearOptions;
    }
  | {
      type: typeof constants.scheduleSetMonth;
      payload: IScheduleResponse;
    }
  | {
      type: typeof constants.scheduleClearMonth;
    };

export const scheduleReducer = (
  state: IScheduleState = initialState,
  action: IScheduleActions,
): IScheduleState => {
  const { type } = action;

  switch (type) {
    case constants.scheduleSetOptions:
      return { ...state, options: action.payload };

    case constants.scheduleClearOptions:
      return { ...state, options: null };

    case constants.scheduleSetMonth:
      return { ...state, monthData: action.payload };

    case constants.scheduleClearMonth:
      return { ...state, monthData: null };

    default:
      return state;
  }
};

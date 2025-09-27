import { constants } from "../../types/types";
import {
  IOptionsResponse,
  IScheduleResponse,
  IAttentionTypesResponse,
  ISiauTypesResponse,
} from "../../interfaces/schedule";

export interface IScheduleState {
  options: IOptionsResponse | null; // único store para opciones (normales o editables)
  monthData: IScheduleResponse | null;
  attentionTypes: IAttentionTypesResponse[] | null;
  siauTypes: ISiauTypesResponse[] | null;
}

const initialState: IScheduleState = {
  options: null,
  monthData: null,
  attentionTypes: null,
  siauTypes: null,
};

export type IScheduleActions =
  | {
      type:
        | typeof constants.scheduleSetOptions
        | typeof constants.scheduleSetEditableOptions;
      payload: IOptionsResponse;
    }
  | {
      type:
        | typeof constants.scheduleClearOptions
        | typeof constants.scheduleClearEditableOptions;
    }
  | {
      type: typeof constants.scheduleSetMonth;
      payload: IScheduleResponse;
    }
  | {
      type: typeof constants.scheduleClearMonth;
    }
  | {
      type: typeof constants.scheduleSetAttentionTypes;
      payload: IAttentionTypesResponse[];
    }
  | {
      type: typeof constants.scheduleClearAttentionTypes;
    }
  | {
      type: typeof constants.scheduleSetSiauTypes;
      payload: ISiauTypesResponse[];
    }
  | {
      type: typeof constants.scheduleClearSiauTypes;
    };

export const scheduleReducer = (
  state: IScheduleState = initialState,
  action: IScheduleActions,
): IScheduleState => {
  switch (action.type) {
    // Unificados: setOptions y setEditableOptions
    case constants.scheduleSetOptions:
    case constants.scheduleSetEditableOptions:
      return { ...state, options: action.payload };

    // Unificados: clearOptions y clearEditableOptions
    case constants.scheduleClearOptions:
    case constants.scheduleClearEditableOptions:
      return { ...state, options: null };

    case constants.scheduleSetMonth:
      return { ...state, monthData: action.payload };

    case constants.scheduleClearMonth:
      return { ...state, monthData: null };

    case constants.scheduleSetAttentionTypes:
      return { ...state, attentionTypes: action.payload };

    case constants.scheduleClearAttentionTypes:
      return { ...state, attentionTypes: null };

    //SIAU TYPES
    case constants.scheduleSetSiauTypes:
      return { ...state, siauTypes: action.payload };

    case constants.scheduleClearSiauTypes:
      return { ...state, siauTypes: null };
    default:
      return state;
  }
};

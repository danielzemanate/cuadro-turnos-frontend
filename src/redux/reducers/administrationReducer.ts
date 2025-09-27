import { constants } from "./../../types/types";
import { IRoles } from "../../interfaces/user";
import {
  IConfigAttentionTypes,
  IPersonalType,
} from "../../interfaces/administration";

export interface AdministrationState {
  roles: IRoles[] | null;
  attentionTypes: IConfigAttentionTypes[] | null;
  personalTypes: IPersonalType[] | null;
}

const initialState: AdministrationState = {
  roles: null,
  attentionTypes: null,
  personalTypes: null,
};

export type AdministrationActions =
  | { type: typeof constants.administrationSetRoles; payload: IRoles[] }
  | { type: typeof constants.administrationClearRoles }
  | {
      type: typeof constants.administrationSetAttentionTypes;
      payload: IConfigAttentionTypes[];
    }
  | { type: typeof constants.administrationClearAttentionTypes }
  | {
      type: typeof constants.administrationSetPersonalTypes;
      payload: IPersonalType[];
    } // NUEVO
  | { type: typeof constants.administrationClearPersonalTypes };

export const administrationReducer = (
  state: AdministrationState = initialState,
  action: AdministrationActions,
): AdministrationState => {
  switch (action.type) {
    case constants.administrationSetRoles:
      return { ...state, roles: action.payload };
    case constants.administrationClearRoles:
      return { ...state, roles: null };

    case constants.administrationSetAttentionTypes:
      return { ...state, attentionTypes: action.payload };
    case constants.administrationClearAttentionTypes:
      return { ...state, attentionTypes: null };

    case constants.administrationSetPersonalTypes:
      return { ...state, personalTypes: action.payload };
    case constants.administrationClearPersonalTypes:
      return { ...state, personalTypes: null };

    default:
      return state;
  }
};

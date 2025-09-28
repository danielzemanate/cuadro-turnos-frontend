import { constants } from "./../../types/types";
import { IRoles } from "../../interfaces/user";
import {
  IConfigAttentionTypes,
  IPersonalType,
  IMunicipio,
  IUserListItem,
} from "../../interfaces/administration";

export interface AdministrationState {
  roles: IRoles[] | null;
  attentionTypes: IConfigAttentionTypes[] | null;
  personalTypes: IPersonalType[] | null;
  municipios?: IMunicipio[] | null;
  users?: IUserListItem[] | null;
}

const initialState: AdministrationState = {
  roles: null,
  attentionTypes: null,
  personalTypes: null,
  municipios: null,
  users: null,
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
    }
  | { type: typeof constants.administrationClearPersonalTypes }
  // ======= NUEVOS TIPOS DE ACCIÓN =======
  | {
      type: typeof constants.administrationSetMunicipios;
      payload: IMunicipio[];
    }
  | { type: typeof constants.administrationClearMunicipios }
  | {
      type: typeof constants.administrationSetUsers;
      payload: IUserListItem[];
    }
  | { type: typeof constants.administrationClearUsers };

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

    case constants.administrationSetMunicipios:
      return { ...state, municipios: action.payload };
    case constants.administrationClearMunicipios:
      return { ...state, municipios: null };

    case constants.administrationSetUsers:
      return { ...state, users: action.payload };
    case constants.administrationClearUsers:
      return { ...state, users: null };

    default:
      return state;
  }
};

import { constants } from "./../../types/types";
import { SpecialPermitApprover } from "../../interfaces/users-config.interface";

export interface UsersConfigState {
  specialPermitApprovers: SpecialPermitApprover[] | null;
}

const initialState: UsersConfigState = {
  specialPermitApprovers: null,
};

export type UsersConfigActions =
  | {
      type: typeof constants.usersConfigSetSpecialPermitApprovers;
      payload: SpecialPermitApprover[];
    }
  | { type: typeof constants.usersConfigClearSpecialPermitApprovers };

export const usersConfigReducer = (
  state: UsersConfigState = initialState,
  action: UsersConfigActions,
): UsersConfigState => {
  switch (action.type) {
    case constants.usersConfigSetSpecialPermitApprovers:
      return { ...state, specialPermitApprovers: action.payload };
    case constants.usersConfigClearSpecialPermitApprovers:
      return { ...state, specialPermitApprovers: null };
    default:
      return state;
  }
};

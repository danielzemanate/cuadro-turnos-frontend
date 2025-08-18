import { IUserActions, IUserInfo, IUserState } from "../../interfaces/user";
import { constants } from "../../types/types";

const initialState: IUserState = {
  userData: null,
};

export const userReducer = (
  state = initialState,
  action: IUserActions,
): IUserState => {
  const { type, payload } = action;
  switch (type) {
    case constants.setUserInfo:
      return { ...state, userData: payload as IUserInfo | null };
    case constants.logoutUser:
      return initialState;
    default:
      return state;
  }
};

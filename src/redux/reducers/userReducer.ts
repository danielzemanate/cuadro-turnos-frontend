import { IUserActions, IUserInfo, IUserState } from "../../interfaces/user";
import { constants } from "../../types/types";

const initialState: IUserState = {
  user: null,
};

export const userReducer = (
  state = initialState,
  action: IUserActions,
): IUserState => {
  const { type, payload } = action;
  switch (type) {
    case constants.setUserInfo:
      return {
        ...state,
        user: payload as IUserInfo | null,
      };
    default:
      return state;
  }
};

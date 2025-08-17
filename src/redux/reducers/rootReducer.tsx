import { combineReducers, Reducer } from "redux";
import { IUserActions, IUserState } from "../../interfaces/user";
import { userReducer } from "./userReducer";
import { helpersReducer, IHelpersState } from "./helpersReducer";
import { IHelpersActions } from "../../interfaces/helpers";

export interface AppState {
  helpers?: IHelpersState;
  user?: IUserState;
}

const rootReducer: Reducer<AppState, IHelpersActions | IUserActions> =
  combineReducers({
    helpers: helpersReducer,
    user: userReducer,
  });

export default rootReducer;

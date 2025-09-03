import { combineReducers, Reducer } from "redux";
import { IUserActions, IUserState } from "../../interfaces/user";
import { userReducer } from "./userReducer";
import { helpersReducer, IHelpersState } from "./helpersReducer";
import { IHelpersActions } from "../../interfaces/helpers";
import {
  IScheduleActions,
  IScheduleState,
  scheduleReducer,
} from "./scheduleReducer";
import {
  UsersConfigActions,
  usersConfigReducer,
  UsersConfigState,
} from "./usersConfigReducer";

export interface AppState {
  helpers?: IHelpersState;
  user?: IUserState;
  schedule?: IScheduleState;
  usersConfig?: UsersConfigState;
}

const rootReducer: Reducer<
  AppState,
  IHelpersActions | IUserActions | IScheduleActions | UsersConfigActions
> = combineReducers({
  helpers: helpersReducer,
  user: userReducer,
  schedule: scheduleReducer,
  usersConfig: usersConfigReducer,
});

export default rootReducer;

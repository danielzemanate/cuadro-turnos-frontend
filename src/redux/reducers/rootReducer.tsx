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
import {
  AdministrationActions,
  administrationReducer,
  AdministrationState,
} from "./administrationReducer";

export interface AppState {
  helpers?: IHelpersState;
  user?: IUserState;
  schedule?: IScheduleState;
  usersConfig?: UsersConfigState;
  administration?: AdministrationState;
}

const rootReducer: Reducer<
  AppState,
  | IHelpersActions
  | IUserActions
  | IScheduleActions
  | UsersConfigActions
  | AdministrationActions
> = combineReducers({
  helpers: helpersReducer,
  user: userReducer,
  schedule: scheduleReducer,
  usersConfig: usersConfigReducer,
  administration: administrationReducer,
});

export default rootReducer;

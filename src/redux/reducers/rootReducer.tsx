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
import {
  IReportsActions,
  IReportsState,
  reportsReducer,
} from "./reportsReducer";

export interface AppState {
  helpers?: IHelpersState;
  user?: IUserState;
  schedule?: IScheduleState;
  usersConfig?: UsersConfigState;
  administration?: AdministrationState;
  reports?: IReportsState;
}

const rootReducer: Reducer<
  AppState,
  | IHelpersActions
  | IUserActions
  | IScheduleActions
  | UsersConfigActions
  | AdministrationActions
  | IReportsActions
> = combineReducers({
  helpers: helpersReducer,
  user: userReducer,
  schedule: scheduleReducer,
  usersConfig: usersConfigReducer,
  administration: administrationReducer,
  reports: reportsReducer,
});

export default rootReducer;

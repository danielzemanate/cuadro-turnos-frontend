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

export interface AppState {
  helpers?: IHelpersState;
  user?: IUserState;
  schedule?: IScheduleState;
}

const rootReducer: Reducer<
  AppState,
  IHelpersActions | IUserActions | IScheduleActions
> = combineReducers({
  helpers: helpersReducer,
  user: userReducer,
  schedule: scheduleReducer,
});

export default rootReducer;

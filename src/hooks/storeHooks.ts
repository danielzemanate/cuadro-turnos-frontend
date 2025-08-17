import * as redux from "redux";
import * as reduxThunk from "redux-thunk";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store/store";
import { AppState } from "../redux/reducers/rootReducer";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppDispatchThunk: () => reduxThunk.ThunkDispatch<
  AppState,
  unknown,
  redux.UnknownAction
> = useDispatch;

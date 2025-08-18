import { LucideIcon } from "lucide-react";
import { FC } from "react";
import { AppState } from "../redux/reducers/rootReducer";
import * as redux from "redux";
import * as reduxThunk from "redux-thunk";

export interface User {
  id: number;
  nombre: string;
  rol: string;
}

export const constants = {
  setUserInfo: "[USER] set user info",
  logoutUser: "[USER] logout",
  setLoading: "[HELPERS] set loading",
  setOpenToast: "[HELPERS] set open toast",
  setMessageToast: "[HELPERS] set message toast",
  setVariantToast: "[HELPERS] set variant toast",
} as const;

export type Types = (typeof constants)[keyof typeof constants];

export type ThunkResult<R> = reduxThunk.ThunkAction<
  R,
  AppState,
  unknown,
  redux.UnknownAction
>;

export interface Module {
  id: number;
  name: string;
  icon: LucideIcon;
  allowedRoles: string[];
  component: FC;
  path: string;
  bgColor: string;
  hoverColor: string;
}

export type AppointmentStatus =
  | "PENDING"
  | "ATTENDED"
  | "NO_SHOW"
  | "CANCELLED";

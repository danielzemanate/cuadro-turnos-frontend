import { LucideIcon } from "lucide-react";
import { FC } from "react";
import { AppState } from "../redux/reducers/rootReducer";
import * as redux from "redux";
import * as reduxThunk from "redux-thunk";
import { IRoles } from "../interfaces/user";

export interface User {
  id: number;
  nombre: string;
  roles: IRoles;
}

export const constants = {
  setUserInfo: "[USER] set user info",
  logoutUser: "[USER] logout",
  setLoading: "[HELPERS] set loading",
  setOpenToast: "[HELPERS] set open toast",
  setMessageToast: "[HELPERS] set message toast",
  setVariantToast: "[HELPERS] set variant toast",
  scheduleSetOptions: "[schedule] set options",
  scheduleClearOptions: "[schedule] clear options",
  scheduleSetEditableOptions: "[schedule] set editable options",
  scheduleClearEditableOptions: "[schedule] clear editable options",
  scheduleSetMonth: "[schedule] set month data",
  scheduleClearMonth: "[schedule] clear month data",
  scheduleSetAttentionTypes: "[schedule] set attention types",
  scheduleClearAttentionTypes: "[schedule] clear attention types",
  usersConfigSetSpecialPermitApprovers:
    "[usersConfig] set special permit approvers",
  usersConfigClearSpecialPermitApprovers:
    "[usersConfig] clear special permit approvers",
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
  allowedRoles: number[];
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

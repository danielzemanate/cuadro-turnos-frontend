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

  // ---- SCHEDULE ----
  scheduleSetOptions: "[schedule] set options",
  scheduleClearOptions: "[schedule] clear options",
  scheduleSetEditableOptions: "[schedule] set editable options",
  scheduleClearEditableOptions: "[schedule] clear editable options",
  scheduleSetMonth: "[schedule] set month data",
  scheduleClearMonth: "[schedule] clear month data",
  scheduleSetAttentionTypes: "[schedule] set attention types",
  scheduleClearAttentionTypes: "[schedule] clear attention types",
  scheduleSetSiauTypes: "[schedule] set siau types",
  scheduleClearSiauTypes: "[schedule] clear siau types",

  // ---- USERS CONFIG ----
  usersConfigSetSpecialPermitApprovers:
    "[usersConfig] set special permit approvers",
  usersConfigClearSpecialPermitApprovers:
    "[usersConfig] clear special permit approvers",

  // ---- ADMINISTRATION ----
  administrationSetRoles: "[administration] set roles",
  administrationClearRoles: "[administration] clear roles",
  administrationSetAttentionTypes: "[administration] set attention types",
  administrationClearAttentionTypes: "[administration] clear attention types",
  administrationSetPersonalTypes: "[administration] set personal types",
  administrationClearPersonalTypes: "[administration] clear personal types",
  administrationSetMunicipios: "[administration] set Municipios",
  administrationClearMunicipios: "[administration] clear Municipios",
  administrationSetUsers: "[administration] set users",
  administrationClearUsers: "[administration] clear users",

  // ---- REPORTS ----
  reportsSetTypes: "[reports] set types",
  reportsClearTypes: "[reports] clear types",
  reportsSetSubTypes: "[reports] set subtypes",
  reportsClearSubTypes: "[reports] clear subtypes",
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

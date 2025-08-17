import { ReactNode } from "react";
import { Types } from "../types/types";

export interface IGameRules {
  title: string;
  image: string;
  component?: ReactNode;
}
export interface IHelpersState {
  loading: boolean;
  openToast: boolean;
  messageToast: string | null;
  variantToast: "success" | "warning" | "error";
}
export interface IHelpersActions {
  type: Types;
  payload?: boolean | null | string;
}

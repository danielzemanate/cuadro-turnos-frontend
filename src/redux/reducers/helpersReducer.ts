import { IHelpersActions, IHelpersState } from "../../interfaces/helpers";
import { constants } from "../../types/types";

const initialState: IHelpersState = {
  loading: false,
  openToast: false,
  messageToast: null,
  variantToast: "success",
};

export const helpersReducer = (
  state = initialState,
  action: IHelpersActions,
): IHelpersState => {
  const { type, payload } = action;
  switch (type) {
    case constants.setLoading:
      return {
        ...state,
        loading: payload as boolean,
      };
    case constants.setOpenToast:
      return {
        ...state,
        openToast: payload as boolean,
      };
    case constants.setMessageToast:
      return {
        ...state,
        messageToast: payload as string | null,
      };
    case constants.setVariantToast:
      return {
        ...state,
        variantToast: payload as "warning" | "success" | "error",
      };
    default:
      return state;
  }
};
export type { IHelpersState };

import { constants } from "../../types/types";

export const setLoading = (loading: boolean) => ({
  type: constants.setLoading,
  payload: loading,
});

export const setOpenToast = (openToast: boolean) => ({
  type: constants.setOpenToast,
  payload: openToast,
});
export const setMessageToast = (messageToast: string | null) => ({
  type: constants.setMessageToast,
  payload: messageToast,
});

export const setVariantToast = (
  variantToast: "success" | "warning" | "error",
) => ({
  type: constants.setVariantToast,
  payload: variantToast,
});

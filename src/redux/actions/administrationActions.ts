import { constants, ThunkResult } from "./../../types/types";
import { t } from "i18next";
import {
  setLoading,
  setMessageToast,
  setOpenToast,
  setVariantToast,
} from "./helpersActions";
import AdministrationService from "../../services/administration/administration.service";
import { IRoles } from "../../interfaces/user";
import {
  IConfigAttentionTypes,
  IDataUserRol,
  IPersonalType,
} from "../../interfaces/administration";

/**
 * ROLES
 */
export const fetchRoles = (): ThunkResult<Promise<void>> => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await AdministrationService.fetchRoles();
      if (response.status === 200) {
        dispatch({
          type: constants.administrationSetRoles,
          payload: response.data as IRoles[],
        });
      }
    } catch (error) {
      dispatch(setOpenToast(true));
      dispatch(setVariantToast("error"));
      dispatch(setMessageToast(t("alerts.genericError")));
      console.log(error?.message || error);
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const createRol = (
  data: Partial<IRoles>,
): ThunkResult<Promise<void>> => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await AdministrationService.createRole(data);
      if (response.status === 200) {
        dispatch(setOpenToast(true));
        dispatch(setVariantToast("success"));
        dispatch(setMessageToast(t("alerts.createSuccess")));
      }
    } catch (error) {
      dispatch(setOpenToast(true));
      dispatch(setVariantToast("error"));
      dispatch(setMessageToast(t("alerts.genericError")));
      console.log(error?.message || error);
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const updateRol = (
  data: Partial<IRoles>,
  id: string,
): ThunkResult<Promise<void>> => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await AdministrationService.updateRole(data, id);
      if (response.status === 200) {
        dispatch(setOpenToast(true));
        dispatch(setVariantToast("success"));
        dispatch(setMessageToast(t("alerts.updateSuccess")));
      }
    } catch (error) {
      dispatch(setOpenToast(true));
      dispatch(setVariantToast("error"));
      dispatch(setMessageToast(t("alerts.genericError")));
      console.log(error?.message || error);
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const deleteRol = (id: string): ThunkResult<Promise<void>> => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await AdministrationService.deleteRole(id);
      if (response.status === 200) {
        dispatch(setOpenToast(true));
        dispatch(setVariantToast("success"));
        dispatch(setMessageToast(t("alerts.deleteSuccess")));
      }
    } catch (error) {
      dispatch(setOpenToast(true));
      dispatch(setVariantToast("error"));
      dispatch(setMessageToast(t("alerts.genericError")));
      console.log(error?.message || error);
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const clearRoles = () => ({ type: constants.administrationClearRoles });

/**
 * TIPOS DE ATENCIÓN
 */
export const fetchConfigAttentionTypes = (): ThunkResult<Promise<void>> => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const res = await AdministrationService.fetchConfigAttentionTypes();
      if (res.status === 200) {
        dispatch({
          type: constants.administrationSetAttentionTypes,
          payload: res.data as IConfigAttentionTypes[],
        });
      }
    } catch (error) {
      dispatch(setOpenToast(true));
      dispatch(setVariantToast("error"));
      dispatch(setMessageToast(t("alerts.genericError")));
      console.log(error?.message || error);
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const createAttentionType = (
  data: Partial<IConfigAttentionTypes>,
): ThunkResult<Promise<void>> => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const res = await AdministrationService.createAttentionTypes(data);
      if (res.status === 200) {
        dispatch(setOpenToast(true));
        dispatch(setVariantToast("success"));
        dispatch(setMessageToast(t("alerts.createSuccess")));
      }
    } catch (error) {
      dispatch(setOpenToast(true));
      dispatch(setVariantToast("error"));
      dispatch(setMessageToast(t("alerts.genericError")));
      console.log(error?.message || error);
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const updateAttentionType = (
  data: Partial<IConfigAttentionTypes>,
  id: string,
): ThunkResult<Promise<void>> => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const res = await AdministrationService.updateAttentionTypes(data, id);
      if (res.status === 200) {
        dispatch(setOpenToast(true));
        dispatch(setVariantToast("success"));
        dispatch(setMessageToast(t("alerts.updateSuccess")));
      }
    } catch (error) {
      dispatch(setOpenToast(true));
      dispatch(setVariantToast("error"));
      dispatch(setMessageToast(t("alerts.genericError")));
      console.log(error?.message || error);
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const deleteAttentionType = (id: string): ThunkResult<Promise<void>> => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const res = await AdministrationService.deleteAttentionTypes(id);
      if (res.status === 200) {
        dispatch(setOpenToast(true));
        dispatch(setVariantToast("success"));
        dispatch(setMessageToast(t("alerts.deleteSuccess")));
      }
    } catch (error) {
      dispatch(setOpenToast(true));
      dispatch(setVariantToast("error"));
      dispatch(setMessageToast(t("alerts.genericError")));
      console.log(error?.message || error);
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const clearAttentionTypes = () => ({
  type: constants.administrationClearAttentionTypes,
});

/** ---------------- TIPOS DE PERSONAL DE SALUD ---------------- **/

export const fetchConfigPersonalTypes = (): ThunkResult<Promise<void>> => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const res = await AdministrationService.fetchConfigPersonalTypes();
      if (res.status === 200) {
        dispatch({
          type: constants.administrationSetPersonalTypes,
          payload: res.data as IPersonalType[],
        });
      }
    } catch (error) {
      dispatch(setOpenToast(true));
      dispatch(setVariantToast("error"));
      dispatch(setMessageToast(t("alerts.genericError")));
      console.log(error?.message || error);
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const createPersonalType = (
  data: Partial<IPersonalType>,
): ThunkResult<Promise<void>> => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const res = await AdministrationService.createPersonalTypes(data);
      if (res.status === 200) {
        dispatch(setOpenToast(true));
        dispatch(setVariantToast("success"));
        dispatch(setMessageToast(t("alerts.createSuccess")));
      }
    } catch (error) {
      dispatch(setOpenToast(true));
      dispatch(setVariantToast("error"));
      dispatch(setMessageToast(t("alerts.genericError")));
      console.log(error?.message || error);
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const updatePersonalType = (
  data: Partial<IPersonalType>,
  id: string,
): ThunkResult<Promise<void>> => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const res = await AdministrationService.updatePersonalTypes(data, id);
      if (res.status === 200) {
        dispatch(setOpenToast(true));
        dispatch(setVariantToast("success"));
        dispatch(setMessageToast(t("alerts.updateSuccess")));
      }
    } catch (error) {
      dispatch(setOpenToast(true));
      dispatch(setVariantToast("error"));
      dispatch(setMessageToast(t("alerts.genericError")));
      console.log(error?.message || error);
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const deletePersonalType = (id: string): ThunkResult<Promise<void>> => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const res = await AdministrationService.deletePersonalTypes(id);
      if (res.status === 200) {
        dispatch(setOpenToast(true));
        dispatch(setVariantToast("success"));
        dispatch(setMessageToast(t("alerts.deleteSuccess")));
      }
    } catch (error) {
      dispatch(setOpenToast(true));
      dispatch(setVariantToast("error"));
      dispatch(setMessageToast(t("alerts.genericError")));
      console.log(error?.message || error);
    } finally {
      dispatch(setLoading(false));
    }
  };
};

// ---------------- ROLES DE USUARIO (ASIGNACIÓN DE ROLES A UN USUARIO) ----------------

/**
 * Obtiene los roles del usuario por id_user.
 * NO guarda nada en Redux. Solo retorna response.data si todo va bien.
 */
export const fetchUserRol = (
  id_user: string,
): ThunkResult<Promise<IDataUserRol | unknown>> => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const res = await AdministrationService.fetchUserRol(id_user);
      if (res.status === 200) {
        return res.data as IDataUserRol;
      }
      // si el status no es 200, forzamos un error para que caiga en el catch
      throw new Error(`Unexpected status: ${res.status}`);
    } catch (error) {
      dispatch(setOpenToast(true));
      dispatch(setVariantToast("error"));
      dispatch(setMessageToast(t("alerts.genericError")));
      console.log(error?.message || error);
    } finally {
      dispatch(setLoading(false));
    }
  };
};

/**
 * Actualiza/establece los roles de un usuario.
 */
export const updateUserRol = (
  data: Partial<IDataUserRol>,
): ThunkResult<Promise<void>> => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const res = await AdministrationService.updateUserRol(data);
      if (res.status === 201) {
        dispatch(setOpenToast(true));
        dispatch(setVariantToast("success"));
        dispatch(setMessageToast(t("alerts.updateSuccess")));
      } else {
        throw new Error(`Unexpected status: ${res.status}`);
      }
    } catch (error) {
      dispatch(setOpenToast(true));
      dispatch(setVariantToast("error"));
      dispatch(setMessageToast(t("alerts.genericError")));
      console.log(error?.message || error);
    } finally {
      dispatch(setLoading(false));
    }
  };
};

/**
 * Elimina una asignación/registro de rol de usuario por id (según tu endpoint).
 */
export const deleteUserRol = (id: string): ThunkResult<Promise<void>> => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const res = await AdministrationService.deleteUserRol(id);
      if (res.status === 200) {
        dispatch(setOpenToast(true));
        dispatch(setVariantToast("success"));
        dispatch(setMessageToast(t("alerts.deleteSuccess")));
      } else {
        throw new Error(`Unexpected status: ${res.status}`);
      }
    } catch (error) {
      dispatch(setOpenToast(true));
      dispatch(setVariantToast("error"));
      dispatch(setMessageToast(t("alerts.genericError")));
      console.log(error?.message || error);
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const clearPersonalTypes = () => ({
  type: constants.administrationClearPersonalTypes,
});

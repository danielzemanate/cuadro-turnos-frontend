import {
  IDataChangePassword,
  IDataResetPassword,
  ISignInValues,
  IUserRegister,
} from "../../interfaces/signIn";
import api from "../../lib/api";

const AuthService = {
  login: async (data: ISignInValues) => {
    return await api.post(
      `${import.meta.env.VITE_APP_BACK_ESE}auth/login`,
      data,
    );
  },
  register: async (data: IUserRegister) => {
    return await api.post(
      `${import.meta.env.VITE_APP_BACK_ESE}auth/auth/register`,
      data,
    );
  },
  changePassword: async (data: IDataChangePassword) => {
    return await api.post(
      `${import.meta.env.VITE_APP_BACK_ESE}auth/change-password`,
      data,
    );
  },
  resetPassword: async (data: IDataResetPassword) => {
    return await api.post(
      `${import.meta.env.VITE_APP_BACK_ESE}auth/auth/reset-password`,
      data,
    );
  },
};

export default AuthService;

import { ISignInValues, IUserRegister } from "../../interfaces/signIn";
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
};

export default AuthService;

import { ISignInValues } from "../../interfaces/signIn";
import api from "../../lib/api";

const AuthService = {
  login: async (data: ISignInValues) => {
    return await api.post(
      `${import.meta.env.VITE_APP_BACK_USERS}auth/login`,
      data,
    );
  },
};

export default AuthService;

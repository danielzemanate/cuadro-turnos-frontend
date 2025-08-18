import React, { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import loginLogo from "../../assets/images/loginLogo.png";
import {
  LoginContainer,
  LoginCard,
  LoginLogo,
  InputContainer,
  LoginInput,
  InputIcon,
  PasswordToggle,
  LoginButton,
} from "./LoginStyles";
import LoadingSpinner from "../Shared/LoadingSpinner/LoadingSpinner";
import { ISignInValues } from "../../interfaces/signIn";
import { AppState } from "../../redux/reducers/rootReducer";
import { useAppDispatchThunk } from "../../hooks/storeHooks";
import { loginUser } from "../../redux/actions/userActions";

const Login: FC = () => {
  const dispatchThunk = useAppDispatchThunk();
  const navigate = useNavigate();

  // campos del formulario
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { loading } = useSelector((state: AppState) => state.helpers);
  const { userData } = useSelector((state: AppState) => state.user);

  // si ya hay sesión, redirige
  useEffect(() => {
    if (userData?.access_token) {
      navigate("/dashboard");
    }
  }, [userData, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: ISignInValues = { correo, password };
    dispatchThunk(loginUser(payload));
  };

  const togglePasswordVisibility = () => setShowPassword((v) => !v);

  return (
    <LoginContainer>
      <LoginCard>
        <LoginLogo src={loginLogo} alt="Logo E.S.E Suroccidente" />

        <form onSubmit={handleSubmit}>
          <InputContainer>
            <InputIcon>
              <User size={20} color="#6b7280" />
            </InputIcon>
            <LoginInput
              type="text"
              placeholder="Correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              autoComplete="username"
            />
          </InputContainer>

          <InputContainer>
            <InputIcon>
              <Lock size={20} color="#6b7280" />
            </InputIcon>
            <LoginInput
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <PasswordToggle
              type="button"
              onClick={togglePasswordVisibility}
              aria-label="Mostrar/ocultar contraseña"
            >
              {showPassword ? (
                <EyeOff size={20} color="#6b7280" />
              ) : (
                <Eye size={20} color="#6b7280" />
              )}
            </PasswordToggle>
          </InputContainer>

          <LoginButton type="submit" disabled={loading || !correo || !password}>
            {loading ? <LoadingSpinner /> : "Ingresar"}
          </LoginButton>
        </form>

        {/* Bloque informativo opcional: elimínalo si ya no usas credenciales de prueba */}
        {/* <div
          style={{
            marginTop: "1.5rem",
            padding: "1rem",
            backgroundColor: "#f3f4f6",
            borderRadius: "0.5rem",
            fontSize: "0.875rem",
            color: "#6b7280",
          }}
        >
          <strong>Credenciales de prueba:</strong>
          <br />
          Usuario: coordinador.admin
          <br />
          Contraseña: 123456
        </div> */}
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;

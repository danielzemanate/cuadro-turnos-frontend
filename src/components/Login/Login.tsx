import React, { FC, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { User, Lock, Eye, EyeOff, Mail } from "lucide-react";
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
  ErrorMessage,
  ResetLink,
  ModalField,
  ModalLabel,
  ModalInput,
  ModalErrorMessage,
} from "./LoginStyles";
import LoadingSpinner from "../Shared/LoadingSpinner/LoadingSpinner";
import { ISignInValues, IDataResetPassword } from "../../interfaces/signIn";
import { AppState } from "../../redux/reducers/rootReducer";
import { useAppDispatchThunk } from "../../hooks/storeHooks";
import { loginUser, FetchResetPassword } from "../../redux/actions/userActions";
import ConfirmDialog from "../Common/confirmDialog/ConfirmDialog";
import { useTranslation } from "react-i18next";

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const Login: FC = () => {
  const { t } = useTranslation();
  const dispatchThunk = useAppDispatchThunk();
  const navigate = useNavigate();

  // campos del formulario
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const emailValid = useMemo(() => isValidEmail(correo), [correo]);

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
    if (!emailValid) {
      setEmailTouched(true);
      return;
    }
    const payload: ISignInValues = { correo, password };
    dispatchThunk(loginUser(payload));
  };

  const togglePasswordVisibility = () => setShowPassword((v) => !v);

  // --- Reset password (modal) ---
  const [openReset, setOpenReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetTouched, setResetTouched] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetInlineError, setResetInlineError] = useState<string | null>(null);
  const resetEmailValid = useMemo(() => isValidEmail(resetEmail), [resetEmail]);

  const openResetModal = () => {
    setOpenReset(true);
    setResetInlineError(null);
  };

  const closeResetModal = () => {
    if (!resetLoading) {
      setOpenReset(false);
      setResetInlineError(null);
      setResetTouched(false);
    }
  };

  const onConfirmReset = async () => {
    setResetTouched(true);
    setResetInlineError(null);

    if (!resetEmailValid) {
      setResetInlineError(t("login.invalidEmail"));
      return;
    }

    setResetLoading(true);
    try {
      const payload: IDataResetPassword = { correo: resetEmail.trim() };
      await dispatchThunk(FetchResetPassword(payload));
      // Éxito: cerramos y limpiamos
      setOpenReset(false);
      setResetEmail("");
      setResetTouched(false);
    } catch (e) {
      setResetInlineError(e?.message || t("alerts.genericError"));
    } finally {
      setResetLoading(false);
    }
  };

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
              type="email"
              placeholder={t("login.email")}
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              onBlur={() => setEmailTouched(true)}
              autoComplete="username"
              aria-invalid={emailTouched && !emailValid ? true : undefined}
            />
          </InputContainer>
          {emailTouched && !emailValid && (
            <ErrorMessage>{t("login.invalidEmail")}</ErrorMessage>
          )}

          <InputContainer>
            <InputIcon>
              <Lock size={20} color="#6b7280" />
            </InputIcon>
            <LoginInput
              type={showPassword ? "text" : "password"}
              placeholder={t("login.password")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <PasswordToggle
              type="button"
              onClick={togglePasswordVisibility}
              aria-label={t("login.togglePassword")}
              title={t("login.togglePassword")}
            >
              {showPassword ? (
                <EyeOff size={20} color="#6b7280" />
              ) : (
                <Eye size={20} color="#6b7280" />
              )}
            </PasswordToggle>
          </InputContainer>

          <LoginButton
            type="submit"
            disabled={loading || !emailValid || !password}
          >
            {loading ? <LoadingSpinner /> : t("login.submit")}
          </LoginButton>
        </form>

        {/* Botón de reset sin subrayado */}
        <ResetLink type="button" onClick={openResetModal}>
          {t("login.forgotPassword")}
        </ResetLink>
      </LoginCard>

      {/* Modal de Reset usando ConfirmDialog */}
      <ConfirmDialog
        open={openReset}
        title={t("login.reset.title")}
        description={
          <div>
            <p style={{ margin: "0 0 0.75rem 0", color: "#374151" }}>
              {t("login.reset.description")}
            </p>
            <ModalField>
              <ModalLabel htmlFor="resetEmail">
                {t("login.reset.label")}
              </ModalLabel>
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    display: "inline-flex",
                  }}
                >
                  <Mail size={16} color="#6b7280" />
                </span>
                <ModalInput
                  id="resetEmail"
                  type="email"
                  value={resetEmail}
                  onChange={(e) => {
                    setResetEmail(e.target.value);
                    if (resetInlineError) setResetInlineError(null);
                  }}
                  onBlur={() => setResetTouched(true)}
                  placeholder="usuario@ejemplo.com"
                  style={{ paddingLeft: 34 }}
                  aria-invalid={
                    (resetTouched && !resetEmailValid) || resetInlineError
                      ? true
                      : undefined
                  }
                />
              </div>
              {/* error por formato */}
              {resetTouched && !resetEmailValid && (
                <ModalErrorMessage>{t("login.invalidEmail")}</ModalErrorMessage>
              )}
              {/* error del backend */}
              {resetInlineError && (
                <ModalErrorMessage>{resetInlineError}</ModalErrorMessage>
              )}
            </ModalField>
          </div>
        }
        confirmText={t("login.reset.confirm")}
        cancelText={t("login.reset.cancel")}
        onConfirm={onConfirmReset}
        onCancel={closeResetModal}
        loading={resetLoading}
      />
    </LoginContainer>
  );
};

export default Login;

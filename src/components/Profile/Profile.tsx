import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../redux/reducers/rootReducer";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "../../components/Common/confirmDialog/ConfirmDialog";
import { Eye, EyeOff } from "lucide-react";
import {
  PageWrap,
  Card,
  Title,
  Subtitle,
  Grid,
  Field,
  Label,
  Value,
  Avatar,
  Divider,
  SectionTitle,
  FormRow,
  Input,
  ActionsRight,
  PrimaryBtn,
  GhostBtn,
  ErrorText,
  Checklist,
  CheckItem,
  CheckIconOk,
  CheckIconNo,
  SmallHelp,
  PasswordToggle,
  PasswordWrapper,
} from "./ProfileStyles";
import {
  FetchChangePassword /*, logoutUser*/,
} from "../../redux/actions/userActions";
import { useAppDispatchThunk } from "../../hooks/storeHooks";
import { IDataChangePassword } from "../../interfaces/signIn";

const hasUpper = (s: string) => /[A-ZÁÉÍÓÚÑ]/.test(s);
const hasNumber = (s: string) => /\d/.test(s);

const Profile: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatchThunk = useAppDispatchThunk();
  const { userData } = useSelector((state: AppState) => state.user);

  const fullName =
    `${userData?.user?.nombre ?? ""} ${userData?.user?.apellidos ?? ""}`.trim();

  // Form state
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [repeatPwd, setRepeatPwd] = useState("");

  // Show/Hide password toggles
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showRepeat, setShowRepeat] = useState(false);

  // UX state
  const [touched, setTouched] = useState<{ [k: string]: boolean }>({});
  const [currentPwdError, setCurrentPwdError] = useState<string | null>(null);

  // Dialog
  const [openConfirm, setOpenConfirm] = useState(false);
  const [loadingConfirm, setLoadingConfirm] = useState(false);

  // Validaciones
  const rules = useMemo(() => {
    const lengthOk = newPwd.length >= 8;
    const upperOk = hasUpper(newPwd);
    const numberOk = hasNumber(newPwd);
    const matchOk = newPwd === repeatPwd && newPwd.length > 0;
    const requiredOk =
      currentPwd.length > 0 && newPwd.length > 0 && repeatPwd.length > 0;
    return { lengthOk, upperOk, numberOk, matchOk, requiredOk };
  }, [currentPwd, newPwd, repeatPwd]);

  const formValid =
    rules.requiredOk &&
    rules.lengthOk &&
    rules.upperOk &&
    rules.numberOk &&
    rules.matchOk;

  const onCancel = () => navigate(-1);
  const onAccept = () => setOpenConfirm(true);
  const handleCancelDialog = () => setOpenConfirm(false);

  const handleConfirm = async () => {
    setLoadingConfirm(true);
    setCurrentPwdError(null);
    try {
      const payload: IDataChangePassword = {
        id_usuario: userData.user.id,
        old_password: currentPwd,
        new_password: newPwd,
      };

      await dispatchThunk(FetchChangePassword(payload));

      // ÉXITO: limpiar y cerrar
      setCurrentPwd("");
      setNewPwd("");
      setRepeatPwd("");
      setTouched({});
      setOpenConfirm(false);
    } catch (e) {
      setCurrentPwdError(e?.message || t("alerts.genericError"));
      setTouched((s) => ({ ...s, currentPwd: true }));
      setOpenConfirm(false);
    } finally {
      setLoadingConfirm(false);
    }
  };

  // Helpers de error por campo
  const showRequired = (name: string, val: string) => touched[name] && !val;
  const showMismatch =
    touched["repeatPwd"] && repeatPwd.length > 0 && newPwd !== repeatPwd;

  return (
    <PageWrap>
      <Card>
        <Title>{t("profile.title")}</Title>
        <Subtitle>{t("profile.subtitle")}</Subtitle>

        <Avatar>{(userData?.user?.nombre?.[0] ?? "U").toUpperCase()}</Avatar>

        <Grid>
          <Field>
            <Label>{t("profile.fullName")}</Label>
            <Value>{fullName || "—"}</Value>
          </Field>
          <Field>
            <Label>{t("profile.email")}</Label>
            <Value>{userData?.user?.correo ?? "—"}</Value>
          </Field>
          <Field>
            <Label>{t("profile.phone")}</Label>
            <Value>{userData?.user?.celular ?? "—"}</Value>
          </Field>
          <Field>
            <Label>{t("profile.role")}</Label>
            <Value>{userData?.roles?.nombre ?? "—"}</Value>
          </Field>
          <Field>
            <Label>{t("profile.active")}</Label>
            <Value>
              {userData?.user?.activo ? t("common.yes") : t("common.no")}
            </Value>
          </Field>
          <Field>
            <Label>{t("profile.healthStaff")}</Label>
            <Value>
              {userData?.user?.es_personal_salud
                ? t("common.yes")
                : t("common.no")}
            </Value>
          </Field>
        </Grid>

        <Divider />

        <SectionTitle>{t("reset.title")}</SectionTitle>

        {/* Contraseña actual */}
        <FormRow>
          <Label htmlFor="currentPwd">{t("reset.current")}</Label>
          <PasswordWrapper>
            <Input
              id="currentPwd"
              type={showCurrent ? "text" : "password"}
              value={currentPwd}
              onBlur={() => setTouched((s) => ({ ...s, currentPwd: true }))}
              onChange={(e) => {
                setCurrentPwd(e.target.value);
                if (currentPwdError) setCurrentPwdError(null);
              }}
              placeholder={t("reset.current")}
              autoComplete="current-password"
              aria-invalid={
                currentPwdError || showRequired("currentPwd", currentPwd)
                  ? true
                  : undefined
              }
              $withToggle
            />
            <PasswordToggle
              type="button"
              onClick={() => setShowCurrent((v) => !v)}
              aria-label={t("login.togglePassword")}
              title={t("login.togglePassword")}
            >
              {showCurrent ? (
                <EyeOff size={18} color="#6b7280" />
              ) : (
                <Eye size={18} color="#6b7280" />
              )}
            </PasswordToggle>
          </PasswordWrapper>
          {showRequired("currentPwd", currentPwd) && (
            <ErrorText>{t("reset.required")}</ErrorText>
          )}
          {currentPwdError && <ErrorText>{currentPwdError}</ErrorText>}
        </FormRow>

        {/* Nueva contraseña */}
        <FormRow>
          <Label htmlFor="newPwd">{t("reset.new")}</Label>
          <PasswordWrapper>
            <Input
              id="newPwd"
              type={showNew ? "text" : "password"}
              value={newPwd}
              onBlur={() => setTouched((s) => ({ ...s, newPwd: true }))}
              onChange={(e) => setNewPwd(e.target.value)}
              placeholder={t("reset.new")}
              autoComplete="new-password"
              aria-invalid={
                touched["newPwd"] &&
                (!rules.lengthOk || !rules.upperOk || !rules.numberOk)
                  ? true
                  : undefined
              }
              $withToggle
            />
            <PasswordToggle
              type="button"
              onClick={() => setShowNew((v) => !v)}
              aria-label={t("login.togglePassword")}
              title={t("login.togglePassword")}
            >
              {showNew ? (
                <EyeOff size={18} color="#6b7280" />
              ) : (
                <Eye size={18} color="#6b7280" />
              )}
            </PasswordToggle>
          </PasswordWrapper>

          {/* Checklist dinámica */}
          <Checklist aria-live="polite">
            <CheckItem $ok={rules.lengthOk}>
              {rules.lengthOk ? <CheckIconOk /> : <CheckIconNo />}{" "}
              {t("reset.minLength")}
            </CheckItem>
            <CheckItem $ok={rules.upperOk}>
              {rules.upperOk ? <CheckIconOk /> : <CheckIconNo />}{" "}
              {t("reset.needUpper")}
            </CheckItem>
            <CheckItem $ok={rules.numberOk}>
              {rules.numberOk ? <CheckIconOk /> : <CheckIconNo />}{" "}
              {t("reset.needNumber")}
            </CheckItem>
          </Checklist>
          <SmallHelp>{t("reset.help")}</SmallHelp>
        </FormRow>

        {/* Repetir contraseña */}
        <FormRow>
          <Label htmlFor="repeatPwd">{t("reset.confirm")}</Label>
          <PasswordWrapper>
            <Input
              id="repeatPwd"
              type={showRepeat ? "text" : "password"}
              value={repeatPwd}
              onBlur={() => setTouched((s) => ({ ...s, repeatPwd: true }))}
              onChange={(e) => setRepeatPwd(e.target.value)}
              placeholder={t("reset.confirm")}
              autoComplete="new-password"
              aria-invalid={showMismatch ? true : undefined}
              $withToggle
            />
            <PasswordToggle
              type="button"
              onClick={() => setShowRepeat((v) => !v)}
              aria-label={t("login.togglePassword")}
              title={t("login.togglePassword")}
            >
              {showRepeat ? (
                <EyeOff size={18} color="#6b7280" />
              ) : (
                <Eye size={18} color="#6b7280" />
              )}
            </PasswordToggle>
          </PasswordWrapper>
          {showRequired("repeatPwd", repeatPwd) && (
            <ErrorText>{t("reset.required")}</ErrorText>
          )}
          {showMismatch && <ErrorText>{t("reset.mismatch")}</ErrorText>}
        </FormRow>

        <ActionsRight>
          <GhostBtn onClick={onCancel}>{t("common.cancel")}</GhostBtn>
          <PrimaryBtn onClick={onAccept} disabled={!formValid}>
            {t("reset.save")}
          </PrimaryBtn>
        </ActionsRight>
      </Card>

      <ConfirmDialog
        open={openConfirm}
        title={t("reset.title")}
        description={t("reset.confirmationText")}
        confirmText={t("reset.save")}
        cancelText={t("common.cancel")}
        onConfirm={handleConfirm}
        onCancel={handleCancelDialog}
        loading={loadingConfirm}
      />
    </PageWrap>
  );
};

export default Profile;

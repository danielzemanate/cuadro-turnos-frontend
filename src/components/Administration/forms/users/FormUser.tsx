import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  Title,
  Field,
  Label,
  Input,
  Actions,
  Primary,
  Ghost,
  GridThree,
  Select,
  ErrorText,
  SeparatorWithTitle,
  InlineRow,
  Danger,
  RolesBlock,
  PageBlock,
  ControlRow,
  RoleInfo,
  RoleLabel,
  RoleValue,
} from "./FormUserStyles";
import { AppState } from "../../../../redux/reducers/rootReducer";
import { useAppDispatchThunk } from "../../../../hooks/storeHooks";
import {
  fetchUserRol,
  deleteUserRol,
  updateUserRol,
  fetchRoles,
} from "../../../../redux/actions/administrationActions";
import ConfirmDialog from "../../../Common/confirmDialog/ConfirmDialog";

/* ---------------------------- Tipos del formulario ---------------------------- */

export interface IUserForm {
  nombre: string;
  apellidos: string;
  correo: string;
  celular: string;
  id_tipo_personal_salud: number;
  id_municipio: number;
  activo: boolean;
  creado_por?: number;
  actualizado_por?: number;
}

interface Props {
  onSubmit: (_payload: IUserForm) => void;
  onCancel: () => void;
  defaultValue?: Partial<IUserForm & { id?: number }>;
}

interface IDataUserRol {
  id: number;
  id_usuario: number;
  id_rol: number;
}

type FormField = keyof IUserForm;
type TouchedFields = Record<FormField, boolean>;

/* ------------------------------ Validaciones -------------------------------- */

const useFormValidation = (form: IUserForm) => {
  return useMemo(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const errors = {
      nombre: !form.nombre.trim(),
      apellidos: !form.apellidos.trim(),
      correo: !emailRegex.test(form.correo.trim()),
      celular: !form.celular.trim(),
      id_tipo_personal_salud:
        !Number.isInteger(form.id_tipo_personal_salud) ||
        form.id_tipo_personal_salud <= 0,
      id_municipio:
        !Number.isInteger(form.id_municipio) || form.id_municipio <= 0,
      // sin estado
      creado_por: false,
      actualizado_por: false,
    };

    return {
      errors,
      hasErrors: Object.values(errors).some(Boolean),
    };
  }, [form]);
};

/* ------------------------------- Hook Roles -------------------------------- */

const useUserRoles = (isEditing: boolean, editingUserId?: number) => {
  const dispatchThunk = useAppDispatchThunk();
  const [userRol, setUserRol] = useState<IDataUserRol | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<number | "">("");

  const loadUserRol = useCallback(async () => {
    if (!isEditing || !editingUserId) return;

    try {
      const res = await dispatchThunk(fetchUserRol(String(editingUserId)));
      if (Array.isArray(res) && res.length > 0) {
        const item = res[0] as IDataUserRol;
        setUserRol(item);
        setSelectedRoleId(item.id_rol);
      } else {
        setUserRol(null);
        setSelectedRoleId("");
      }
    } catch {
      setUserRol(null);
      setSelectedRoleId("");
    }
  }, [isEditing, editingUserId, dispatchThunk]);

  useEffect(() => {
    loadUserRol();
  }, [loadUserRol]);

  return {
    userRol,
    selectedRoleId,
    setSelectedRoleId,
    reloadUserRol: loadUserRol,
    clearUserRol: () => {
      setUserRol(null);
      setSelectedRoleId("");
    },
  };
};

/* -------------------------------- Componente -------------------------------- */

const FormUser: React.FC<Props> = ({ onSubmit, onCancel, defaultValue }) => {
  console.log(defaultValue);
  const { t } = useTranslation();
  const dispatchThunk = useAppDispatchThunk();

  // Selectores Redux
  const { userData } = useSelector((state: AppState) => state.user);
  const loading = useSelector((state: AppState) => state.helpers.loading);
  const rolesFromStore =
    useSelector((state: AppState) => state.administration.roles) ?? [];

  const municipios =
    useSelector((state: AppState) => state.administration.municipios) ?? [];

  const personalTypes =
    useSelector((state: AppState) => state.administration.personalTypes) ?? [];

  // Estados derivados
  const userId = userData?.user?.id ?? 0;
  const isEditing = Boolean(defaultValue?.id);
  const editingUserId = defaultValue?.id ? Number(defaultValue.id) : undefined;

  // Estado del formulario
  const [form, setForm] = useState<IUserForm>(() => ({
    nombre: defaultValue?.nombre ?? "",
    apellidos: defaultValue?.apellidos ?? "",
    correo: defaultValue?.correo ?? "",
    celular: defaultValue?.celular ?? "",
    id_tipo_personal_salud: Number(defaultValue?.id_tipo_personal_salud) || 0,
    id_municipio: Number(defaultValue?.id_municipio) || 0,
    activo: defaultValue?.activo || false,
  }));

  const [touched, setTouched] = useState<Partial<TouchedFields>>({});

  // Hooks personalizados
  const { errors, hasErrors } = useFormValidation(form);
  const {
    userRol,
    selectedRoleId,
    setSelectedRoleId,
    reloadUserRol,
    clearUserRol,
  } = useUserRoles(isEditing, editingUserId);

  // Diálogos de confirmación (Eliminar / Actualizar rol)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [deletingRole, setDeletingRole] = useState(false);
  const [updatingRole, setUpdatingRole] = useState(false);

  // Efectos
  useEffect(() => {
    if (rolesFromStore.length === 0) {
      dispatchThunk(fetchRoles());
    }
  }, [rolesFromStore.length, dispatchThunk]);

  // Handlers del formulario
  const setField = useCallback(
    <K extends FormField>(key: K) =>
      (val: IUserForm[K]) =>
        setForm((prev) => ({ ...prev, [key]: val })),
    [],
  );

  const markFieldAsTouched = useCallback(
    (field: FormField) => setTouched((prev) => ({ ...prev, [field]: true })),
    [],
  );

  const showError = useCallback(
    (field: FormField) => touched[field] && errors[field],
    [touched, errors],
  );

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();

      if (hasErrors) {
        setTouched({
          nombre: true,
          apellidos: true,
          correo: true,
          celular: true,
          id_tipo_personal_salud: true,
          id_municipio: true,
          creado_por: true,
          actualizado_por: true,
        });
        return;
      }

      const payload: IUserForm = {
        ...form,
        id_tipo_personal_salud: Number(form.id_tipo_personal_salud),
        id_municipio: Number(form.id_municipio),
        creado_por: userId,
        actualizado_por: userId,
      };

      onSubmit(payload);
    },
    [hasErrors, form, userId, onSubmit],
  );

  // Handlers de roles con ConfirmDialog (solo en edición)
  const handleDeleteUserRole = useCallback(async () => {
    if (!userRol) {
      setOpenDeleteDialog(false);
      return;
    }
    try {
      setDeletingRole(true);
      await dispatchThunk(deleteUserRol(String(userRol.id)));
      clearUserRol();
    } finally {
      setDeletingRole(false);
      setOpenDeleteDialog(false);
    }
  }, [userRol, dispatchThunk, clearUserRol]);

  const handleUpdateUserRole = useCallback(async () => {
    if (
      !isEditing ||
      !editingUserId ||
      !selectedRoleId ||
      typeof selectedRoleId !== "number"
    ) {
      setOpenUpdateDialog(false);
      return;
    }
    try {
      setUpdatingRole(true);
      await dispatchThunk(
        updateUserRol({ id_usuario: editingUserId, id_rol: selectedRoleId }),
      );
      await reloadUserRol();
    } finally {
      setUpdatingRole(false);
      setOpenUpdateDialog(false);
    }
  }, [isEditing, editingUserId, selectedRoleId, dispatchThunk, reloadUserRol]);

  // Componentes de campo reutilizables
  const renderFormField = useCallback(
    (
      id: string,
      label: string,
      field: Extract<FormField, "nombre" | "apellidos" | "correo" | "celular">,
      placeholder?: string,
      type: "text" | "email" | "tel" = "text",
    ) => (
      <Field key={field}>
        <Label htmlFor={id}>{label}</Label>
        <Input
          id={id}
          type={type}
          value={form[field] as string}
          onChange={(e) => setField(field)(e.target.value)}
          onBlur={() => markFieldAsTouched(field)}
          placeholder={placeholder}
          aria-invalid={showError(field)}
          aria-describedby={showError(field) ? `${id}-error` : undefined}
        />
        {showError(field) && (
          <ErrorText id={`${id}-error`} role="alert">
            {field === "correo"
              ? t("administration.users.form.errors.email")
              : t("administration.users.form.errors.required")}
          </ErrorText>
        )}
      </Field>
    ),
    [form, setField, markFieldAsTouched, showError, t],
  );

  const renderSelectField = useCallback(
    (
      id: string,
      label: string,
      field: Extract<FormField, "id_tipo_personal_salud" | "id_municipio">,
      options: readonly { id: number; nombre: string }[],
    ) => (
      <Field key={field}>
        <Label htmlFor={id}>{label}</Label>
        <Select
          id={id}
          value={String(form[field] ?? "")}
          onChange={(e) => setField(field)(Number(e.target.value))}
          onBlur={() => markFieldAsTouched(field)}
          aria-invalid={showError(field)}
          aria-describedby={showError(field) ? `${id}-error` : undefined}
        >
          <option value="">{t("common.selectPlaceholder")}</option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.nombre}
            </option>
          ))}
        </Select>
        {showError(field) && (
          <ErrorText id={`${id}-error`} role="alert">
            {t("administration.users.form.errors.required")}
          </ErrorText>
        )}
      </Field>
    ),
    [form, setField, markFieldAsTouched, showError, t],
  );

  // Render del rol actual (solo modo edición)
  const currentRoleName = useMemo(() => {
    if (!userRol) return t("administration.users.roles.none");
    return rolesFromStore.find((r) => r.id === userRol.id_rol)?.nombre ?? "—";
  }, [userRol, rolesFromStore, t]);

  return (
    <PageBlock onSubmit={handleSubmit} noValidate>
      <Title>
        {isEditing
          ? t("administration.users.form.editTitle")
          : t("administration.users.form.newTitle")}
      </Title>

      <GridThree>
        {renderFormField(
          "user-nombre",
          t("administration.users.form.firstName"),
          "nombre",
          t("administration.users.form.placeholderFirstName"),
        )}

        {renderFormField(
          "user-apellidos",
          t("administration.users.form.lastName"),
          "apellidos",
          t("administration.users.form.placeholderLastName"),
        )}

        {renderFormField(
          "user-correo",
          t("administration.users.form.email"),
          "correo",
          t("administration.users.form.placeholderEmail"),
          "email",
        )}

        {renderFormField(
          "user-celular",
          t("administration.users.form.phone"),
          "celular",
          "Ej. 3001234567",
          "tel",
        )}

        {renderSelectField(
          "user-tipo-personal",
          t("administration.users.form.healthStaffType"),
          "id_tipo_personal_salud",
          personalTypes,
        )}

        {renderSelectField(
          "user-municipio",
          t("administration.users.form.municipality"),
          "id_municipio",
          municipios,
        )}
        <Field>
          <Label htmlFor="user-activo">
            {t("administration.users.form.active")}
          </Label>
          <Select
            id="user-activo"
            value={String(form.activo)}
            onChange={(e) => setField("activo")(e.target.value === "true")}
          >
            <option value="true">Sí</option>
            <option value="false">No</option>
          </Select>
        </Field>
      </GridThree>

      <Actions>
        <Ghost type="button" onClick={onCancel}>
          {t("common.cancel")}
        </Ghost>
        <Primary type="submit" disabled={hasErrors || loading}>
          {isEditing ? t("common.update") : t("common.create")}
        </Primary>
      </Actions>

      {/* BLOQUE DE ROLES SOLO EN EDICIÓN */}
      {isEditing && (
        <>
          <SeparatorWithTitle>ROLES</SeparatorWithTitle>

          <RolesBlock>
            <InlineRow>
              <RoleInfo>
                <RoleLabel>{t("administration.users.roles.current")}</RoleLabel>
                <RoleValue>{currentRoleName}</RoleValue>
              </RoleInfo>

              <Danger
                type="button"
                onClick={() => setOpenDeleteDialog(true)}
                disabled={!userRol || loading}
                title={t("administration.users.roles.deleteTooltip")}
              >
                {t("common.delete")}
              </Danger>
            </InlineRow>

            <Field>
              <Label htmlFor="user-role-select">
                {t("administration.users.roles.selectRole")}
              </Label>

              <ControlRow>
                <Select
                  id="user-role-select"
                  value={String(selectedRoleId ?? "")}
                  onChange={(e) => setSelectedRoleId(Number(e.target.value))}
                >
                  <option value="">{t("common.selectPlaceholder")}</option>
                  {rolesFromStore.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.nombre}
                    </option>
                  ))}
                </Select>

                <Primary
                  type="button"
                  onClick={() => setOpenUpdateDialog(true)}
                  disabled={
                    !selectedRoleId ||
                    typeof selectedRoleId !== "number" ||
                    loading
                  }
                >
                  {t("common.update")}
                </Primary>
              </ControlRow>
            </Field>
          </RolesBlock>
        </>
      )}

      {/* Dialog: Eliminar rol */}
      <ConfirmDialog
        open={openDeleteDialog}
        title="Eliminar rol"
        description="Se eliminará el rol actual del usuario. Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={deletingRole}
        onConfirm={handleDeleteUserRole}
        onCancel={() => setOpenDeleteDialog(false)}
      />

      {/* Dialog: Actualizar rol */}
      <ConfirmDialog
        open={openUpdateDialog}
        title="Actualizar rol"
        description="Asignarás el rol seleccionado al usuario."
        confirmText="Actualizar"
        cancelText="Cancelar"
        loading={updatingRole}
        onConfirm={handleUpdateUserRole}
        onCancel={() => setOpenUpdateDialog(false)}
      />
    </PageBlock>
  );
};

export default FormUser;

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
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
  Danger,
  PageBlock,
  RoleInfo,
  RoleLabel,
  RoleValue,
} from "./FormUserStyles";
import ConfirmDialog from "../../../Common/confirmDialog/ConfirmDialog";
import { AppState } from "../../../../redux/reducers/rootReducer";
import { useAppDispatchThunk } from "../../../../hooks/storeHooks";

import {
  fetchUserContracts,
  fetchContractTypes,
  createUserContract,
  updateUserContract,
  deleteUserContract,
} from "../../../../redux/actions/administrationActions";
import {
  IGenericGetData,
  IUserContract,
} from "../../../../interfaces/administration";

/* -------------------------------- Props & Types ------------------------------- */
interface Props {
  userId: number;
  onCancel: () => void;
  /** COSTOS solo consulta; INGENIERO puede CRUD */
  readOnly?: boolean;
}

// Para el formulario local (creación/edición)
type ContractForm = {
  id_tipo_contrato: number;
  n_contrato: string; // lo tratamos como string en inputs, casteamos al enviar
  fecha_inicio: string; // YYYY-MM-DD
  fecha_fin: string; // YYYY-MM-DD
  salario_mes: string; // string para input
};

type FormField = keyof ContractForm;
type TouchedFields = Record<FormField, boolean>;

// id seleccionado puede ser numérico o "new" (nuevo contrato)
type SelectedId = number | "new" | null;

const emptyContractForm = (tipoId = 0): ContractForm => ({
  id_tipo_contrato: tipoId,
  n_contrato: "",
  fecha_inicio: "",
  fecha_fin: "",
  salario_mes: "",
});

const asArray = <T,>(value: unknown): T[] =>
  Array.isArray(value) ? (value as T[]) : [];

const toInputString = (value: unknown): string => {
  if (value === null || value === undefined) return "";
  return String(value);
};

/** Input type="date" necesita YYYY-MM-DD; el backend a veces manda ISO completo */
const toDateInputValue = (value: unknown): string => {
  const raw = toInputString(value).trim();
  if (!raw) return "";
  return raw.includes("T") ? raw.slice(0, 10) : raw.slice(0, 10);
};

/* ---------------------------- Componente principal ---------------------------- */

const FormUserContracts: React.FC<Props> = ({
  userId,
  onCancel,
  readOnly = false,
}) => {
  const { t } = useTranslation();
  const dispatchThunk = useAppDispatchThunk();
  const loading = useSelector((s: AppState) => s.helpers.loading);

  // Datos cargados
  const [contracts, setContracts] = useState<IUserContract[]>([]);
  const [contractTypes, setContractTypes] = useState<IGenericGetData[]>([]);

  // Selección actual: contrato existente o "new"
  const [selectedContractId, setSelectedContractId] =
    useState<SelectedId>(null);

  // Diálogos
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Helpers
  const selectedContract: IUserContract | null = useMemo(() => {
    if (selectedContractId === "new" || selectedContractId === null)
      return null;
    return contracts.find((c) => c.id === selectedContractId) || null;
  }, [contracts, selectedContractId]);

  // Form local
  const [form, setForm] = useState<ContractForm>({
    id_tipo_contrato: 0,
    n_contrato: "",
    fecha_inicio: "",
    fecha_fin: "",
    salario_mes: "",
  });

  const [touched, setTouched] = useState<Partial<TouchedFields>>({});

  // Carga inicial
  useEffect(() => {
    let mounted = true;

    const loadAll = async () => {
      // Tipos de contrato
      const types = asArray<IGenericGetData>(
        await dispatchThunk(fetchContractTypes()),
      );
      if (mounted) setContractTypes(types);

      // Contratos del usuario
      const list = asArray<IUserContract>(
        await dispatchThunk(fetchUserContracts({ id_usuario: String(userId) })),
      );
      if (mounted) {
        setContracts(list);
        if (list.length > 0) {
          setSelectedContractId(list[0].id);
        } else {
          // Sin contratos: COSTOS no puede crear; INGENIERO entra en modo alta
          setSelectedContractId(readOnly ? null : "new");
        }
      }
    };

    loadAll();
    return () => {
      mounted = false;
    };
  }, [dispatchThunk, readOnly, userId]);

  // Cuando cambia el seleccionado, setear form
  useEffect(() => {
    if (selectedContractId === "new" || !selectedContract) {
      setForm(emptyContractForm(contractTypes[0]?.id ?? 0));
      setTouched({});
      return;
    }

    // Modo edición: normalizar a strings para los inputs (evita crash si viene null/number)
    setForm({
      id_tipo_contrato: Number(selectedContract.id_tipo_contrato) || 0,
      n_contrato: toInputString(selectedContract.n_contrato),
      fecha_inicio: toDateInputValue(selectedContract.fecha_inicio),
      fecha_fin: toDateInputValue(selectedContract.fecha_fin),
      salario_mes: toInputString(selectedContract.salario_mes),
    });
    setTouched({});
  }, [selectedContractId, selectedContract, contractTypes]);

  // Validaciones
  const errors = useMemo(() => {
    const clean = (s: unknown) => toInputString(s).trim();
    return {
      id_tipo_contrato:
        !Number.isFinite(Number(form.id_tipo_contrato)) ||
        Number(form.id_tipo_contrato) <= 0,
      n_contrato: !clean(form.n_contrato) || isNaN(Number(form.n_contrato)),
      fecha_inicio: !clean(form.fecha_inicio),
      fecha_fin: !clean(form.fecha_fin),
      salario_mes:
        !clean(form.salario_mes) ||
        isNaN(Number(form.salario_mes)) ||
        Number(form.salario_mes) <= 0,
    };
  }, [form]);

  const hasErrors = useMemo(
    () => Object.values(errors).some(Boolean),
    [errors],
  );

  const isContractExpired = useMemo(() => {
    if (!selectedContract || selectedContractId === "new") return false;
    const endRaw = toDateInputValue(selectedContract.fecha_fin);
    if (!endRaw) return false;
    const endDate = new Date(`${endRaw}T00:00:00`);
    if (Number.isNaN(endDate.getTime())) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return endDate < today;
  }, [selectedContract, selectedContractId]);
  // Setters
  const setField = useCallback(
    <K extends FormField>(key: K) =>
      (val: ContractForm[K]) =>
        setForm((prev) => ({ ...prev, [key]: val })),
    [],
  );

  const markFieldAsTouched = useCallback(
    (field: FormField) => setTouched((prev) => ({ ...prev, [field]: true })),
    [],
  );

  const showError = useCallback(
    (field: FormField) => Boolean(touched[field] && errors[field]),
    [touched, errors],
  );

  // Acciones CRUD
  const refetchContractsAndReselect = useCallback(async () => {
    const list = asArray<IUserContract>(
      await dispatchThunk(fetchUserContracts({ id_usuario: String(userId) })),
    );
    setContracts(list);
    if (list.length > 0) {
      setSelectedContractId(list[0].id);
    } else {
      setSelectedContractId(readOnly ? null : "new");
    }
  }, [dispatchThunk, readOnly, userId]);

  const handleCreate = useCallback(async () => {
    if (hasErrors) {
      setTouched({
        id_tipo_contrato: true,
        n_contrato: true,
        fecha_inicio: true,
        fecha_fin: true,
        salario_mes: true,
      });
      setOpenCreateDialog(false);
      return;
    }

    try {
      setCreating(true);
      await dispatchThunk(
        createUserContract({
          id_usuario: userId,
          id_tipo_contrato: Number(form.id_tipo_contrato),
          n_contrato: Number(form.n_contrato),
          fecha_inicio: form.fecha_inicio,
          fecha_fin: form.fecha_fin,
          salario_mes: form.salario_mes,
        } as Partial<IUserContract>),
      );
      await refetchContractsAndReselect();
    } finally {
      setCreating(false);
      setOpenCreateDialog(false);
    }
  }, [dispatchThunk, userId, form, hasErrors, refetchContractsAndReselect]);

  const handleUpdate = useCallback(async () => {
    if (!selectedContract || selectedContractId === "new" || hasErrors) {
      setOpenUpdateDialog(false);
      return;
    }
    try {
      setUpdating(true);
      await dispatchThunk(
        updateUserContract(
          {
            id_usuario: selectedContract.id_usuario,
            id_tipo_contrato: Number(form.id_tipo_contrato),
            n_contrato: Number(form.n_contrato),
            fecha_inicio: form.fecha_inicio,
            fecha_fin: form.fecha_fin,
            salario_mes: form.salario_mes,
          } as Partial<IUserContract>,
          String(selectedContract.id),
        ),
      );
      await refetchContractsAndReselect();
    } finally {
      setUpdating(false);
      setOpenUpdateDialog(false);
    }
  }, [
    dispatchThunk,
    selectedContract,
    selectedContractId,
    form,
    hasErrors,
    refetchContractsAndReselect,
  ]);

  const handleDelete = useCallback(async () => {
    if (!selectedContract || selectedContractId === "new") {
      setOpenDeleteDialog(false);
      return;
    }
    try {
      setDeleting(true);
      await dispatchThunk(deleteUserContract(String(selectedContract.id)));
      await refetchContractsAndReselect();
    } finally {
      setDeleting(false);
      setOpenDeleteDialog(false);
    }
  }, [
    dispatchThunk,
    selectedContract,
    selectedContractId,
    refetchContractsAndReselect,
  ]);

  // Botones: validar y abrir diálogos con exclusividad
  const openCreateWithValidation = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      if (hasErrors) {
        setTouched({
          id_tipo_contrato: true,
          n_contrato: true,
          fecha_inicio: true,
          fecha_fin: true,
          salario_mes: true,
        });
        return;
      }
      setOpenUpdateDialog(false);
      setOpenDeleteDialog(false);
      setOpenCreateDialog(true);
    },
    [hasErrors],
  );

  const openUpdateWithValidation = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      if (hasErrors) {
        setTouched({
          id_tipo_contrato: true,
          n_contrato: true,
          fecha_inicio: true,
          fecha_fin: true,
          salario_mes: true,
        });
        return;
      }
      setOpenCreateDialog(false);
      setOpenDeleteDialog(false);
      setOpenUpdateDialog(true);
    },
    [hasErrors],
  );

  // UI

  // Si no hay contratos, igualmente permitimos crear (salvo readOnly)
  const hasAnyContract = contracts.length > 0;
  const fieldsDisabled =
    readOnly || (selectedContractId !== "new" && isContractExpired);

  return (
    <>
      <PageBlock onSubmit={(e) => e.preventDefault()} noValidate>
        <Title>{t("administration.users.contracts.title")}</Title>

        {/* Info usuario (si hay contrato seleccionado existente) */}
        {selectedContract && selectedContractId !== "new" && (
          <div style={{ marginBottom: "1.5rem" }}>
            <RoleInfo>
              <RoleLabel>{t("administration.users.contracts.user")}</RoleLabel>
              <RoleValue>
                {selectedContract.usuario_nombre}{" "}
                {selectedContract.usuario_apellidos}
              </RoleValue>
            </RoleInfo>
          </div>
        )}

        {!hasAnyContract && readOnly ? (
          <RoleInfo>
            <RoleValue>
              {t("administration.users.contracts.noContracts")}
            </RoleValue>
          </RoleInfo>
        ) : (
          <>
            {/* Selector de contrato + opción de nuevo */}
            <Field>
              <Label htmlFor="contract-selector">
                {t("administration.users.contracts.selectContract")}
              </Label>
              <Select
                id="contract-selector"
                value={String(selectedContractId ?? "")}
                onChange={(e) => {
                  const v = e.target.value;
                  setSelectedContractId(v === "new" ? "new" : Number(v));
                }}
              >
                {!hasAnyContract && !readOnly && (
                  <option value="new">{t("common.new")}</option>
                )}
                {contracts.map((contract) => (
                  <option key={contract.id} value={contract.id}>
                    {t("administration.users.contracts.contractNumber", {
                      number: contract.n_contrato,
                    })}{" "}
                    - {contract.tipo_contrato_nombre}
                  </option>
                ))}
                {hasAnyContract && !readOnly && (
                  <option value="new">{t("common.new")}</option>
                )}
              </Select>
            </Field>

            {selectedContractId != null && (
              <>
                <SeparatorWithTitle>
                  {selectedContractId === "new"
                    ? t("administration.users.contracts.newContractData")
                    : t("administration.users.contracts.contractData")}
                </SeparatorWithTitle>

                {/* Alerta de vencido (solo edición) */}
                {selectedContractId !== "new" &&
                  selectedContract &&
                  isContractExpired && (
                    <div
                      style={{
                        background: "#fef2f2",
                        border: "1px solid #fecaca",
                        borderRadius: "0.5rem",
                        padding: "1rem",
                        marginBottom: "1.5rem",
                        color: "#dc2626",
                        fontSize: "0.875rem",
                      }}
                    >
                      <strong>
                        ⚠{" "}
                        {t(
                          "administration.users.contracts.expiredWarningTitle",
                        )}
                        :
                      </strong>{" "}
                      {t(
                        "administration.users.contracts.expiredWarningMessage",
                      )}
                    </div>
                  )}

                <GridThree>
                  {/* Tipo de contrato */}
                  <Field>
                    <Label htmlFor="contract-type">
                      {t("administration.users.contracts.fields.contractType")}
                    </Label>
                    <Select
                      id="contract-type"
                      value={String(form.id_tipo_contrato)}
                      onChange={(e) =>
                        setField("id_tipo_contrato")(Number(e.target.value))
                      }
                      onBlur={() => markFieldAsTouched("id_tipo_contrato")}
                      disabled={fieldsDisabled}
                    >
                      <option value="0">{t("common.selectPlaceholder")}</option>
                      {contractTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.nombre}
                        </option>
                      ))}
                    </Select>
                    {showError("id_tipo_contrato") && (
                      <ErrorText>
                        {t("administration.users.contracts.errors.required")}
                      </ErrorText>
                    )}
                  </Field>

                  {/* Número de contrato */}
                  <Field>
                    <Label htmlFor="contract-number">
                      {t(
                        "administration.users.contracts.fields.contractNumber",
                      )}
                    </Label>
                    <Input
                      id="contract-number"
                      type="text"
                      value={form.n_contrato}
                      onChange={(e) => setField("n_contrato")(e.target.value)}
                      onBlur={() => markFieldAsTouched("n_contrato")}
                      placeholder={t(
                        "administration.users.contracts.placeholders.contractNumber",
                      )}
                      disabled={fieldsDisabled}
                    />
                    {showError("n_contrato") && (
                      <ErrorText>
                        {t(
                          "administration.users.contracts.errors.invalidNumber",
                        )}
                      </ErrorText>
                    )}
                  </Field>

                  {/* Salario mensual */}
                  <Field>
                    <Label htmlFor="contract-salary">
                      {t("administration.users.contracts.fields.monthlySalary")}
                    </Label>
                    <Input
                      id="contract-salary"
                      type="text"
                      value={form.salario_mes}
                      onChange={(e) => setField("salario_mes")(e.target.value)}
                      onBlur={() => markFieldAsTouched("salario_mes")}
                      placeholder={t(
                        "administration.users.contracts.placeholders.monthlySalary",
                      )}
                      disabled={fieldsDisabled}
                    />
                    {showError("salario_mes") && (
                      <ErrorText>
                        {t(
                          "administration.users.contracts.errors.invalidSalary",
                        )}
                      </ErrorText>
                    )}
                  </Field>

                  {/* Fecha inicio */}
                  <Field>
                    <Label htmlFor="contract-start">
                      {t("administration.users.contracts.fields.startDate")}
                    </Label>
                    <Input
                      id="contract-start"
                      type="date"
                      value={form.fecha_inicio}
                      onChange={(e) => setField("fecha_inicio")(e.target.value)}
                      onBlur={() => markFieldAsTouched("fecha_inicio")}
                      disabled={fieldsDisabled}
                    />
                    {showError("fecha_inicio") && (
                      <ErrorText>
                        {t("administration.users.contracts.errors.required")}
                      </ErrorText>
                    )}
                  </Field>

                  {/* Fecha fin */}
                  <Field>
                    <Label htmlFor="contract-end">
                      {t("administration.users.contracts.fields.endDate")}
                    </Label>
                    <Input
                      id="contract-end"
                      type="date"
                      value={form.fecha_fin}
                      onChange={(e) => setField("fecha_fin")(e.target.value)}
                      onBlur={() => markFieldAsTouched("fecha_fin")}
                      disabled={fieldsDisabled}
                    />
                    {showError("fecha_fin") && (
                      <ErrorText>
                        {t("administration.users.contracts.errors.required")}
                      </ErrorText>
                    )}
                  </Field>
                </GridThree>
              </>
            )}
          </>
        )}

        <Actions>
          <Ghost type="button" onClick={onCancel}>
            {t("common.cancel")}
          </Ghost>

          {!readOnly && selectedContractId === "new" && (
            <Primary
              type="button"
              onClick={openCreateWithValidation}
              disabled={loading}
            >
              {t("common.create")}
            </Primary>
          )}

          {!readOnly &&
            selectedContractId !== "new" &&
            selectedContractId != null &&
            !isContractExpired && (
              <>
                <Danger
                  type="button"
                  onClick={() => {
                    setOpenCreateDialog(false);
                    setOpenUpdateDialog(false);
                    setOpenDeleteDialog(true);
                  }}
                  disabled={loading}
                >
                  {t("common.delete")}
                </Danger>

                <Primary
                  type="button"
                  onClick={openUpdateWithValidation}
                  disabled={loading}
                >
                  {t("common.update")}
                </Primary>
              </>
            )}
        </Actions>
      </PageBlock>

      {/* Diálogo: Crear */}
      <ConfirmDialog
        open={openCreateDialog}
        title={t("administration.users.contracts.createDialog.title")}
        description={t(
          "administration.users.contracts.createDialog.description",
        )}
        confirmText={t("common.create")}
        cancelText={t("common.cancel")}
        loading={creating}
        onConfirm={handleCreate}
        onCancel={() => setOpenCreateDialog(false)}
      />

      {/* Diálogo: Actualizar */}
      <ConfirmDialog
        open={openUpdateDialog}
        title={t("administration.users.contracts.updateDialog.title")}
        description={t(
          "administration.users.contracts.updateDialog.description",
        )}
        confirmText={t("common.update")}
        cancelText={t("common.cancel")}
        loading={updating}
        onConfirm={handleUpdate}
        onCancel={() => setOpenUpdateDialog(false)}
      />

      {/* Diálogo: Eliminar */}
      <ConfirmDialog
        open={openDeleteDialog}
        title={t("administration.users.contracts.deleteDialog.title")}
        description={t(
          "administration.users.contracts.deleteDialog.description",
        )}
        confirmText={t("common.delete")}
        cancelText={t("common.cancel")}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setOpenDeleteDialog(false)}
      />
    </>
  );
};

export default FormUserContracts;

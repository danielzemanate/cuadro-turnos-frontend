import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import {
  SupportStaffWrapper,
  SupportStaffCard,
  HeaderRow,
  Title,
  SubTitle,
  TabsRow,
  TabButton,
  FormGrid,
  Field,
  Label,
  Select,
  ActionsRow,
  PrimaryButton,
  Input,
} from "./SupportStaffStyles";

import { useAppDispatchThunk } from "../../../hooks/storeHooks";
import { AppState } from "../../../redux/reducers/rootReducer";
import { fetchUsers } from "../../../redux/actions/administrationActions";
import {
  IChangeSupportStaff,
  ICreateSupportStaff,
} from "../../../interfaces/schedule";
import {
  changeSupportStaff,
  createSupportStaff,
} from "../../../redux/actions/scheduleActions";
import LoadingSpinner from "../../Shared/LoadingSpinner/LoadingSpinner";

type IUserListItem = {
  id: number;
  nombre?: string;
  nombres?: string;
  apellidos?: string;
  email?: string;
};

type IScheduleStaffItem = {
  id: number; // id_usuario
  nombre?: string;
  apellidos?: string;
};

type SupportStaffMode = "create" | "change";

interface SupportStaffProps {
  idCuadroMes: number; // id_cuadro_mes
  idTipoPersonalSalud: number; // id_tipo_personal_salud
  municipioNombre: string;
  tipoPersonalNombre: string;

  // ✅ NUEVO: lista de usuarios que YA están en el cuadro de turnos
  scheduleStaff: IScheduleStaffItem[];

  onSuccess?: () => void;
}

export const SupportStaff: React.FC<SupportStaffProps> = ({
  idCuadroMes,
  idTipoPersonalSalud,
  municipioNombre,
  tipoPersonalNombre,
  scheduleStaff,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const dispatchThunk = useAppDispatchThunk();

  const { loading } = useSelector((state: AppState) => state.helpers);

  // OJO: ajusta el selector según tu reducer real
  const users = useSelector(
    (state: AppState) => (state.administration?.users ?? []) as IUserListItem[],
  );

  const [mode, setMode] = useState<SupportStaffMode>("create");

  // Campos comunes
  const [esApoyo, setEsApoyo] = useState<boolean>(true);

  // Create
  const [selectedUserId, setSelectedUserId] = useState<number | "">("");

  // Change
  const [incomingUserId, setIncomingUserId] = useState<number | "">("");
  const [outgoingUserId, setOutgoingUserId] = useState<number | "">("");
  const [diaEntrada, setDiaEntrada] = useState<string>("");

  // === Cargar usuarios según filtros (nombre municipio / tipo personal) ===
  useEffect(() => {
    if (!municipioNombre || !tipoPersonalNombre) return;

    dispatchThunk(
      fetchUsers({
        municipio: municipioNombre,
        tipo_personal: tipoPersonalNombre,
        activos: "true",
      }),
    );
  }, [dispatchThunk, municipioNombre, tipoPersonalNombre]);

  const formatUserLabel = useCallback((u: IUserListItem) => {
    const full =
      `${u.nombres ?? u.nombre ?? ""} ${u.apellidos ?? ""}`.trim() ||
      u.email ||
      `Usuario #${u.id}`;
    return full;
  }, []);

  const formatScheduleStaffLabel = useCallback((s: IScheduleStaffItem) => {
    const full = `${s.nombre ?? ""} ${s.apellidos ?? ""}`.trim();
    return full || `Usuario #${s.id}`;
  }, []);

  // Opciones ordenadas (por nombre) - fuente: users del fetch
  const sortedUsers = useMemo(() => {
    const list = [...users];
    list.sort((a, b) =>
      formatUserLabel(a).localeCompare(formatUserLabel(b), "es", {
        sensitivity: "base",
      }),
    );
    return list;
  }, [users, formatUserLabel]);

  // ✅ IDs presentes en cuadro (para comparar)
  const scheduleStaffIds = useMemo(() => {
    return new Set((scheduleStaff ?? []).map((s) => s.id));
  }, [scheduleStaff]);

  // ✅ Disponibles: NO están en el cuadro (para CREATE + ENTRANTE)
  const availableUsers = useMemo(() => {
    return sortedUsers.filter((u) => !scheduleStaffIds.has(u.id));
  }, [sortedUsers, scheduleStaffIds]);

  // ✅ Salientes: SOLO los que están en el cuadro (fuente: scheduleStaff)
  const scheduleStaffOptions = useMemo(() => {
    const list = [...(scheduleStaff ?? [])];
    list.sort((a, b) =>
      formatScheduleStaffLabel(a).localeCompare(
        formatScheduleStaffLabel(b),
        "es",
        {
          sensitivity: "base",
        },
      ),
    );
    return list;
  }, [scheduleStaff, formatScheduleStaffLabel]);

  // En "cambiar": saliente NO puede ser el mismo que entrante (por robustez)
  const outgoingOptions = useMemo(() => {
    if (!incomingUserId) return scheduleStaffOptions;
    return scheduleStaffOptions.filter((s) => s.id !== incomingUserId);
  }, [scheduleStaffOptions, incomingUserId]);

  // Si cambian el entrante y coincide con el saliente, limpiamos saliente
  useEffect(() => {
    if (!incomingUserId || !outgoingUserId) return;
    if (incomingUserId === outgoingUserId) setOutgoingUserId("");
  }, [incomingUserId, outgoingUserId]);

  // Si cambias de modo, limpia campos para evitar estados cruzados
  useEffect(() => {
    setSelectedUserId("");
    setIncomingUserId("");
    setOutgoingUserId("");
    setDiaEntrada("");
  }, [mode]);

  const canSubmitCreate = useMemo(() => {
    return Boolean(selectedUserId);
  }, [selectedUserId]);

  const canSubmitChange = useMemo(() => {
    const day = parseInt(diaEntrada, 10);
    const isValidDay = !isNaN(day) && day >= 1 && day <= 31;
    return Boolean(incomingUserId && outgoingUserId && isValidDay);
  }, [incomingUserId, outgoingUserId, diaEntrada]);

  const handleSubmit = useCallback(async () => {
    if (mode === "create") {
      if (!selectedUserId) return;

      const payload: ICreateSupportStaff = {
        id_cuadro_mes: idCuadroMes,
        id_usuario: Number(selectedUserId),
        es_apoyo: Boolean(esApoyo),
        id_tipo_personal_salud: idTipoPersonalSalud,
      };

      await dispatchThunk(createSupportStaff(payload));
      onSuccess?.();
      return;
    }

    // mode === "change"
    if (!incomingUserId || !outgoingUserId) return;

    const day = parseInt(diaEntrada, 10);
    if (isNaN(day) || day < 1 || day > 31) return;

    const payload: IChangeSupportStaff = {
      id_cuadro_mes: idCuadroMes,
      id_usuario_entrante: Number(incomingUserId),
      id_usuario_saliente: Number(outgoingUserId),
      dia_entrada: day,
      es_apoyo: Boolean(esApoyo),
      id_tipo_personal_salud: idTipoPersonalSalud,
    };

    await dispatchThunk(changeSupportStaff(payload));
    onSuccess?.();
  }, [
    mode,
    selectedUserId,
    incomingUserId,
    outgoingUserId,
    diaEntrada,
    esApoyo,
    idCuadroMes,
    idTipoPersonalSalud,
    dispatchThunk,
    onSuccess,
  ]);

  return (
    <SupportStaffWrapper>
      <SupportStaffCard>
        <HeaderRow>
          <div>
            <Title>
              {t("scheduleViewer.supportStaff.title").toUpperCase()}
            </Title>
            <SubTitle>
              {municipioNombre} • {tipoPersonalNombre}
            </SubTitle>
          </div>
        </HeaderRow>

        <TabsRow>
          <TabButton
            type="button"
            $active={mode === "create"}
            onClick={() => setMode("create")}
          >
            {t("scheduleViewer.supportStaff.tabCreate").toUpperCase()}
          </TabButton>
          <TabButton
            type="button"
            $active={mode === "change"}
            onClick={() => setMode("change")}
          >
            {t("scheduleViewer.supportStaff.tabChange").toUpperCase()}
          </TabButton>
        </TabsRow>

        <FormGrid>
          <Field>
            <Label>{t("scheduleViewer.supportStaff.isSupportLabel")}</Label>
            <Select
              value={esApoyo ? "true" : "false"}
              onChange={(e) => setEsApoyo(e.target.value === "true")}
              disabled={loading}
            >
              <option value="true">
                {t("scheduleViewer.supportStaff.yes")}
              </option>
              <option value="false">
                {t("scheduleViewer.supportStaff.no")}
              </option>
            </Select>
          </Field>

          {mode === "create" ? (
            <Field>
              <Label>{t("scheduleViewer.supportStaff.userLabel")}</Label>
              <Select
                value={selectedUserId}
                onChange={(e) =>
                  setSelectedUserId(
                    e.target.value ? Number(e.target.value) : "",
                  )
                }
                disabled={loading}
              >
                <option value="">
                  {t("scheduleViewer.supportStaff.selectPlaceholder")}
                </option>

                {availableUsers.length === 0 ? (
                  <option value="" disabled>
                    {t("scheduleViewer.supportStaff.noAvailableUsers") ||
                      "No hay usuarios disponibles"}
                  </option>
                ) : (
                  availableUsers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {formatUserLabel(u)}
                    </option>
                  ))
                )}
              </Select>
            </Field>
          ) : (
            <>
              <Field>
                <Label>
                  {t("scheduleViewer.supportStaff.incomingUserLabel")}
                </Label>
                <Select
                  value={incomingUserId}
                  onChange={(e) =>
                    setIncomingUserId(
                      e.target.value ? Number(e.target.value) : "",
                    )
                  }
                  disabled={loading}
                >
                  <option value="">
                    {t("scheduleViewer.supportStaff.selectPlaceholder")}
                  </option>

                  {availableUsers.length === 0 ? (
                    <option value="" disabled>
                      {t("scheduleViewer.supportStaff.noAvailableUsers") ||
                        "No hay usuarios disponibles"}
                    </option>
                  ) : (
                    availableUsers.map((u) => (
                      <option key={u.id} value={u.id}>
                        {formatUserLabel(u)}
                      </option>
                    ))
                  )}
                </Select>
              </Field>

              <Field>
                <Label>
                  {t("scheduleViewer.supportStaff.outgoingUserLabel")}
                </Label>
                <Select
                  value={outgoingUserId}
                  onChange={(e) =>
                    setOutgoingUserId(
                      e.target.value ? Number(e.target.value) : "",
                    )
                  }
                  disabled={loading}
                >
                  <option value="">
                    {t("scheduleViewer.supportStaff.selectPlaceholder")}
                  </option>

                  {outgoingOptions.length === 0 ? (
                    <option value="" disabled>
                      {t("scheduleViewer.supportStaff.noScheduleStaff") ||
                        "No hay personal en el cuadro"}
                    </option>
                  ) : (
                    outgoingOptions.map((s) => (
                      <option key={s.id} value={s.id}>
                        {formatScheduleStaffLabel(s)}
                      </option>
                    ))
                  )}
                </Select>
              </Field>

              <Field>
                <Label>{t("scheduleViewer.supportStaff.entryDayLabel")}</Label>
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={diaEntrada}
                  onChange={(e) =>
                    setDiaEntrada(e.target.value.replace(/\D/g, "").slice(0, 2))
                  }
                  placeholder={t(
                    "scheduleViewer.supportStaff.entryDayPlaceholder",
                  )}
                  disabled={loading}
                />
              </Field>
            </>
          )}
        </FormGrid>

        <ActionsRow>
          <PrimaryButton
            type="button"
            onClick={handleSubmit}
            disabled={
              loading ||
              (mode === "create" ? !canSubmitCreate : !canSubmitChange)
            }
            aria-busy={loading}
          >
            {loading ? (
              <LoadingSpinner />
            ) : mode === "create" ? (
              t("scheduleViewer.supportStaff.savePerson").toUpperCase()
            ) : (
              t("scheduleViewer.supportStaff.changePerson").toUpperCase()
            )}
          </PrimaryButton>
        </ActionsRow>
      </SupportStaffCard>
    </SupportStaffWrapper>
  );
};

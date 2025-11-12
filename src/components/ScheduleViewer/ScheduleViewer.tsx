import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Download, ArrowLeft } from "lucide-react";

import LoadingSpinner from "../Shared/LoadingSpinner/LoadingSpinner";
import {
  FormState,
  IScheduleMonthParams,
  Periodo,
  PersonalDeSalud,
  IParamsGenericQuery,
  IAttentionTypesResponse,
  IDataEditScheduleData,
  IDataAddPatient,
  IPatientsData,
  IDataAddUnmetDemand,
} from "../../interfaces/schedule";

import {
  PageContainer,
  ContentWrapper,
  FormCard,
  PageTitle,
  PageSubtitle,
  SectionTitle,
  FormGrid,
  FormSelect,
  FormButton,
  FormCheckbox,
  FormLabel,
  TableSection,
  TableHeader,
  TableControls,
  TableContainer,
  DataTable,
  TableHead,
  TableBody,
  HeaderCell,
  DataCell,
  StaffNameCell,
  HoursDataRow,
  NoveltyDataRow,
  PatientsDataRow,
  TotalDataRow,
  BackButton,
  DownloadButton,
  LoadingOverlay,
  InputField,
  SelectField,
} from "./ScheduleViewerStyles";

import { AppState } from "../../redux/reducers/rootReducer";
import {
  fetchScheduleByMonth,
  fetchScheduleOptions,
  clearScheduleMonth,
  clearScheduleOptions,
  fetchEditableOptions,
  fetchAttentionTypes,
  editScheduleDay,
  addPatients,
  fetchTotalPatientsByMonth,
  fetchSiauTypes,
  fetchUnmetDemand,
  addUnmetDemand,
} from "../../redux/actions/scheduleActions";
import { useAppDispatchThunk } from "../../hooks/storeHooks";
import {
  getDayAbbreviation,
  daysInMonth,
  generateDaysArray,
  createDayBuckets,
  isValidFormState,
  formatPersonName,
  getNoveltyJustifications,
  sumNoveltyHours,
  sortPeriodos,
  findPeriodo,
} from "../../helpers/ScheduleHelper";
import { IDownloadSchedule } from "../../interfaces/utils";
import { fetchDownloadSchedule } from "../../redux/actions/utilsActions";
import {
  RoleId,
  Roles,
  RolesDatabase,
} from "../../constants/schedule.constants";
import { SiauTypesTable } from "./siau/SiauTypesTable";

interface ScheduleViewerProps {
  editable?: boolean;
}

interface FetchPatientsResponse {
  data: IPatientsData[];
}

interface FetchDataAddUnmetDemandResponse {
  data: IDataAddUnmetDemand[];
}

const ScheduleViewer: React.FC<ScheduleViewerProps> = ({
  editable = false,
}) => {
  const { t } = useTranslation();
  const dispatchThunk = useAppDispatchThunk();

  const { loading } = useSelector((state: AppState) => state.helpers);
  const { userData } = useSelector((state: AppState) => state.user);
  const { options, monthData, attentionTypes, siauTypes } = useSelector(
    (state: AppState) => state.schedule,
  );

  const editableParams: IParamsGenericQuery = {
    id_user: userData.user.id,
  };

  const rolesQueForzanMunicipio = [Roles.COORDINADOR, Roles.PERSONAL_SALUD];

  const roleIdNum = userData?.roles?.id as number | undefined;

  const isSiauRole =
    roleIdNum === RolesDatabase.COORDINADOR_SIAU ||
    roleIdNum === RolesDatabase.INGENIERO ||
    roleIdNum === RolesDatabase.SIAU;

  const canManagePatients = useMemo(() => {
    return (
      userData?.roles?.id === RolesDatabase.DILIGENCIADOR ||
      userData?.roles?.id === RolesDatabase.INGENIERO
    );
  }, [userData?.roles?.id]);

  // Permisos para SIAU: sólo roles 4 o 5 y únicamente en viewer (no en modo editable de turnos)
  const canManageSiau = useMemo(
    () => !editable && !!isSiauRole,
    [editable, isSiauRole],
  );

  const forceMunicipio = useMemo(() => {
    const rId = userData?.roles?.id as RoleId | undefined;
    return rId && rolesQueForzanMunicipio.includes(rId)
      ? (userData?.user?.id_municipio ?? null)
      : null;
  }, [userData]);

  // --- Form state ---
  const [formState, setFormState] = useState<FormState>({
    selectedPeriodo: null,
    selectedTipo: null,
    selectedMunicipio: null,
  });

  // --- UI toggles ---
  const [showTable, setShowTable] = useState<boolean>(false);
  const [showNovedades, setShowNovedades] = useState<boolean>(false);
  const [showPacientes, setShowPacientes] = useState<boolean>(false);
  const [showSiau, setShowSiau] = useState<boolean>(false);

  // --- Attention (editable) ---
  const [attentionByCell, setAttentionByCell] = useState<
    Record<string, string>
  >({});

  // --- Patients (por usuario/día) ---
  const [patientsDataByKey, setPatientsDataByKey] = useState<
    Record<string, IPatientsData>
  >({});
  const [patientsInput, setPatientsInput] = useState<Record<string, string>>(
    {},
  );

  // --- SIAU unmet demand (por tipo/día) ---
  const [siauUnmetByKey, setSiauUnmetByKey] = useState<Record<string, number>>(
    {},
  );
  const [siauInputs, setSiauInputs] = useState<Record<string, string>>({});

  const attentionMapBySigla = useMemo(() => {
    const map = new Map<string, IAttentionTypesResponse>();
    (attentionTypes || []).forEach((a) => map.set(a.sigla, a));
    return map;
  }, [attentionTypes]);

  const MONTHS = useMemo(
    () => t("scheduleViewer.months", { returnObjects: true }) as string[],
    [t],
  );

  const sortedPeriodos = useMemo(() => {
    if (!options?.periodos) return [];
    return sortPeriodos(options.periodos);
  }, [options?.periodos]);

  const { year, monthIndex0, days } = useMemo(() => {
    const currentYear =
      formState.selectedPeriodo?.anio ?? new Date().getFullYear();
    const currentMonthIndex =
      (formState.selectedPeriodo?.mes ?? new Date().getMonth() + 1) - 1;
    const totalDays = daysInMonth(currentYear, currentMonthIndex);
    const currentDays = generateDaysArray(totalDays);
    return {
      year: currentYear,
      monthIndex0: currentMonthIndex,
      days: currentDays,
    };
  }, [formState.selectedPeriodo]);

  const isFormValid = useMemo(
    () =>
      isValidFormState(
        formState.selectedPeriodo,
        formState.selectedTipo,
        forceMunicipio ?? formState.selectedMunicipio,
      ),
    [formState, forceMunicipio],
  );

  const getPatientsForPersonDay = useCallback(
    (userId: number, day: number): number => {
      const key = `${userId}-${day}`;
      return patientsDataByKey[key]?.total_pacientes || 0;
    },
    [patientsDataByKey],
  );

  // ===== Effects =====
  useEffect(() => {
    if (editable) {
      dispatchThunk(fetchEditableOptions(editableParams ?? {}));
    } else {
      dispatchThunk(fetchScheduleOptions());
    }
  }, [dispatchThunk, editable, JSON.stringify(editableParams)]);

  useEffect(() => {
    if (editable && formState.selectedTipo) {
      const attentionParams = {
        id_tipo_personal_salud: formState.selectedTipo,
      };
      dispatchThunk(fetchAttentionTypes(attentionParams));
    }
  }, [dispatchThunk, editable, formState.selectedTipo]);

  // Cargar pacientes al abrir la vista de pacientes (PARA TODOS LOS ROLES: ver/editar según permiso)
  useEffect(() => {
    if (showPacientes && monthData?.mes) {
      dispatchThunk(fetchTotalPatientsByMonth(monthData.mes.toString()))
        .then((response: FetchPatientsResponse) => {
          if (response && response.data) {
            const byKey: Record<string, IPatientsData> = {};
            const initialInputs: Record<string, string> = {};
            (response.data as IPatientsData[]).forEach((item) => {
              const key = `${item.id_usuario}-${item.dia}`;
              byKey[key] = item;
              initialInputs[key] = item.total_pacientes.toString();
            });
            setPatientsDataByKey(byKey);
            setPatientsInput(initialInputs);
          }
        })
        .catch((error) => {
          console.error("Error cargando datos de pacientes:", error);
          setPatientsDataByKey({});
          setPatientsInput({});
        });
    }
  }, [showPacientes, monthData?.mes, dispatchThunk]);

  // Inicializar selects por defecto
  useEffect(() => {
    if (!options) return;
    setFormState((prev) => ({
      ...prev,
      selectedPeriodo: prev.selectedPeriodo || sortedPeriodos[0] || null,
      selectedTipo:
        prev.selectedTipo || options.tipos_personal_salud?.[0]?.id || null,
      selectedMunicipio:
        prev.selectedMunicipio ??
        forceMunicipio ??
        options.municipios?.[0]?.id ??
        null,
    }));
  }, [options, sortedPeriodos, forceMunicipio]);

  // Cargar mapa de atenciones inicial desde backend
  useEffect(() => {
    if (!monthData) return;
    const next: Record<string, string> = {};
    monthData.personal_de_salud.forEach((p) => {
      const buckets = createDayBuckets(p.dias);
      days.forEach((d) => {
        const currentSigla = buckets[d]?.normal?.tipo_atencion || "";
        next[`${p.id_usuario}-${d}`] = currentSigla;
      });
    });
    setAttentionByCell(next);
  }, [monthData, days]);

  // Forzar ocultar toggle SIAU al entrar a modo editable
  useEffect(() => {
    if (editable && showSiau) setShowSiau(false);
  }, [editable, showSiau]);

  // Cargar tipos SIAU al activar el toggle (si no hay)
  useEffect(() => {
    if (showSiau && (!siauTypes || siauTypes.length === 0)) {
      dispatchThunk(fetchSiauTypes());
    }
  }, [showSiau, siauTypes, dispatchThunk]);

  // Cargar DEMANDA INSATISFECHA SIAU al activar el toggle y con mes listo (todos ven; editan según permiso)
  useEffect(() => {
    if (showSiau && monthData?.mes) {
      dispatchThunk(fetchUnmetDemand(monthData.mes.toString()))
        .then((response: FetchDataAddUnmetDemandResponse) => {
          const list = (response?.data ?? []) as Array<{
            id: number;
            id_usuario: number;
            id_cuadro_mes: number;
            dia: number;
            id_tipos_siau: number;
            valor: number;
          }>;

          const byKey: Record<string, number> = {};
          const inputs: Record<string, string> = {};
          list.forEach((item) => {
            const key = `${item.id_tipos_siau}-${item.dia}`;
            byKey[key] = item.valor ?? 0;
            inputs[key] = String(item.valor ?? 0);
          });
          setSiauUnmetByKey(byKey);
          setSiauInputs(inputs);
        })
        .catch((err) => {
          console.error("Error cargando demanda insatisfecha SIAU:", err);
          setSiauUnmetByKey({});
          setSiauInputs({});
        });
    }
  }, [showSiau, monthData?.mes, dispatchThunk]);

  // ===== Handlers =====
  const handlePeriodoChange = useCallback(
    (field: "mes" | "anio", value: number) => {
      if (!sortedPeriodos.length) return;
      const currentPeriodo = formState.selectedPeriodo;
      let foundPeriodo: Periodo | null = null;

      if (field === "mes") {
        foundPeriodo = findPeriodo(
          sortedPeriodos,
          currentPeriodo?.anio ?? sortedPeriodos[0].anio,
          value,
          undefined,
          value,
        );
      } else {
        foundPeriodo = findPeriodo(
          sortedPeriodos,
          value,
          currentPeriodo?.mes ?? sortedPeriodos[0].mes,
          value,
          undefined,
        );
      }
      setFormState((prev) => ({ ...prev, selectedPeriodo: foundPeriodo }));
    },
    [sortedPeriodos, formState.selectedPeriodo],
  );

  const handleTipoChange = useCallback((value: number) => {
    setFormState((prev) => ({ ...prev, selectedTipo: value }));
  }, []);

  const handleConsultar = useCallback(() => {
    if (!isFormValid) return;
    const municipioId = forceMunicipio ?? formState.selectedMunicipio!;
    const params: IScheduleMonthParams = {
      anio: formState.selectedPeriodo!.anio,
      mes: formState.selectedPeriodo!.mes,
      id_tipo_personal_salud: formState.selectedTipo!,
      id_municipio: municipioId,
    };
    dispatchThunk(fetchScheduleByMonth(params));
    setShowTable(true);
  }, [dispatchThunk, formState, isFormValid, forceMunicipio]);

  const handleBack = useCallback(() => {
    dispatchThunk(clearScheduleMonth());
    dispatchThunk(clearScheduleOptions());

    setFormState({
      selectedPeriodo: null,
      selectedTipo: null,
      selectedMunicipio: null,
    });
    setShowNovedades(false);
    setShowPacientes(false);
    setShowSiau(false);
    setShowTable(false);
    setAttentionByCell({});
    setPatientsDataByKey({});
    setPatientsInput({});
    setSiauUnmetByKey({});
    setSiauInputs({});

    if (editable) {
      dispatchThunk(fetchEditableOptions(editableParams ?? {}));
    } else {
      dispatchThunk(fetchScheduleOptions());
    }
  }, [dispatchThunk, editable, editableParams]);

  const handleAttentionChange = useCallback(
    (idUsuario: number, day: number, newSigla: string) => {
      const key = `${idUsuario}-${day}`;
      setAttentionByCell((prev) => ({ ...prev, [key]: newSigla }));

      const selectedType = attentionMapBySigla.get(newSigla) || null;
      const person = monthData?.personal_de_salud.find(
        (p) => p.id_usuario === idUsuario,
      );
      const id_cuadro_personal = person?.id_cuadro_personal;

      if (!selectedType || !id_cuadro_personal) return;

      const payload: IDataEditScheduleData = {
        id_cuadro_personal,
        dia: day,
        id_tipo_atencion: selectedType.id,
        horas: selectedType.horas,
        es_novedad: false,
        editor_user_id: userData.user.id,
      };
      dispatchThunk(editScheduleDay(payload));
    },
    [
      attentionMapBySigla,
      monthData?.personal_de_salud,
      userData.user.id,
      dispatchThunk,
    ],
  );

  // Patients handlers
  const handlePatientsChange = useCallback(
    (userId: number, day: number, value: string) => {
      const key = `${userId}-${day}`;
      setPatientsInput((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const handlePatientsBlur = useCallback(
    (userId: number, day: number) => {
      if (!monthData?.mes) return;
      const key = `${userId}-${day}`;
      const value = patientsInput[key] || "0";
      const numericValue = parseInt(value, 10);

      if (isNaN(numericValue) || numericValue < 0) {
        setPatientsInput((prev) => ({ ...prev, [key]: "0" }));
        return;
      }

      const payload: IDataAddPatient = {
        id_usuario: userId,
        id_cuadro_mes: monthData.mes,
        dia: day,
        total_pacientes: numericValue,
      };

      dispatchThunk(addPatients(payload))
        .then(() => {
          setPatientsDataByKey((prev) => ({
            ...prev,
            [key]: {
              id: prev[key]?.id ?? Date.now(),
              id_usuario: userId,
              mes: monthData.mes!,
              dia: day,
              total_pacientes: numericValue,
            },
          }));
        })
        .catch(() => {
          const previousValue = getPatientsForPersonDay(userId, day);
          setPatientsInput((prev) => ({
            ...prev,
            [key]: previousValue.toString(),
          }));
        });
    },
    [monthData?.mes, patientsInput, dispatchThunk, getPatientsForPersonDay],
  );

  const handleDownload = useCallback(() => {
    if (!isFormValid) return;
    const municipioId = forceMunicipio ?? formState.selectedMunicipio!;
    const params: IDownloadSchedule = {
      anio: formState.selectedPeriodo!.anio,
      mes: formState.selectedPeriodo!.mes,
      id_tipo_personal_salud: formState.selectedTipo!,
      id_municipio: municipioId,
    };
    dispatchThunk(fetchDownloadSchedule(params));
  }, [dispatchThunk, formState, isFormValid, forceMunicipio]);

  // SIAU unmet handlers (por tipo/día)
  const handleSiauChange = useCallback(
    (tipoId: number, day: number, value: string) => {
      const key = `${tipoId}-${day}`;
      setSiauInputs((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const handleSiauBlur = useCallback(
    (tipoId: number, day: number) => {
      if (!monthData?.mes) return;
      const key = `${tipoId}-${day}`;
      const raw = siauInputs[key] ?? "0";
      const numericValue = parseInt(raw, 10);

      if (isNaN(numericValue) || numericValue < 0) {
        setSiauInputs((prev) => ({ ...prev, [key]: "0" }));
        return;
      }

      const payload: IDataAddUnmetDemand = {
        id_usuario: userData.user.id,
        id_cuadro_mes: monthData.mes!,
        dia: day,
        id_tipos_siau: tipoId,
        valor: numericValue,
      };

      dispatchThunk(addUnmetDemand(payload))
        .then(() => {
          setSiauUnmetByKey((prev) => ({ ...prev, [key]: numericValue }));
        })
        .catch(() => {
          const previous = siauUnmetByKey[key] ?? 0;
          setSiauInputs((prev) => ({ ...prev, [key]: String(previous) }));
        });
    },
    [
      monthData?.mes,
      siauInputs,
      siauUnmetByKey,
      dispatchThunk,
      userData.user.id,
    ],
  );

  // ===== Render helpers =====
  const renderPatientsRow = useCallback(
    (person: PersonalDeSalud) => {
      if (!showPacientes) return null;
      return (
        <PatientsDataRow key={`patients-row-${person.id_usuario}`}>
          <StaffNameCell>
            {t("scheduleViewer.totalPatientsTreated")}
          </StaffNameCell>
          {days.map((day) => {
            const key = `${person.id_usuario}-${day}`;
            return (
              <DataCell key={`patients-${person.id_usuario}-${day}`} $center>
                {canManagePatients ? (
                  <InputField
                    type="text"
                    value={patientsInput[key] ?? ""}
                    onChange={(e) =>
                      handlePatientsChange(
                        person.id_usuario,
                        day,
                        e.target.value,
                      )
                    }
                    onBlur={() => handlePatientsBlur(person.id_usuario, day)}
                    aria-label={`Total pacientes día ${day} - ${formatPersonName(
                      person.nombre,
                      person.apellidos,
                    )}`}
                  />
                ) : (
                  getPatientsForPersonDay(person.id_usuario, day)
                )}
              </DataCell>
            );
          })}
        </PatientsDataRow>
      );
    },
    [
      showPacientes,
      days,
      canManagePatients,
      patientsInput,
      getPatientsForPersonDay,
      handlePatientsChange,
      handlePatientsBlur,
      t,
    ],
  );

  const renderPersonRows = useCallback(
    (person: PersonalDeSalud) => {
      const dayBuckets = createDayBuckets(person.dias);
      return (
        <React.Fragment key={person.id_usuario}>
          <tr>
            <StaffNameCell>
              {formatPersonName(person.nombre, person.apellidos)}
            </StaffNameCell>
            {days.map((day) => {
              const cellKey = `${person.id_usuario}-${day}`;
              const currentBackendSigla =
                dayBuckets[day]?.normal?.tipo_atencion || "";
              const currentSigla =
                attentionByCell[cellKey] ?? currentBackendSigla;

              return (
                <DataCell key={`${person.id_usuario}-${day}`} $center>
                  {editable ? (
                    attentionTypes && attentionTypes.length > 0 ? (
                      <SelectField
                        value={currentSigla || ""}
                        onChange={(e) =>
                          handleAttentionChange(
                            person.id_usuario,
                            day,
                            e.target.value,
                          )
                        }
                        aria-label={`Tipo de atención día ${day} - ${formatPersonName(
                          person.nombre,
                          person.apellidos,
                        )}`}
                      >
                        <option value="">{"-"}</option>
                        {attentionTypes.map((a) => (
                          <option
                            key={a.id}
                            value={a.sigla}
                            title={`${a.sigla} - ${a.nombre}`}
                          >
                            {a.sigla}
                          </option>
                        ))}
                      </SelectField>
                    ) : (
                      <small style={{ color: "#6b7280" }}>
                        {t("common.loading") || "Cargando…"}
                      </small>
                    )
                  ) : (
                    currentBackendSigla
                  )}
                </DataCell>
              );
            })}
          </tr>

          <HoursDataRow>
            <StaffNameCell>
              {t("scheduleViewer.rowHours").toUpperCase()}
            </StaffNameCell>
            {days.map((day) => {
              const key = `${person.id_usuario}-${day}`;
              const selectedSigla = attentionByCell[key] || "";
              const horasFromType =
                attentionMapBySigla.get(selectedSigla)?.horas ?? 0;
              const backendHoras = dayBuckets[day]?.normal?.horas || 0;
              const value = editable ? horasFromType : backendHoras;
              return (
                <DataCell key={`hn-${person.id_usuario}-${day}`} $center>
                  {value}
                </DataCell>
              );
            })}
          </HoursDataRow>

          {showNovedades && (
            <>
              <NoveltyDataRow>
                <StaffNameCell>
                  {t("scheduleViewer.justificationsUpdates").toUpperCase()}
                </StaffNameCell>
                {days.map((day) => {
                  const justifications = getNoveltyJustifications(
                    dayBuckets[day]?.novedades || [],
                  );
                  return (
                    <DataCell key={`jn-${person.id_usuario}-${day}`} $center>
                      {justifications}
                    </DataCell>
                  );
                })}
              </NoveltyDataRow>

              <NoveltyDataRow $hours>
                <StaffNameCell>
                  {t("scheduleViewer.hoursUpdates").toUpperCase()}
                </StaffNameCell>
                {days.map((day) => {
                  const noveltyHours = sumNoveltyHours(
                    dayBuckets[day]?.novedades || [],
                  );
                  return (
                    <DataCell key={`hnv-${person.id_usuario}-${day}`} $center>
                      {noveltyHours}
                    </DataCell>
                  );
                })}
              </NoveltyDataRow>
            </>
          )}

          {renderPatientsRow(person)}
        </React.Fragment>
      );
    },
    [
      days,
      showNovedades,
      t,
      attentionTypes,
      attentionByCell,
      editable,
      handleAttentionChange,
      attentionMapBySigla,
      renderPatientsRow,
    ],
  );

  const renderTotalRow = useCallback(
    () => (
      <TotalDataRow>
        <StaffNameCell>
          {t("scheduleViewer.rowTotalHours").toUpperCase()}
        </StaffNameCell>
        {days.map((day) => {
          const totalHours = (monthData?.personal_de_salud || []).reduce(
            (total, person) => {
              const key = `${person.id_usuario}-${day}`;
              const selectedSigla = attentionByCell[key] || "";
              const horasFromType =
                attentionMapBySigla.get(selectedSigla)?.horas ?? 0;
              const buckets = createDayBuckets(person.dias);
              const backendHoras = buckets[day]?.normal?.horas || 0;
              const novelty = showNovedades
                ? sumNoveltyHours(buckets[day]?.novedades || [])
                : 0;
              const base = editable ? horasFromType : backendHoras;
              return total + base + novelty;
            },
            0,
          );
          return (
            <DataCell key={`total-${day}`} $center>
              {totalHours}
            </DataCell>
          );
        })}
      </TotalDataRow>
    ),
    [
      days,
      monthData?.personal_de_salud,
      showNovedades,
      t,
      editable,
      attentionByCell,
      attentionMapBySigla,
    ],
  );

  // ===== Main render =====
  if (!showTable) {
    return (
      <PageContainer>
        <ContentWrapper>
          <FormCard>
            <PageTitle>
              {editable
                ? t("scheduleViewer.titleEditable").toUpperCase()
                : t("scheduleViewer.title").toUpperCase()}
            </PageTitle>
            <PageSubtitle>
              {editable
                ? t("scheduleViewer.subtitleEditable")
                : t("scheduleViewer.subtitle")}
            </PageSubtitle>

            <FormGrid $columns={forceMunicipio ? 4 : 5}>
              <FormSelect
                aria-label="Mes"
                value={formState.selectedPeriodo?.mes ?? ""}
                onChange={(e) =>
                  handlePeriodoChange("mes", parseInt(e.target.value, 10))
                }
              >
                {sortedPeriodos.map((periodo) => (
                  <option
                    key={`${periodo.anio}-${periodo.mes}`}
                    value={periodo.mes}
                  >
                    {MONTHS[(periodo.mes - 1 + 12) % 12]}
                  </option>
                ))}
              </FormSelect>

              <FormSelect
                aria-label="Año"
                value={formState.selectedPeriodo?.anio ?? ""}
                onChange={(e) =>
                  handlePeriodoChange("anio", parseInt(e.target.value, 10))
                }
              >
                {Array.from(new Set(sortedPeriodos.map((p) => p.anio))).map(
                  (anio) => (
                    <option key={anio} value={anio}>
                      {anio}
                    </option>
                  ),
                )}
              </FormSelect>

              <FormSelect
                aria-label="Tipo de personal de salud"
                value={formState.selectedTipo ?? ""}
                onChange={(e) => handleTipoChange(parseInt(e.target.value, 10))}
              >
                {(options?.tipos_personal_salud || []).map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.nombre}
                  </option>
                ))}
              </FormSelect>

              {!forceMunicipio && (
                <FormSelect
                  aria-label="Municipio"
                  value={formState.selectedMunicipio ?? ""}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      selectedMunicipio: parseInt(e.target.value, 10),
                    }))
                  }
                >
                  {(options?.municipios || []).map((municipio) => (
                    <option key={municipio.id} value={municipio.id}>
                      {municipio.nombre}
                    </option>
                  ))}
                </FormSelect>
              )}

              <FormButton
                onClick={handleConsultar}
                disabled={loading || !isFormValid}
                aria-busy={loading}
              >
                {loading ? (
                  <LoadingSpinner />
                ) : (
                  (t("scheduleViewer.select")?.toUpperCase() ?? "CONSULTAR")
                )}
              </FormButton>
            </FormGrid>
          </FormCard>
        </ContentWrapper>
      </PageContainer>
    );
  }

  const siteHeader = monthData
    ? t("scheduleViewer.tableHeader", {
        site: monthData.municipio,
      }).toUpperCase()
    : "";

  return (
    <PageContainer>
      <ContentWrapper>
        <TableSection>
          <TableHeader>
            <BackButton onClick={handleBack}>
              <ArrowLeft size={18} />
            </BackButton>

            <SectionTitle>
              {siteHeader}
              <span>{MONTHS[monthIndex0]}</span>
            </SectionTitle>

            {!editable && (
              <DownloadButton
                onClick={handleDownload}
                disabled={!isFormValid || loading}
              >
                <Download size={18} />
                {t("scheduleViewer.download").toUpperCase()}
              </DownloadButton>
            )}
          </TableHeader>

          <TableControls>
            <FormLabel>
              <FormCheckbox
                type="checkbox"
                checked={showNovedades}
                onChange={(e) => setShowNovedades(e.target.checked)}
              />
              <span>{t("scheduleViewer.news")}</span>
            </FormLabel>

            {/* Pacientes: mostrar toggle a TODOS (verán data; solo DILIGENCIADOR edita) */}
            <FormLabel>
              <FormCheckbox
                type="checkbox"
                checked={showPacientes}
                onChange={(e) => setShowPacientes(e.target.checked)}
              />
              <span>{t("scheduleViewer.totalPatientsTreated")}</span>
            </FormLabel>

            {/* SIAU: mostrar toggle a TODOS en modo viewer; solo roles 4/5 editan */}
            {!editable && (
              <FormLabel>
                <FormCheckbox
                  type="checkbox"
                  checked={showSiau}
                  onChange={(e) => setShowSiau(e.target.checked)}
                />
                <span>{t("scheduleViewer.siauTypes") ?? "Tipos de SIAU"}</span>
              </FormLabel>
            )}
          </TableControls>

          <TableContainer>
            {loading && (
              <LoadingOverlay>
                <LoadingSpinner />
              </LoadingOverlay>
            )}

            <DataTable aria-busy={loading}>
              <TableHead>
                <tr>
                  <HeaderCell $sticky>{year}</HeaderCell>
                  {days.map((day) => (
                    <HeaderCell key={`h-${day}`}>
                      <div>{day}</div>
                      <div>{getDayAbbreviation(day, monthIndex0, year)}</div>
                    </HeaderCell>
                  ))}
                </tr>
              </TableHead>

              <TableBody>
                <tr>
                  <StaffNameCell>{MONTHS[monthIndex0]}</StaffNameCell>
                  {days.map((day) => (
                    <DataCell key={`m-${day}`} />
                  ))}
                </tr>

                {(monthData?.personal_de_salud || []).map(renderPersonRows)}

                {renderTotalRow()}
              </TableBody>
            </DataTable>
          </TableContainer>
        </TableSection>

        {/* === Tabla SIAU === */}
        {!editable && showSiau && (
          <TableSection>
            <TableHeader>
              <div />
              <SectionTitle>
                {(
                  t("scheduleViewer.siauSectionTitle") ?? "SIAU – TIPOS"
                ).toUpperCase()}
                <span>{MONTHS[monthIndex0]}</span>
              </SectionTitle>
              <div />
            </TableHeader>

            <SiauTypesTable
              loading={loading}
              year={year}
              monthIndex0={monthIndex0}
              days={days}
              monthLabel={MONTHS[monthIndex0]}
              siauTypes={siauTypes ?? []}
              canEdit={canManageSiau} // <- solo 4/5 editan; el resto ve
              valuesByKey={siauUnmetByKey}
              inputsByKey={siauInputs}
              onChangeCell={handleSiauChange}
              onBlurCell={handleSiauBlur}
            />
          </TableSection>
        )}
      </ContentWrapper>
    </PageContainer>
  );
};

export default ScheduleViewer;

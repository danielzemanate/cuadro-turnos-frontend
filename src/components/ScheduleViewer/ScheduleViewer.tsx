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
  SupportStaffButton,
  EmptyState,
  EmptyStateTitle,
  EmptyStateText,
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
  editScheduleDayWithInterval,
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
  PersonalTypesDatabase,
  RoleId,
  Roles,
  RolesDatabase,
  requiresScheduleInterval,
} from "../../constants/schedule.constants";
import { SiauTypesTable } from "./siau/SiauTypesTable";
import { SupportStaff } from "./supportStaff/SupportStaff";
import { getPatientsTraffic } from "../../helpers/PatientsColor";
import ConfirmDialog from "../Common/confirmDialog/ConfirmDialog";
import FormScheduleDayInterval from "./forms/FormScheduleDayInterval";
import {
  createEmptyInterval,
  IntervalHhMm,
  isValidScheduleIntervals,
  toApiTime,
} from "../../helpers/ScheduleIntervalHelper";

interface ScheduleViewerProps {
  editable?: boolean;
}

type PendingIntervalEdit = {
  cellKey: string;
  previousSigla: string;
  payload: IDataEditScheduleData;
  sigla: string;
};

interface FetchPatientsResponse {
  data: IPatientsData[];
}

interface FetchDataAddUnmetDemandResponse {
  data: IDataAddUnmetDemand[];
}

// Deja solo dígitos y un signo negativo al inicio (las horas de novedad pueden restar)
const sanitizeSignedInt = (raw: string): string => {
  const cleaned = raw.replace(/[^\d-]/g, "");
  const digits = cleaned.replace(/-/g, "");
  return cleaned.startsWith("-") ? `-${digits}` : digits;
};

const parseSignedInt = (raw: string | undefined): number => {
  const parsed = parseInt(raw ?? "", 10);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const NOVELTY_EDITOR_ROLES: readonly number[] = [
  RolesDatabase.COORDINADOR,
  RolesDatabase.ADMINISTRADOR,
  RolesDatabase.INGENIERO,
];

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
  //SUPPORT STAFF
  const [showSupportStaff, setShowSupportStaff] = useState<boolean>(false);

  const editableParams: IParamsGenericQuery = {
    id_user: userData.user.id,
  };

  const rolesQueForzanMunicipio = [Roles.COORDINADOR, Roles.PERSONAL_SALUD];

  const roleIdNum = userData?.roles?.id as number | undefined;

  const isAdminRole =
    roleIdNum === RolesDatabase.ADMINISTRADOR ||
    roleIdNum === RolesDatabase.INGENIERO;

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

  // SIAU solo aplica cuando el tipo de personal seleccionado es Médico
  const isMedicoSelected =
    formState.selectedTipo === PersonalTypesDatabase.MEDICO;

  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth() + 1;
  const todayDay = today.getDate();
  const selectedPeriod = formState.selectedPeriodo;
  const isCurrentSelectedMonth =
    selectedPeriod?.anio === todayYear && selectedPeriod?.mes === todayMonth;
  const previousMonth = new Date(todayYear, todayMonth - 2, 1);
  const isPreviousSelectedMonth =
    selectedPeriod?.anio === previousMonth.getFullYear() &&
    selectedPeriod?.mes === previousMonth.getMonth() + 1;
  const canEditPreviousMonthNovelties =
    !editable &&
    isPreviousSelectedMonth &&
    roleIdNum !== undefined &&
    NOVELTY_EDITOR_ROLES.includes(roleIdNum);

  // Los turnos solo se editan en meses futuros (posteriores al mes calendario actual).
  // El mes actual y anteriores quedan en solo lectura: para eso están las novedades.
  const selectedMonthValue = selectedPeriod
    ? selectedPeriod.anio * 12 + selectedPeriod.mes
    : null;
  const currentMonthValue = todayYear * 12 + todayMonth;
  const isFutureSelectedMonth =
    selectedMonthValue !== null && selectedMonthValue > currentMonthValue;
  const canEditTurnos = editable && isFutureSelectedMonth;

  const canShowNoveltyToggle = !editable || isCurrentSelectedMonth;

  const canEditNoveltyDay = useCallback(
    (day: number) => {
      if (editable) {
        return isCurrentSelectedMonth && day <= todayDay;
      }
      return canEditPreviousMonthNovelties;
    },
    [canEditPreviousMonthNovelties, editable, isCurrentSelectedMonth, todayDay],
  );

  // --- UI toggles ---
  const [showTable, setShowTable] = useState<boolean>(false);
  const [showNovedades, setShowNovedades] = useState<boolean>(false);
  const [showPacientes, setShowPacientes] = useState<boolean>(false);
  const [showSiau, setShowSiau] = useState<boolean>(false);

  // --- Attention (editable) ---
  const [attentionByCell, setAttentionByCell] = useState<
    Record<string, string>
  >({});
  const [pendingIntervalEdit, setPendingIntervalEdit] =
    useState<PendingIntervalEdit | null>(null);
  const [intervalForm, setIntervalForm] = useState<IntervalHhMm[]>([
    createEmptyInterval(),
  ]);

  // --- Novedades: tipo por celda (sigla) ---
  // Nota: solo hay 1 novedad por día y se guarda tipo_atencion en novedades
  const [noveltyByCell, setNoveltyByCell] = useState<Record<string, string>>(
    {},
  );

  // --- Novedades: horas digitadas por celda (admiten negativos) ---
  const [noveltyHoursByCell, setNoveltyHoursByCell] = useState<
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatchThunk, editable, JSON.stringify(editableParams)]);

  useEffect(() => {
    if ((editable || canEditPreviousMonthNovelties) && formState.selectedTipo) {
      const attentionParams = {
        id_tipo_personal_salud: formState.selectedTipo,
      };
      dispatchThunk(fetchAttentionTypes(attentionParams));
    }
  }, [
    canEditPreviousMonthNovelties,
    dispatchThunk,
    editable,
    formState.selectedTipo,
  ]);

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

  // Cargar mapa de atenciones inicial desde backend + novedad (sigla) por celda
  useEffect(() => {
    if (!monthData) return;

    const nextNormal: Record<string, string> = {};
    const nextNovelty: Record<string, string> = {};
    const nextNoveltyHours: Record<string, string> = {};

    monthData.personal_de_salud.forEach((p) => {
      const buckets = createDayBuckets(p.dias);
      days.forEach((d) => {
        const key = `${p.id_usuario}-${d}`;

        // Normal
        nextNormal[key] = buckets[d]?.normal?.tipo_atencion || "";

        // Novedad (solo una novedad por día y guarda tipo_atencion)
        const nov = (buckets[d]?.novedades || [])[0];
        nextNovelty[key] = nov?.tipo_atencion || "";
        nextNoveltyHours[key] = nov ? String(nov.horas ?? 0) : "";
      });
    });

    setAttentionByCell(nextNormal);
    setNoveltyByCell(nextNovelty);
    setNoveltyHoursByCell(nextNoveltyHours);
  }, [monthData, days]);

  // Forzar ocultar toggle SIAU al entrar a modo editable o si no es Médico
  useEffect(() => {
    if ((editable || !isMedicoSelected) && showSiau) setShowSiau(false);
  }, [editable, isMedicoSelected, showSiau]);

  // En gestión, las novedades solo se muestran para el mes actual
  useEffect(() => {
    if (!canShowNoveltyToggle && showNovedades) setShowNovedades(false);
  }, [canShowNoveltyToggle, showNovedades]);

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
    setNoveltyByCell({});
    setNoveltyHoursByCell({});
    setPatientsDataByKey({});
    setPatientsInput({});
    setSiauUnmetByKey({});
    setSiauInputs({});
    setShowSupportStaff(false);

    if (editable) {
      dispatchThunk(fetchEditableOptions(editableParams ?? {}));
    } else {
      dispatchThunk(fetchScheduleOptions());
    }
  }, [dispatchThunk, editable, editableParams]);

  const handleAttentionChange = useCallback(
    (idUsuario: number, day: number, newSigla: string) => {
      if (!canEditTurnos) return;
      const key = `${idUsuario}-${day}`;
      const person = monthData?.personal_de_salud.find(
        (p) => p.id_usuario === idUsuario,
      );
      const dayBuckets = person ? createDayBuckets(person.dias) : {};
      const previousSigla =
        attentionByCell[key] ?? dayBuckets[day]?.normal?.tipo_atencion ?? "";

      setAttentionByCell((prev) => ({ ...prev, [key]: newSigla }));

      const selectedType = attentionMapBySigla.get(newSigla) || null;
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

      // CE / CEC / CED en médico: pedir intervalo (>= 8 h) antes de guardar
      if (isMedicoSelected && requiresScheduleInterval(newSigla)) {
        setIntervalForm([createEmptyInterval(newSigla)]);
        setPendingIntervalEdit({
          cellKey: key,
          previousSigla,
          payload,
          sigla: newSigla,
        });
        return;
      }

      dispatchThunk(editScheduleDay(payload));
    },
    [
      attentionByCell,
      attentionMapBySigla,
      canEditTurnos,
      dispatchThunk,
      isMedicoSelected,
      monthData?.personal_de_salud,
      userData.user.id,
    ],
  );

  const handleCancelIntervalEdit = useCallback(() => {
    if (!pendingIntervalEdit) return;
    setAttentionByCell((prev) => ({
      ...prev,
      [pendingIntervalEdit.cellKey]: pendingIntervalEdit.previousSigla,
    }));
    setPendingIntervalEdit(null);
  }, [pendingIntervalEdit]);

  const handleConfirmIntervalEdit = useCallback(async () => {
    if (!pendingIntervalEdit) return;
    if (!isValidScheduleIntervals(intervalForm, pendingIntervalEdit.sigla)) {
      return;
    }

    const ok = await dispatchThunk(
      editScheduleDayWithInterval(
        pendingIntervalEdit.payload,
        intervalForm.map((item) => ({
          hora_inicio: toApiTime(item.horaInicio),
          hora_fin: toApiTime(item.horaFin),
          activo: true,
        })),
      ),
    );

    if (ok) {
      setPendingIntervalEdit(null);
    } else {
      setAttentionByCell((prev) => ({
        ...prev,
        [pendingIntervalEdit.cellKey]: pendingIntervalEdit.previousSigla,
      }));
      setPendingIntervalEdit(null);
    }
  }, [dispatchThunk, intervalForm, pendingIntervalEdit]);

  // ===== NOVEDADES: sigla obligatoria; las horas se digitan (admiten negativos) =====
  const submitNovelty = useCallback(
    (person: PersonalDeSalud, day: number, sigla: string, horas: number) => {
      if (!canEditNoveltyDay(day)) return;

      const selectedType = attentionMapBySigla.get(sigla);
      if (!selectedType) return;

      // La justificación ya no se edita en el cuadro: se reenvía la guardada
      const novedades = createDayBuckets(person.dias)[day]?.novedades || [];
      const justificacion =
        (novedades[0]?.justificacion ?? getNoveltyJustifications(novedades)) ||
        "";

      const payload: IDataEditScheduleData = {
        id_cuadro_personal: person.id_cuadro_personal,
        dia: day,
        id_tipo_atencion: selectedType.id,
        horas,
        es_novedad: true,
        justificacion,
        editor_user_id: userData.user.id,
      };

      dispatchThunk(editScheduleDay(payload));
    },
    [attentionMapBySigla, canEditNoveltyDay, dispatchThunk, userData.user.id],
  );

  const handleNoveltyTypeChange = useCallback(
    (person: PersonalDeSalud, day: number, newSigla: string) => {
      if (!canEditNoveltyDay(day)) return;

      const key = `${person.id_usuario}-${day}`;
      setNoveltyByCell((prev) => ({ ...prev, [key]: newSigla }));

      // Sigla obligatoria: si la limpian, solo bloqueamos edición (no enviamos)
      if (!newSigla) return;

      const horas = parseSignedInt(noveltyHoursByCell[key]);
      setNoveltyHoursByCell((prev) => ({ ...prev, [key]: String(horas) }));
      submitNovelty(person, day, newSigla, horas);
    },
    [canEditNoveltyDay, noveltyHoursByCell, submitNovelty],
  );

  const handleNoveltyHoursChange = useCallback(
    (userId: number, day: number, value: string) => {
      if (!canEditNoveltyDay(day)) return;

      const key = `${userId}-${day}`;
      setNoveltyHoursByCell((prev) => ({
        ...prev,
        [key]: sanitizeSignedInt(value),
      }));
    },
    [canEditNoveltyDay],
  );

  const handleNoveltyHoursBlur = useCallback(
    (person: PersonalDeSalud, day: number) => {
      if (!canEditNoveltyDay(day)) return;

      const key = `${person.id_usuario}-${day}`;
      const sigla = noveltyByCell[key];
      if (!sigla) return;

      const horas = parseSignedInt(noveltyHoursByCell[key]);
      setNoveltyHoursByCell((prev) => ({ ...prev, [key]: String(horas) }));
      submitNovelty(person, day, sigla, horas);
    },
    [canEditNoveltyDay, noveltyByCell, noveltyHoursByCell, submitNovelty],
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

  const refetchMonthAfterEdit = useCallback(() => {
    if (!isFormValid) return;
    const municipioId = forceMunicipio ?? formState.selectedMunicipio!;
    const params: IScheduleMonthParams = {
      anio: formState.selectedPeriodo!.anio,
      mes: formState.selectedPeriodo!.mes,
      id_tipo_personal_salud: formState.selectedTipo!,
      id_municipio: municipioId,
    };
    setTimeout(() => {
      dispatchThunk(fetchScheduleByMonth(params));
    }, 300);
  }, [dispatchThunk, forceMunicipio, formState, isFormValid]);

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

  //CALCULO DOCTORES POR DIA CON CE
  const ceDoctorsByDay = useMemo(() => {
    const counts: Record<number, number> = {};

    // Inicializar en 0 para cada día
    (days || []).forEach((d) => (counts[d] = 0));

    (monthData?.personal_de_salud || []).forEach((person) => {
      const buckets = createDayBuckets(person.dias);

      (days || []).forEach((d) => {
        const sigla = buckets[d]?.normal?.tipo_atencion || "";
        if (sigla === "CE") counts[d] += 1;
      });
    });

    return counts; // { 1: 3, 2: 5, ... }
  }, [monthData?.personal_de_salud, days]);

  // El backend responde 404 cuando no existe cuadro para los filtros elegidos
  const hasScheduleData = useMemo(
    () => (monthData?.personal_de_salud?.length ?? 0) > 0,
    [monthData?.personal_de_salud],
  );

  const staffInSchedule = useMemo(() => {
    const list = (monthData?.personal_de_salud ?? []).map((p) => ({
      id: p.id_usuario,
      nombre: p.nombre,
      apellidos: p.apellidos,
    }));
    return list;
  }, [monthData?.personal_de_salud]);
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
            const raw = patientsInput[key] ?? "";
            const currentPatients = raw === "" ? 0 : parseInt(raw, 10);
            const traffic = getPatientsTraffic(
              Number.isNaN(currentPatients) ? 0 : currentPatients,
            );

            return (
              <DataCell key={`patients-${person.id_usuario}-${day}`} $center>
                {canManagePatients ? (
                  <InputField
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={raw}
                    $traffic={traffic}
                    onChange={(e) =>
                      handlePatientsChange(
                        person.id_usuario,
                        day,
                        e.target.value.replace(/\D/g, ""),
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
                  {canEditTurnos ? (
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
              const value = canEditTurnos ? horasFromType : backendHoras;

              return (
                <DataCell key={`hn-${person.id_usuario}-${day}`} $center>
                  {value}
                </DataCell>
              );
            })}
          </HoursDataRow>

          {showNovedades && (
            <>
              {/* === SIGLA NOVEDAD (OBLIGATORIA) === */}
              <NoveltyDataRow>
                <StaffNameCell>{"TIPO DE ATENCION *"}</StaffNameCell>
                {days.map((day) => {
                  const key = `${person.id_usuario}-${day}`;
                  const backendNoveltySigla =
                    (dayBuckets[day]?.novedades || [])[0]?.tipo_atencion || "";
                  const currentNoveltySigla =
                    noveltyByCell[key] ?? backendNoveltySigla;
                  const canEditDay = canEditNoveltyDay(day);

                  return (
                    <DataCell key={`sn-${person.id_usuario}-${day}`} $center>
                      {canEditDay ? (
                        <SelectField
                          value={currentNoveltySigla || ""}
                          onChange={(e) =>
                            handleNoveltyTypeChange(person, day, e.target.value)
                          }
                          aria-label={`Sigla novedad día ${day} - ${formatPersonName(
                            person.nombre,
                            person.apellidos,
                          )}`}
                        >
                          <option value="">{"-"}</option>
                          {(attentionTypes || []).map((a) => (
                            <option
                              key={`nov-${a.id}`}
                              value={a.sigla}
                              title={`${a.sigla} - ${a.nombre}`}
                            >
                              {a.sigla}
                            </option>
                          ))}
                        </SelectField>
                      ) : (
                        currentNoveltySigla
                      )}
                    </DataCell>
                  );
                })}
              </NoveltyDataRow>

              {/* === HORAS NOVEDADES (digitadas, admiten negativos) === */}
              <NoveltyDataRow $hours>
                <StaffNameCell>
                  {t("scheduleViewer.hoursUpdates").toUpperCase()}
                </StaffNameCell>
                {days.map((day) => {
                  const novedades = dayBuckets[day]?.novedades || [];
                  const nov = novedades[0];
                  const key = `${person.id_usuario}-${day}`;
                  const noveltySigla =
                    noveltyByCell[key] ?? nov?.tipo_atencion ?? "";
                  const canEditDay = canEditNoveltyDay(day);
                  const canEditCell = canEditDay && !!noveltySigla;
                  const backendHoras =
                    Number(nov?.horas ?? sumNoveltyHours(novedades)) || 0;

                  return (
                    <DataCell key={`hnv-${person.id_usuario}-${day}`} $center>
                      {canEditDay ? (
                        <InputField
                          type="text"
                          inputMode="numeric"
                          value={noveltyHoursByCell[key] ?? ""}
                          disabled={!canEditCell}
                          placeholder={!canEditCell ? "Seleccione sigla" : ""}
                          onChange={(e) =>
                            handleNoveltyHoursChange(
                              person.id_usuario,
                              day,
                              e.target.value,
                            )
                          }
                          onBlur={() => handleNoveltyHoursBlur(person, day)}
                          aria-label={`Horas novedad día ${day} - ${formatPersonName(
                            person.nombre,
                            person.apellidos,
                          )}`}
                        />
                      ) : (
                        backendHoras
                      )}
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
      attentionByCell,
      attentionMapBySigla,
      attentionTypes,
      canEditNoveltyDay,
      canEditTurnos,
      days,
      handleAttentionChange,
      handleNoveltyHoursBlur,
      handleNoveltyHoursChange,
      handleNoveltyTypeChange,
      noveltyByCell,
      noveltyHoursByCell,
      renderPatientsRow,
      showNovedades,
      t,
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

              const noveltySigla =
                noveltyByCell[key] ??
                (buckets[day]?.novedades || [])[0]?.tipo_atencion ??
                "";
              const typedNoveltyHours = noveltySigla
                ? parseSignedInt(noveltyHoursByCell[key])
                : 0;
              const backendNoveltyHours = showNovedades
                ? Number(
                    (buckets[day]?.novedades || [])[0]?.horas ??
                      sumNoveltyHours(buckets[day]?.novedades || []),
                  ) || 0
                : 0;

              const base = canEditTurnos ? horasFromType : backendHoras;
              const novelty = showNovedades
                ? canEditNoveltyDay(day)
                  ? typedNoveltyHours
                  : backendNoveltyHours
                : 0;
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
      attentionByCell,
      attentionMapBySigla,
      canEditNoveltyDay,
      canEditTurnos,
      days,
      monthData?.personal_de_salud,
      noveltyByCell,
      noveltyHoursByCell,
      showNovedades,
      t,
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

  const selectedTipoNombre =
    (options?.tipos_personal_salud || []).find(
      (tipo) => tipo.id === formState.selectedTipo,
    )?.nombre || t("scheduleViewer.healthPersonnelType");

  const selectedMunicipioId = forceMunicipio ?? formState.selectedMunicipio;
  const selectedMunicipioNombre =
    (options?.municipios || []).find(
      (municipio) => municipio.id === selectedMunicipioId,
    )?.nombre || "";

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

            {!editable && hasScheduleData && (
              <DownloadButton
                onClick={handleDownload}
                disabled={!isFormValid || loading}
              >
                <Download size={18} />
                {t("scheduleViewer.download").toUpperCase()}
              </DownloadButton>
            )}
            {editable && isAdminRole && hasScheduleData && (
              <SupportStaffButton
                type="button"
                onClick={() => setShowSupportStaff((prev) => !prev)}
                disabled={loading}
                style={{ marginLeft: "auto" }}
              >
                {showSupportStaff
                  ? t("scheduleViewer.closeSupportStaff").toUpperCase()
                  : t("scheduleViewer.supportStaffTitle").toUpperCase()}
              </SupportStaffButton>
            )}
          </TableHeader>
          {!hasScheduleData ? (
            <EmptyState>
              {loading ? (
                <LoadingSpinner />
              ) : (
                <>
                  <EmptyStateTitle>
                    {t("scheduleViewer.noDataTitle")}
                  </EmptyStateTitle>
                  <EmptyStateText>
                    {t("scheduleViewer.noDataDescription", {
                      tipoPersonal: selectedTipoNombre,
                      municipio: selectedMunicipioNombre,
                    })}
                  </EmptyStateText>
                </>
              )}
            </EmptyState>
          ) : showSupportStaff ? (
            <SupportStaff
              idCuadroMes={monthData.mes}
              idTipoPersonalSalud={formState.selectedTipo!}
              municipioNombre={monthData.municipio}
              tipoPersonalNombre={
                (options?.tipos_personal_salud || []).find(
                  (t) => t.id === formState.selectedTipo,
                )?.nombre || ""
              }
              scheduleStaff={staffInSchedule}
              onSuccess={refetchMonthAfterEdit}
            />
          ) : (
            <>
              <TableControls>
                {canShowNoveltyToggle && (
                  <FormLabel>
                    <FormCheckbox
                      type="checkbox"
                      checked={showNovedades}
                      onChange={(e) => setShowNovedades(e.target.checked)}
                    />
                    <span>{t("scheduleViewer.news")}</span>
                  </FormLabel>
                )}

                {/* Pacientes: mostrar toggle a TODOS (verán data; solo DILIGENCIADOR edita) */}
                <FormLabel>
                  <FormCheckbox
                    type="checkbox"
                    checked={showPacientes}
                    onChange={(e) => setShowPacientes(e.target.checked)}
                  />
                  <span>{t("scheduleViewer.totalPatientsTreated")}</span>
                </FormLabel>

                {/* SIAU: solo para Médico en modo viewer; solo roles SIAU editan */}
                {!editable && isMedicoSelected && (
                  <FormLabel>
                    <FormCheckbox
                      type="checkbox"
                      checked={showSiau}
                      onChange={(e) => setShowSiau(e.target.checked)}
                    />
                    <span>
                      {t("scheduleViewer.siauTypes") ?? "Tipos de SIAU"}
                    </span>
                  </FormLabel>
                )}
              </TableControls>

              {editable && !isFutureSelectedMonth && (
                <EmptyStateText style={{ margin: "0 0 0.75rem" }}>
                  {t("scheduleViewer.turnosReadOnlyHint")}
                </EmptyStateText>
              )}

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
                          <div>
                            {getDayAbbreviation(day, monthIndex0, year)}
                          </div>
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
            </>
          )}
        </TableSection>

        {/* === Tabla SIAU (solo Médico) === */}
        {!editable && isMedicoSelected && showSiau && hasScheduleData && (
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
              canEdit={canManageSiau}
              valuesByKey={siauUnmetByKey}
              inputsByKey={siauInputs}
              onChangeCell={handleSiauChange}
              onBlurCell={handleSiauBlur}
              ceDoctorsByDay={ceDoctorsByDay}
            />
          </TableSection>
        )}
      </ContentWrapper>

      <ConfirmDialog
        open={Boolean(pendingIntervalEdit)}
        title={t("scheduleViewer.interval.title")}
        description={
          pendingIntervalEdit ? (
            <FormScheduleDayInterval
              sigla={pendingIntervalEdit.sigla}
              values={intervalForm}
              onChange={setIntervalForm}
            />
          ) : null
        }
        confirmText={t("scheduleViewer.interval.confirm")}
        cancelText={t("common.cancel")}
        onConfirm={handleConfirmIntervalEdit}
        onCancel={handleCancelIntervalEdit}
        loading={loading}
        confirmDisabled={
          !pendingIntervalEdit ||
          !isValidScheduleIntervals(intervalForm, pendingIntervalEdit.sigla)
        }
      />
    </PageContainer>
  );
};

export default ScheduleViewer;

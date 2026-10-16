import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Bell } from "lucide-react";
import { searchUsers } from "../../redux/actions/administrationActions";
import {
  createVacation,
  fetchAllVacationAlerts,
  fetchVacationById,
  fetchVacationOptions,
  fetchVacations,
  resolveVacation,
} from "../../redux/actions/vacationsActions";
import { AppState } from "../../redux/reducers/rootReducer";
import { useAppDispatchThunk } from "../../hooks/storeHooks";
import { IUserListItem } from "../../interfaces/administration";
import {
  IVacationAlert,
  IVacationAlertsFilters,
  IVacationListFilters,
  IVacationOptions,
  IVacationRequest,
  VacationDecision,
  VacationLevel,
  VacationStatus,
} from "../../interfaces/vacations";
import {
  DEFAULT_VACATIONS_PAGE_SIZE,
  MAX_VACATION_DAYS,
  MAX_VACATION_OBSERVATION_LENGTH,
  VACATION_STATUSES,
  VACATION_USERS_SEARCH_PER_PAGE,
  VACATIONS_PAGE_SIZE_OPTIONS,
} from "../../constants/vacations.constants";
import { Column, DataTable } from "../Common/table/DataTable";
import Pagination from "../Common/pagination/Pagination";
import LoadingSpinner from "../Shared/LoadingSpinner/LoadingSpinner";
import { useDelayedLoading } from "../../hooks/useDelayedLoading";
import ConfirmDialog from "../Common/confirmDialog/ConfirmDialog";
import {
  AlertBar,
  AlertButton,
  AlertCard,
  AlertCount,
  AlertHeader,
  AlertList,
  AlertMessage,
  AlertTitle,
  Backdrop,
  CriticalList,
  DangerButton,
  DetailLabel,
  DetailList,
  DetailRow,
  DetailValue,
  DialogField,
  DialogHint,
  DialogLabel,
  DialogTextArea,
  EmptyHint,
  FieldError,
  FilterActions,
  FilterButton,
  FilterGroup,
  FilterInput,
  FilterLabel,
  FilterSelect,
  FiltersRow,
  GhostButton,
  InlineButtons,
  MetaGrid,
  MetaItem,
  MetaLabel,
  MetaValue,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  PrimaryButton,
  SecondaryButton,
  StatusBadge,
  Subheading,
  TextButton,
  VacationsCard,
} from "./VacationsStyles";

type VacationMode = "personal" | "admin";

type RequestFilterForm = {
  id_municipio: number | "";
  id_tipo_personal_salud: number | "";
  estado: VacationStatus | "";
  id_usuario: number | "";
  fecha_desde: string;
  fecha_hasta: string;
};

type CreateForm = {
  fecha_inicio: string;
  fecha_fin: string;
  observacion: string;
};

const emptyRequestFilters: RequestFilterForm = {
  id_municipio: "",
  id_tipo_personal_salud: "",
  estado: "",
  id_usuario: "",
  fecha_desde: "",
  fecha_hasta: "",
};

const emptyCreateForm: CreateForm = {
  fecha_inicio: "",
  fecha_fin: "",
  observacion: "",
};

const emptyOptions: IVacationOptions = {
  municipios: [],
  tipos_personal_salud: [],
  puede_resolver: false,
};

const inclusiveDays = (start: string, end: string): number | null => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(start) || !/^\d{4}-\d{2}-\d{2}$/.test(end)) {
    return null;
  }
  const [ys, ms, ds] = start.split("-").map(Number);
  const [ye, me, de] = end.split("-").map(Number);
  const from = Date.UTC(ys, ms - 1, ds);
  const to = Date.UTC(ye, me - 1, de);
  return Math.round((to - from) / 86400000) + 1;
};

const formatIsoDate = (value: string | null | undefined): string => {
  if (!value) return "—";
  const [year, month, day] = value.slice(0, 10).split("-");
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
};

const formatIsoDateTime = (value: string | null | undefined): string => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return formatIsoDate(value);
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Bogota",
  }).format(date);
};

const formatPercent = (value: number | null): string => {
  if (value == null) return "—";
  return `${new Intl.NumberFormat("es-CO", { maximumFractionDigits: 2 }).format(value)} %`;
};

const clip = (value: string | null | undefined, max = 48): string => {
  const text = (value ?? "").trim();
  if (!text) return "—";
  return text.length > max ? `${text.slice(0, max)}...` : text;
};

const statusTone = (status: VacationStatus) => {
  if (status === "APROBADA") return "approved" as const;
  if (status === "RECHAZADA") return "rejected" as const;
  return "pending" as const;
};

const levelTone = (level: VacationLevel) => {
  if (level === "ALTO") return "high" as const;
  if (level === "ADVERTENCIA") return "warning" as const;
  if (level === "SIN_ALERTA") return "approved" as const;
  return "critical" as const;
};

type VacationsProps = {
  mode?: VacationMode;
};

const Vacations: React.FC<VacationsProps> = ({ mode = "personal" }) => {
  const { t } = useTranslation();
  const dispatchThunk = useAppDispatchThunk();
  const { loading } = useSelector((state: AppState) => state.helpers);
  const showLoading = useDelayedLoading(loading);
  const user = useSelector((state: AppState) => state.user.userData?.user);
  const isAdmin = mode === "admin";
  const userId = user?.id;
  const municipioId = user?.id_municipio || null;
  const tipoId = user?.id_tipo_personal_salud || null;
  const hasContext = Boolean(municipioId && tipoId);
  const lockedMunicipioId = isAdmin && municipioId ? municipioId : null;

  const [options, setOptions] = useState<IVacationOptions>(emptyOptions);
  const [filters, setFilters] =
    useState<RequestFilterForm>(emptyRequestFilters);
  const [appliedFilters, setAppliedFilters] =
    useState<RequestFilterForm>(emptyRequestFilters);
  const [filterError, setFilterError] = useState("");
  const [items, setItems] = useState<IVacationRequest[]>([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(DEFAULT_VACATIONS_PAGE_SIZE);
  const [total, setTotal] = useState(0);
  const [staff, setStaff] = useState<IUserListItem[]>([]);

  const [alerts, setAlerts] = useState<IVacationAlert[]>([]);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const alertsAnnounced = useRef(false);

  const [detailOpen, setDetailOpen] = useState(false);
  const [selected, setSelected] = useState<IVacationRequest | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<CreateForm>(emptyCreateForm);
  const [createError, setCreateError] = useState("");
  const [resolveKind, setResolveKind] = useState<VacationDecision | null>(null);
  const [resolveNote, setResolveNote] = useState("");
  const [resolveTouched, setResolveTouched] = useState(false);

  const buildRequestQuery = useCallback(
    (
      source: RequestFilterForm,
      nextPage: number,
      nextPerPage: number,
    ): IVacationListFilters | null => {
      if (!isAdmin && !userId) return null;
      const query: IVacationListFilters = {
        page: nextPage,
        page_size: nextPerPage,
      };
      if (!isAdmin && userId) query.id_usuario = userId;
      if (isAdmin) {
        const municipio = lockedMunicipioId || source.id_municipio;
        if (municipio) query.id_municipio = Number(municipio);
        if (source.id_tipo_personal_salud) {
          query.id_tipo_personal_salud = Number(source.id_tipo_personal_salud);
        }
        if (source.id_usuario) query.id_usuario = Number(source.id_usuario);
      }
      if (source.estado) query.estado = source.estado;
      if (source.fecha_desde) query.fecha_desde = source.fecha_desde;
      if (source.fecha_hasta) query.fecha_hasta = source.fecha_hasta;
      return query;
    },
    [isAdmin, lockedMunicipioId, userId],
  );

  const loadRequests = useCallback(
    async (
      source: RequestFilterForm,
      nextPage: number,
      nextPerPage: number,
    ) => {
      const query = buildRequestQuery(source, nextPage, nextPerPage);
      if (!query) return;
      const response = await dispatchThunk(fetchVacations(query));
      if (response) {
        setItems(response.items ?? []);
        setTotal(response.total ?? 0);
        setPage(response.page ?? nextPage);
      } else {
        setItems([]);
        setTotal(0);
      }
    },
    [buildRequestQuery, dispatchThunk],
  );

  const loadAlerts = useCallback(async () => {
    if (!isAdmin) return [];
    const filters: IVacationAlertsFilters = { escenario: "proyeccion" };
    if (lockedMunicipioId) filters.id_municipio = lockedMunicipioId;
    const loaded = await dispatchThunk(fetchAllVacationAlerts(filters));
    if (loaded) {
      setAlerts(loaded);
      return loaded;
    }
    setAlerts([]);
    return [];
  }, [dispatchThunk, isAdmin, lockedMunicipioId]);

  useEffect(() => {
    let cancelled = false;
    const boot = async () => {
      const nextOptions = await dispatchThunk(fetchVacationOptions());
      if (cancelled) return;
      if (nextOptions) setOptions(nextOptions);
      await loadRequests(emptyRequestFilters, 1, DEFAULT_VACATIONS_PAGE_SIZE);
      if (cancelled || !isAdmin) return;
      const loaded = await loadAlerts();
      if (!cancelled && loaded.length > 0 && !alertsAnnounced.current) {
        alertsAnnounced.current = true;
        setAlertsOpen(true);
      }
    };
    boot();
    return () => {
      cancelled = true;
    };
  }, [dispatchThunk, isAdmin, loadAlerts, loadRequests]);

  const staffMunicipioId = lockedMunicipioId || filters.id_municipio;

  useEffect(() => {
    if (!isAdmin || !staffMunicipioId || !filters.id_tipo_personal_salud) {
      setStaff([]);
      return;
    }
    let cancelled = false;
    const loadStaff = async () => {
      const list = await dispatchThunk(
        searchUsers({
          id_municipio: Number(staffMunicipioId),
          id_tipo_personal_salud: Number(filters.id_tipo_personal_salud),
          es_personal_salud: true,
          activo: true,
          page: 1,
          per_page: VACATION_USERS_SEARCH_PER_PAGE,
          sort_by: "id",
          sort_dir: "asc",
        }),
      );
      if (!cancelled) setStaff(list);
    };
    loadStaff();
    return () => {
      cancelled = true;
    };
  }, [
    dispatchThunk,
    filters.id_tipo_personal_salud,
    isAdmin,
    staffMunicipioId,
  ]);

  const dateRangeError = (from: string, to: string): string => {
    if (from && to && from > to) return t("vacations.errors.endBeforeStart");
    if (from && to) {
      const days = inclusiveDays(from, to);
      if (days != null && (days < 1 || days > MAX_VACATION_DAYS)) {
        return t("vacations.errors.maxDays", { days: MAX_VACATION_DAYS });
      }
    }
    return "";
  };

  const handleFilter = () => {
    const error = dateRangeError(filters.fecha_desde, filters.fecha_hasta);
    setFilterError(error);
    if (error) return;
    setAppliedFilters(filters);
    setPage(1);
    loadRequests(filters, 1, perPage);
  };

  const handleClear = () => {
    setFilters(emptyRequestFilters);
    setAppliedFilters(emptyRequestFilters);
    setFilterError("");
    setStaff([]);
    setPage(1);
    loadRequests(emptyRequestFilters, 1, perPage);
  };

  const openDetail = async (solicitudId: number) => {
    const data = await dispatchThunk(fetchVacationById(solicitudId));
    if (!data) return;
    setSelected(data);
    setDetailOpen(true);
  };

  const openCreate = () => {
    setCreateForm(emptyCreateForm);
    setCreateError("");
    setCreateOpen(true);
  };

  const validateCreate = (): string => {
    if (!hasContext || !municipioId || !tipoId) {
      return t("vacations.context.missing");
    }
    if (!createForm.fecha_inicio || !createForm.fecha_fin) {
      return t("vacations.errors.datesRequired");
    }
    if (createForm.fecha_fin < createForm.fecha_inicio) {
      return t("vacations.errors.endBeforeStart");
    }
    const days = inclusiveDays(createForm.fecha_inicio, createForm.fecha_fin);
    if (days == null || days < 1 || days > MAX_VACATION_DAYS) {
      return t("vacations.errors.maxDays", { days: MAX_VACATION_DAYS });
    }
    if (
      createForm.observacion.trim().length > MAX_VACATION_OBSERVATION_LENGTH
    ) {
      return t("vacations.errors.observationLength", {
        max: MAX_VACATION_OBSERVATION_LENGTH,
      });
    }
    return "";
  };

  const submitCreate = async () => {
    const error = validateCreate();
    setCreateError(error);
    if (error || !municipioId || !tipoId) return;
    const ok = await dispatchThunk(
      createVacation({
        id_municipio: municipioId,
        id_tipo_personal_salud: tipoId,
        fecha_inicio: createForm.fecha_inicio,
        fecha_fin: createForm.fecha_fin,
        observacion_solicitante: createForm.observacion.trim() || null,
      }),
    );
    if (!ok) return;
    setCreateOpen(false);
    setAppliedFilters(appliedFilters);
    setPage(1);
    loadRequests(appliedFilters, 1, perPage);
  };

  const openResolve = (kind: VacationDecision) => {
    setResolveKind(kind);
    setResolveNote("");
    setResolveTouched(false);
  };

  const submitResolve = async () => {
    setResolveTouched(true);
    if (!selected || !resolveKind) return;
    const note = resolveNote.trim();
    if (resolveKind === "RECHAZADA" && !note) return;
    if (note.length > MAX_VACATION_OBSERVATION_LENGTH) return;
    const updated = await dispatchThunk(
      resolveVacation(selected.id, {
        estado: resolveKind,
        observacion_resolucion: note || null,
      }),
    );
    if (!updated) return;
    setResolveKind(null);
    setSelected(updated);
    loadRequests(appliedFilters, page, perPage);
    if (isAdmin) loadAlerts();
  };

  const canResolve =
    isAdmin && options.puede_resolver && selected?.estado === "PENDIENTE";

  const columns: Column<IVacationRequest>[] = useMemo(() => {
    const statusColumn: Column<IVacationRequest> = {
      key: "estado",
      header: t("vacations.columns.status"),
      render: (row) => (
        <StatusBadge $tone={statusTone(row.estado)}>
          {t(`vacations.status.${row.estado}`)}
        </StatusBadge>
      ),
    };
    const shared: Column<IVacationRequest>[] = [
      {
        key: "fecha_inicio",
        header: t("vacations.columns.start"),
        render: (row) => formatIsoDate(row.fecha_inicio),
      },
      {
        key: "fecha_fin",
        header: t("vacations.columns.end"),
        render: (row) => formatIsoDate(row.fecha_fin),
      },
      {
        key: "dias_calendario",
        header: t("vacations.columns.days"),
      },
      statusColumn,
      {
        key: "observacion_solicitante",
        header: t("vacations.columns.observation"),
        render: (row) => clip(row.observacion_solicitante),
      },
      {
        key: "creado_en",
        header: t("vacations.columns.createdAt"),
        render: (row) => formatIsoDateTime(row.creado_en),
      },
    ];
    if (!isAdmin) return shared;
    return [
      {
        key: "nombre_usuario",
        header: t("vacations.columns.user"),
      },
      {
        key: "nombre_municipio",
        header: t("vacations.columns.municipality"),
      },
      {
        key: "nombre_tipo_personal_salud",
        header: t("vacations.columns.staffType"),
      },
      ...shared,
      {
        key: "fecha_resolucion",
        header: t("vacations.columns.resolvedAt"),
        render: (row) => formatIsoDateTime(row.fecha_resolucion),
      },
      {
        key: "id_resuelto_por",
        header: t("vacations.columns.resolvedBy"),
        render: (row) =>
          row.id_resuelto_por
            ? t("vacations.detail.resolvedById", { id: row.id_resuelto_por })
            : "—",
      },
    ];
  }, [isAdmin, t]);

  const renderRequestFilters = () => (
    <>
      <FiltersRow>
        {isAdmin && (
          <>
            {!lockedMunicipioId && (
              <FilterGroup>
                <FilterLabel>{t("vacations.filters.municipality")}</FilterLabel>
                <FilterSelect
                  value={filters.id_municipio}
                  disabled={loading}
                  onChange={(event) =>
                    setFilters((prev) => ({
                      ...prev,
                      id_municipio: event.target.value
                        ? Number(event.target.value)
                        : "",
                      id_usuario: "",
                    }))
                  }
                >
                  <option value="">{t("common.all")}</option>
                  {options.municipios.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.nombre}
                    </option>
                  ))}
                </FilterSelect>
              </FilterGroup>
            )}
            <FilterGroup>
              <FilterLabel>{t("vacations.filters.staffType")}</FilterLabel>
              <FilterSelect
                value={filters.id_tipo_personal_salud}
                disabled={loading}
                onChange={(event) =>
                  setFilters((prev) => ({
                    ...prev,
                    id_tipo_personal_salud: event.target.value
                      ? Number(event.target.value)
                      : "",
                    id_usuario: "",
                  }))
                }
              >
                <option value="">{t("common.all")}</option>
                {options.tipos_personal_salud.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nombre}
                  </option>
                ))}
              </FilterSelect>
            </FilterGroup>
            <FilterGroup>
              <FilterLabel>{t("vacations.filters.user")}</FilterLabel>
              <FilterSelect
                value={filters.id_usuario}
                disabled={
                  loading ||
                  !staffMunicipioId ||
                  !filters.id_tipo_personal_salud
                }
                onChange={(event) =>
                  setFilters((prev) => ({
                    ...prev,
                    id_usuario: event.target.value
                      ? Number(event.target.value)
                      : "",
                  }))
                }
              >
                <option value="">{t("common.all")}</option>
                {staff.map((person) => (
                  <option key={person.id} value={person.id}>
                    {`${person.nombre} ${person.apellidos}`.trim()}
                  </option>
                ))}
              </FilterSelect>
            </FilterGroup>
          </>
        )}
        <FilterGroup>
          <FilterLabel>{t("vacations.filters.status")}</FilterLabel>
          <FilterSelect
            value={filters.estado}
            disabled={loading}
            onChange={(event) =>
              setFilters((prev) => ({
                ...prev,
                estado: event.target.value as VacationStatus | "",
              }))
            }
          >
            <option value="">{t("common.all")}</option>
            {VACATION_STATUSES.map((status) => (
              <option key={status} value={status}>
                {t(`vacations.status.${status}`)}
              </option>
            ))}
          </FilterSelect>
        </FilterGroup>
        <FilterGroup>
          <FilterLabel>{t("vacations.filters.dateFrom")}</FilterLabel>
          <FilterInput
            type="date"
            value={filters.fecha_desde}
            disabled={loading}
            onChange={(event) =>
              setFilters((prev) => ({
                ...prev,
                fecha_desde: event.target.value,
              }))
            }
          />
        </FilterGroup>
        <FilterGroup>
          <FilterLabel>{t("vacations.filters.dateTo")}</FilterLabel>
          <FilterInput
            type="date"
            value={filters.fecha_hasta}
            disabled={loading}
            onChange={(event) =>
              setFilters((prev) => ({
                ...prev,
                fecha_hasta: event.target.value,
              }))
            }
          />
        </FilterGroup>
        <FilterActions>
          <FilterButton type="button" onClick={handleFilter} disabled={loading}>
            {t("common.filter")}
          </FilterButton>
          <SecondaryButton
            type="button"
            onClick={handleClear}
            disabled={loading}
          >
            {t("common.clear")}
          </SecondaryButton>
        </FilterActions>
      </FiltersRow>
      {isAdmin && (!staffMunicipioId || !filters.id_tipo_personal_salud) && (
        <EmptyHint>
          {lockedMunicipioId
            ? t("vacations.filters.userHintLocked")
            : t("vacations.filters.userHint")}
        </EmptyHint>
      )}
      {filterError && <FieldError>{filterError}</FieldError>}
    </>
  );

  const renderAlertList = () => (
    <>
      {alerts.length === 0 ? (
        <EmptyHint>{t("vacations.alerts.empty")}</EmptyHint>
      ) : (
        <AlertList>
          {alerts.map((alert) => (
            <AlertCard
              key={`${alert.id_municipio}-${alert.id_tipo_personal_salud}`}
            >
              <AlertHeader>
                <AlertTitle>
                  {alert.nombre_municipio} · {alert.nombre_tipo_personal_salud}
                </AlertTitle>
                <StatusBadge $tone={levelTone(alert.nivel_maximo)}>
                  {t(`vacations.level.${alert.nivel_maximo}`)}
                </StatusBadge>
              </AlertHeader>
              <AlertMessage>{alert.alerta}</AlertMessage>
              <MetaGrid>
                <MetaItem>
                  <MetaLabel>{t("vacations.alerts.range")}</MetaLabel>
                  <MetaValue>
                    {formatIsoDate(alert.fecha_desde)} –{" "}
                    {formatIsoDate(alert.fecha_hasta)}
                  </MetaValue>
                </MetaItem>
                <MetaItem>
                  <MetaLabel>{t("vacations.alerts.totalStaff")}</MetaLabel>
                  <MetaValue>{alert.total_personal}</MetaValue>
                </MetaItem>
                <MetaItem>
                  <MetaLabel>{t("vacations.alerts.maxAbsent")}</MetaLabel>
                  <MetaValue>{alert.maximo_personal_ausente}</MetaValue>
                </MetaItem>
                <MetaItem>
                  <MetaLabel>{t("vacations.alerts.maxPercent")}</MetaLabel>
                  <MetaValue>
                    {formatPercent(alert.porcentaje_maximo)}
                  </MetaValue>
                </MetaItem>
                <MetaItem>
                  <MetaLabel>{t("vacations.alerts.peakDate")}</MetaLabel>
                  <MetaValue>
                    {formatIsoDate(alert.fecha_maximo_riesgo)}
                  </MetaValue>
                </MetaItem>
              </MetaGrid>
              <Subheading>{t("vacations.alerts.criticalDays")}</Subheading>
              {alert.dias_criticos.length === 0 ? (
                <EmptyHint>{t("vacations.alerts.noCriticalDays")}</EmptyHint>
              ) : (
                <CriticalList>
                  {alert.dias_criticos.map((day) => (
                    <li key={day.fecha}>
                      {formatIsoDate(day.fecha)} · {day.personal_ausente} ·{" "}
                      {formatPercent(day.porcentaje)} ·{" "}
                      {t(`vacations.level.${day.nivel}`)}
                    </li>
                  ))}
                </CriticalList>
              )}
              <Subheading>{t("vacations.alerts.involved")}</Subheading>
              {alert.solicitudes_involucradas.length === 0 ? (
                <EmptyHint>{t("vacations.alerts.noRequests")}</EmptyHint>
              ) : (
                <InlineButtons>
                  {alert.solicitudes_involucradas.map((solicitudId) => (
                    <TextButton
                      key={solicitudId}
                      type="button"
                      onClick={() => openDetail(solicitudId)}
                    >
                      #{solicitudId}
                    </TextButton>
                  ))}
                </InlineButtons>
              )}
            </AlertCard>
          ))}
        </AlertList>
      )}
    </>
  );

  const detailRows: Array<{ label: string; value: React.ReactNode }> = selected
    ? [
        {
          label: t("vacations.columns.status"),
          value: (
            <StatusBadge $tone={statusTone(selected.estado)}>
              {t(`vacations.status.${selected.estado}`)}
            </StatusBadge>
          ),
        },
        {
          label: t("vacations.columns.user"),
          value: selected.nombre_usuario,
        },
        {
          label: t("vacations.columns.municipality"),
          value: selected.nombre_municipio,
        },
        {
          label: t("vacations.columns.staffType"),
          value: selected.nombre_tipo_personal_salud,
        },
        {
          label: t("vacations.columns.start"),
          value: formatIsoDate(selected.fecha_inicio),
        },
        {
          label: t("vacations.columns.end"),
          value: formatIsoDate(selected.fecha_fin),
        },
        {
          label: t("vacations.columns.days"),
          value: selected.dias_calendario,
        },
        {
          label: t("vacations.columns.observation"),
          value: selected.observacion_solicitante?.trim() || "—",
        },
        {
          label: t("vacations.detail.resolutionNote"),
          value: selected.observacion_resolucion?.trim() || "—",
        },
        {
          label: t("vacations.columns.resolvedAt"),
          value: formatIsoDateTime(selected.fecha_resolucion),
        },
        {
          label: t("vacations.columns.resolvedBy"),
          value: selected.id_resuelto_por
            ? t("vacations.detail.resolvedById", {
                id: selected.id_resuelto_por,
              })
            : "—",
        },
        {
          label: t("vacations.columns.createdAt"),
          value: formatIsoDateTime(selected.creado_en),
        },
        {
          label: t("vacations.detail.updatedAt"),
          value: formatIsoDateTime(selected.actualizado_en),
        },
      ]
    : [];

  return (
    <VacationsCard>
      {showLoading && <LoadingSpinner />}
      {isAdmin && alerts.length > 0 && (
        <AlertBar>
          <AlertButton
            type="button"
            onClick={() => setAlertsOpen(true)}
            aria-label={t("vacations.alerts.open", { count: alerts.length })}
          >
            <Bell size={18} />
            <AlertCount>{alerts.length}</AlertCount>
          </AlertButton>
        </AlertBar>
      )}
      {renderRequestFilters()}
      <DataTable<IVacationRequest>
        title={
          isAdmin
            ? t("vacations.admin.listTitle")
            : t("vacations.personal.listTitle")
        }
        columns={columns}
        data={items}
        onAdd={isAdmin ? undefined : openCreate}
        addLabel={t("vacations.actions.new")}
        onEdit={(row) => openDetail(row.id)}
        editLabel={t("vacations.actions.view")}
        layout="fill"
      />
      {items.length === 0 && <EmptyHint>{t("vacations.empty")}</EmptyHint>}
      <Pagination
        page={page}
        perPage={perPage}
        total={total}
        perPageOptions={VACATIONS_PAGE_SIZE_OPTIONS}
        disabled={loading}
        onPageChange={(nextPage) => {
          setPage(nextPage);
          loadRequests(appliedFilters, nextPage, perPage);
        }}
        onPerPageChange={(nextPerPage) => {
          setPerPage(nextPerPage);
          setPage(1);
          loadRequests(appliedFilters, 1, nextPerPage);
        }}
      />

      <Backdrop $open={alertsOpen} role="dialog" aria-modal="true">
        <Modal>
          <ModalHeader>
            <ModalTitle>
              {t("vacations.alerts.title", { count: alerts.length })}
            </ModalTitle>
          </ModalHeader>
          <ModalBody>{renderAlertList()}</ModalBody>
          <ModalFooter>
            <GhostButton type="button" onClick={() => setAlertsOpen(false)}>
              {t("vacations.actions.close")}
            </GhostButton>
          </ModalFooter>
        </Modal>
      </Backdrop>

      <Backdrop
        $open={detailOpen && !!selected}
        role="dialog"
        aria-modal="true"
      >
        <Modal>
          <ModalHeader>
            <ModalTitle>
              {t("vacations.detail.title", { id: selected?.id ?? "" })}
            </ModalTitle>
          </ModalHeader>
          <ModalBody>
            <DetailList>
              {detailRows.map((row) => (
                <DetailRow key={row.label}>
                  <DetailLabel>{row.label}</DetailLabel>
                  <DetailValue>{row.value}</DetailValue>
                </DetailRow>
              ))}
            </DetailList>
          </ModalBody>
          <ModalFooter>
            {canResolve && (
              <>
                <PrimaryButton
                  type="button"
                  onClick={() => openResolve("APROBADA")}
                  disabled={loading}
                >
                  {t("vacations.actions.approve")}
                </PrimaryButton>
                <DangerButton
                  type="button"
                  onClick={() => openResolve("RECHAZADA")}
                  disabled={loading}
                >
                  {t("vacations.actions.reject")}
                </DangerButton>
              </>
            )}
            <GhostButton
              type="button"
              onClick={() => {
                setDetailOpen(false);
                setSelected(null);
              }}
            >
              {t("vacations.actions.close")}
            </GhostButton>
          </ModalFooter>
        </Modal>
      </Backdrop>

      <ConfirmDialog
        open={createOpen}
        title={t("vacations.create.title")}
        description={
          <>
            {!hasContext && (
              <DialogHint>{t("vacations.context.missing")}</DialogHint>
            )}
            <DialogField>
              <DialogLabel htmlFor="vacation-start">
                {t("vacations.create.start")}
              </DialogLabel>
              <FilterInput
                id="vacation-start"
                type="date"
                value={createForm.fecha_inicio}
                onChange={(event) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    fecha_inicio: event.target.value,
                  }))
                }
              />
            </DialogField>
            <DialogField>
              <DialogLabel htmlFor="vacation-end">
                {t("vacations.create.end")}
              </DialogLabel>
              <FilterInput
                id="vacation-end"
                type="date"
                value={createForm.fecha_fin}
                onChange={(event) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    fecha_fin: event.target.value,
                  }))
                }
              />
            </DialogField>
            <DialogField>
              <DialogLabel htmlFor="vacation-note">
                {t("vacations.create.observation")}
              </DialogLabel>
              <DialogTextArea
                id="vacation-note"
                value={createForm.observacion}
                maxLength={MAX_VACATION_OBSERVATION_LENGTH}
                onChange={(event) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    observacion: event.target.value,
                  }))
                }
              />
            </DialogField>
            {createError && <FieldError>{createError}</FieldError>}
          </>
        }
        confirmText={t("vacations.actions.submit")}
        cancelText={t("common.cancel")}
        confirmDisabled={!hasContext}
        loading={loading}
        onConfirm={submitCreate}
        onCancel={() => setCreateOpen(false)}
      />

      <ConfirmDialog
        open={resolveKind != null}
        title={
          resolveKind === "RECHAZADA"
            ? t("vacations.resolve.rejectTitle")
            : t("vacations.resolve.approveTitle")
        }
        description={
          <>
            <DialogHint>
              {resolveKind === "RECHAZADA"
                ? t("vacations.resolve.rejectHint")
                : t("vacations.resolve.approveHint")}
            </DialogHint>
            <DialogField>
              <DialogLabel htmlFor="vacation-resolution">
                {t("vacations.resolve.note")}
              </DialogLabel>
              <DialogTextArea
                id="vacation-resolution"
                value={resolveNote}
                maxLength={MAX_VACATION_OBSERVATION_LENGTH}
                onChange={(event) => setResolveNote(event.target.value)}
              />
              {resolveTouched &&
                resolveKind === "RECHAZADA" &&
                !resolveNote.trim() && (
                  <FieldError>
                    {t("vacations.errors.rejectionRequired")}
                  </FieldError>
                )}
              {resolveNote.trim().length > MAX_VACATION_OBSERVATION_LENGTH && (
                <FieldError>
                  {t("vacations.errors.observationLength", {
                    max: MAX_VACATION_OBSERVATION_LENGTH,
                  })}
                </FieldError>
              )}
            </DialogField>
          </>
        }
        confirmText={
          resolveKind === "RECHAZADA"
            ? t("vacations.actions.reject")
            : t("vacations.actions.approve")
        }
        cancelText={t("common.cancel")}
        confirmDisabled={
          (resolveKind === "RECHAZADA" && !resolveNote.trim()) ||
          resolveNote.trim().length > MAX_VACATION_OBSERVATION_LENGTH
        }
        loading={loading}
        onConfirm={submitResolve}
        onCancel={() => setResolveKind(null)}
      />
    </VacationsCard>
  );
};

export default Vacations;

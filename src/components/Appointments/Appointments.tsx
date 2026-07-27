import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { AppState } from "../../redux/reducers/rootReducer";
import { useAppDispatchThunk } from "../../hooks/storeHooks";
import {
  fetchMunicipios,
  searchUsers,
} from "../../redux/actions/administrationActions";
import {
  cancelAppointment,
  createAppointment,
  fetchAppointments,
  rescheduleAppointment,
} from "../../redux/actions/appointmentsActions";
import {
  AppointmentCategory,
  AppointmentOrigin,
  AppointmentStatusFilter,
  IAppointment,
  IAppointmentsFilters,
  ICreateAppointmentPayload,
  IRescheduleAppointmentPayload,
} from "../../interfaces/appointments";
import { IUserListItem } from "../../interfaces/administration";
import { Column, DataTable } from "../Common/table/DataTable";
import Pagination from "../Common/pagination/Pagination";
import LoadingSpinner from "../Shared/LoadingSpinner/LoadingSpinner";
import ConfirmDialog from "../Common/confirmDialog/ConfirmDialog";
import FormAppointment from "./forms/FormAppointment";
import FormRescheduleAppointment from "./forms/FormRescheduleAppointment";
import {
  APPOINTMENT_CATEGORIES,
  APPOINTMENT_ORIGINS,
  APPOINTMENT_STATUSES,
  DEFAULT_APPOINTMENTS_PER_PAGE,
  DOCTORS_SEARCH_PER_PAGE,
} from "../../constants/appointments.constants";
import { PersonalTypesDatabase } from "../../constants/schedule.constants";
import {
  AppointmentsCard,
  DialogField,
  DialogHint,
  DialogLabel,
  DialogTextArea,
  EmptyHint,
  FilterActions,
  FilterButton,
  FilterGroup,
  FilterInput,
  FilterLabel,
  FiltersRow,
  FilterSelect,
  RequiredMark,
  SecondaryButton,
} from "./AppointmentsStyles";

type FilterForm = {
  id_municipio: number | "";
  nombre_medico: string;
  id_personal_salud: number | "";
  fecha_desde: string;
  fecha_hasta: string;
  categoria_paciente: AppointmentCategory | "";
  estado: AppointmentStatusFilter | "";
  origen: AppointmentOrigin | "";
  codigo_confirmacion: string;
};

type ViewMode = "list" | "create" | "reschedule";

const initialFilters: FilterForm = {
  id_municipio: "",
  nombre_medico: "",
  id_personal_salud: "",
  fecha_desde: "",
  fecha_hasta: "",
  categoria_paciente: "",
  estado: "",
  origen: "",
  codigo_confirmacion: "",
};

const Appointments: React.FC = () => {
  const { t } = useTranslation();
  const dispatchThunk = useAppDispatchThunk();
  const { loading } = useSelector((state: AppState) => state.helpers);
  const municipios =
    useSelector((state: AppState) => state.administration?.municipios) ?? [];

  const [filters, setFilters] = useState<FilterForm>(initialFilters);
  const [appliedFilters, setAppliedFilters] =
    useState<FilterForm>(initialFilters);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(DEFAULT_APPOINTMENTS_PER_PAGE);
  const [total, setTotal] = useState(0);
  const [items, setItems] = useState<IAppointment[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [editingAppointment, setEditingAppointment] =
    useState<IAppointment | null>(null);
  const [doctors, setDoctors] = useState<IUserListItem[]>([]);

  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<IAppointment | null>(null);
  const [cancelMotivo, setCancelMotivo] = useState("");
  const [cancelTouched, setCancelTouched] = useState(false);

  const municipioNombre = useMemo(() => {
    const id = appliedFilters.id_municipio || filters.id_municipio;
    if (!id) return "";
    return municipios.find((m) => m.id === Number(id))?.nombre ?? "";
  }, [appliedFilters.id_municipio, filters.id_municipio, municipios]);

  const loadDoctors = useCallback(
    async (idMunicipio: number) => {
      const list = await dispatchThunk(
        searchUsers({
          id_municipio: idMunicipio,
          id_tipo_personal_salud: PersonalTypesDatabase.MEDICO,
          es_personal_salud: true,
          activo: true,
          page: 1,
          per_page: DOCTORS_SEARCH_PER_PAGE,
          sort_by: "id",
          sort_dir: "asc",
        }),
      );
      setDoctors(list);
    },
    [dispatchThunk],
  );

  useEffect(() => {
    dispatchThunk(fetchMunicipios());
  }, [dispatchThunk]);

  useEffect(() => {
    if (!filters.id_municipio) {
      setDoctors([]);
      return;
    }
    loadDoctors(Number(filters.id_municipio));
  }, [filters.id_municipio, loadDoctors]);

  const buildQuery = useCallback(
    (source: FilterForm, nextPage: number, nextPerPage: number) => {
      if (!source.id_municipio) return null;
      const query: IAppointmentsFilters = {
        id_municipio: Number(source.id_municipio),
        page: nextPage,
        per_page: nextPerPage,
      };
      if (source.nombre_medico.trim()) {
        query.nombre_medico = source.nombre_medico.trim();
      }
      if (source.id_personal_salud) {
        query.id_personal_salud = Number(source.id_personal_salud);
      }
      if (source.fecha_desde) query.fecha_desde = source.fecha_desde;
      if (source.fecha_hasta) query.fecha_hasta = source.fecha_hasta;
      if (source.categoria_paciente) {
        query.categoria_paciente = source.categoria_paciente;
      }
      if (source.estado) query.estado = source.estado;
      if (source.origen) query.origen = source.origen;
      if (source.codigo_confirmacion.trim()) {
        query.codigo_confirmacion = source.codigo_confirmacion.trim();
      }
      return query;
    },
    [],
  );

  const loadAppointments = useCallback(
    async (source: FilterForm, nextPage: number, nextPerPage: number) => {
      const query = buildQuery(source, nextPage, nextPerPage);
      if (!query) return;

      const response = await dispatchThunk(fetchAppointments(query));
      if (response) {
        setItems(response.items ?? []);
        setTotal(response.total ?? 0);
        setPage(response.page ?? nextPage);
        setHasSearched(true);
      } else {
        setItems([]);
        setTotal(0);
        setHasSearched(true);
      }
    },
    [buildQuery, dispatchThunk],
  );

  const handleFilter = () => {
    if (!filters.id_municipio) return;
    setAppliedFilters(filters);
    setPage(1);
    loadAppointments(filters, 1, perPage);
  };

  const handleClear = () => {
    setFilters(initialFilters);
    setAppliedFilters(initialFilters);
    setItems([]);
    setTotal(0);
    setPage(1);
    setHasSearched(false);
    setDoctors([]);
  };

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    loadAppointments(appliedFilters, nextPage, perPage);
  };

  const handlePerPageChange = (nextPerPage: number) => {
    setPerPage(nextPerPage);
    setPage(1);
    loadAppointments(appliedFilters, 1, nextPerPage);
  };

  const refreshList = () => {
    if (appliedFilters.id_municipio) {
      loadAppointments(appliedFilters, page, perPage);
    }
  };

  const handleCreate = async (payload: ICreateAppointmentPayload) => {
    const ok = await dispatchThunk(createAppointment(payload));
    if (!ok) return;
    setViewMode("list");
    refreshList();
  };

  const handleReschedule = async (payload: IRescheduleAppointmentPayload) => {
    if (!editingAppointment) return;
    const ok = await dispatchThunk(
      rescheduleAppointment(editingAppointment.id, payload),
    );
    if (!ok) return;
    setEditingAppointment(null);
    setViewMode("list");
    refreshList();
  };

  const openCancel = (row: IAppointment) => {
    setCancelTarget(row);
    setCancelMotivo("");
    setCancelTouched(false);
    setCancelOpen(true);
  };

  const confirmCancel = async () => {
    setCancelTouched(true);
    if (!cancelTarget || !cancelMotivo.trim()) return;

    const ok = await dispatchThunk(
      cancelAppointment(cancelTarget.id, {
        motivo: cancelMotivo.trim(),
        actor_tipo: "WEB",
      }),
    );
    if (!ok) return;
    setCancelOpen(false);
    setCancelTarget(null);
    setCancelMotivo("");
    refreshList();
  };

  const openCreate = async () => {
    const idMunicipio = Number(appliedFilters.id_municipio);
    if (!idMunicipio) return;
    await loadDoctors(idMunicipio);
    setViewMode("create");
  };

  const openReschedule = async (row: IAppointment) => {
    setEditingAppointment(row);
    await loadDoctors(Number(row.id_municipio));
    setViewMode("reschedule");
  };

  const columns: Column<IAppointment>[] = useMemo(
    () => [
      {
        key: "codigo_confirmacion",
        header: t("appointments.columns.code"),
        width: "130px",
      },
      {
        key: "paciente",
        header: t("appointments.columns.patient"),
      },
      {
        key: "categoria_paciente",
        header: t("appointments.columns.category"),
        width: "100px",
      },
      {
        key: "nombre_medico",
        header: t("appointments.columns.doctor"),
      },
      {
        key: "tipo_atencion",
        header: t("appointments.columns.attentionType"),
      },
      {
        key: "fecha",
        header: t("appointments.columns.date"),
        width: "105px",
      },
      {
        key: "hora_inicio",
        header: t("appointments.columns.start"),
        width: "70px",
        render: (row) => String(row.hora_inicio ?? "").slice(0, 5),
      },
      {
        key: "hora_fin",
        header: t("appointments.columns.end"),
        width: "70px",
        render: (row) => String(row.hora_fin ?? "").slice(0, 5),
      },
      {
        key: "estado",
        header: t("appointments.columns.status"),
        width: "100px",
      },
      {
        key: "origen",
        header: t("appointments.columns.origin"),
        width: "90px",
      },
    ],
    [t],
  );

  if (viewMode === "create" && appliedFilters.id_municipio) {
    return (
      <AppointmentsCard>
        {loading && <LoadingSpinner />}
        <FormAppointment
          idMunicipio={Number(appliedFilters.id_municipio)}
          municipioNombre={municipioNombre}
          doctors={doctors}
          loading={loading}
          onSubmit={handleCreate}
          onCancel={() => setViewMode("list")}
        />
      </AppointmentsCard>
    );
  }

  if (viewMode === "reschedule" && editingAppointment) {
    return (
      <AppointmentsCard>
        {loading && <LoadingSpinner />}
        <FormRescheduleAppointment
          appointment={editingAppointment}
          doctors={doctors}
          loading={loading}
          onSubmit={handleReschedule}
          onCancel={() => {
            setEditingAppointment(null);
            setViewMode("list");
          }}
        />
      </AppointmentsCard>
    );
  }

  return (
    <AppointmentsCard>
      {loading && <LoadingSpinner />}

      <FiltersRow>
        <FilterGroup>
          <FilterLabel>
            {t("appointments.filters.municipality")}
            <RequiredMark>*</RequiredMark>
          </FilterLabel>
          <FilterSelect
            value={filters.id_municipio}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                id_municipio: e.target.value ? Number(e.target.value) : "",
                id_personal_salud: "",
              }))
            }
            disabled={loading}
          >
            <option value="">{t("common.selectPlaceholder")}</option>
            {municipios.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre}
              </option>
            ))}
          </FilterSelect>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>{t("appointments.filters.doctorName")}</FilterLabel>
          <FilterInput
            value={filters.nombre_medico}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                nombre_medico: e.target.value,
              }))
            }
            disabled={loading}
            placeholder={t("appointments.filters.doctorNamePlaceholder")}
          />
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>{t("appointments.filters.healthStaff")}</FilterLabel>
          <FilterSelect
            value={filters.id_personal_salud}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                id_personal_salud: e.target.value ? Number(e.target.value) : "",
              }))
            }
            disabled={loading || !filters.id_municipio}
          >
            <option value="">{t("common.all")}</option>
            {doctors.map((u) => (
              <option key={u.id} value={u.id}>
                {`${u.nombre} ${u.apellidos}`.trim()}
              </option>
            ))}
          </FilterSelect>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>{t("appointments.filters.dateFrom")}</FilterLabel>
          <FilterInput
            type="date"
            value={filters.fecha_desde}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                fecha_desde: e.target.value,
              }))
            }
            disabled={loading}
          />
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>{t("appointments.filters.dateTo")}</FilterLabel>
          <FilterInput
            type="date"
            value={filters.fecha_hasta}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                fecha_hasta: e.target.value,
              }))
            }
            disabled={loading}
          />
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>{t("appointments.filters.category")}</FilterLabel>
          <FilterSelect
            value={filters.categoria_paciente}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                categoria_paciente: e.target.value as AppointmentCategory | "",
              }))
            }
            disabled={loading}
          >
            <option value="">{t("common.all")}</option>
            {APPOINTMENT_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {t(`appointments.categories.${category}`)}
              </option>
            ))}
          </FilterSelect>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>{t("appointments.filters.status")}</FilterLabel>
          <FilterSelect
            value={filters.estado}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                estado: e.target.value as AppointmentStatusFilter | "",
              }))
            }
            disabled={loading}
          >
            <option value="">{t("common.all")}</option>
            {APPOINTMENT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {t(`appointments.statuses.${status}`)}
              </option>
            ))}
          </FilterSelect>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>{t("appointments.filters.origin")}</FilterLabel>
          <FilterSelect
            value={filters.origen}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                origen: e.target.value as AppointmentOrigin | "",
              }))
            }
            disabled={loading}
          >
            <option value="">{t("common.all")}</option>
            {APPOINTMENT_ORIGINS.map((origin) => (
              <option key={origin} value={origin}>
                {t(`appointments.origins.${origin}`)}
              </option>
            ))}
          </FilterSelect>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>{t("appointments.filters.code")}</FilterLabel>
          <FilterInput
            value={filters.codigo_confirmacion}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                codigo_confirmacion: e.target.value,
              }))
            }
            disabled={loading}
            placeholder={t("appointments.filters.codePlaceholder")}
          />
        </FilterGroup>

        <FilterActions>
          <FilterButton
            type="button"
            onClick={handleFilter}
            disabled={loading || !filters.id_municipio}
          >
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

      {!hasSearched ? (
        <EmptyHint>{t("appointments.selectMunicipalityHint")}</EmptyHint>
      ) : (
        <>
          <DataTable<IAppointment>
            title={t("appointments.title")}
            columns={columns}
            data={items}
            addLabel={t("appointments.form.newTitle")}
            onAdd={openCreate}
            onEdit={openReschedule}
            editLabel={t("appointments.actions.reschedule")}
            canEdit={(row) => row.estado === "PENDIENTE"}
            onDelete={openCancel}
            deleteLabel={t("common.cancel")}
            canDelete={(row) => row.estado === "PENDIENTE"}
            layout="fill"
          />

          <Pagination
            page={page}
            perPage={perPage}
            total={total}
            disabled={loading}
            onPageChange={handlePageChange}
            onPerPageChange={handlePerPageChange}
          />
        </>
      )}

      <ConfirmDialog
        open={cancelOpen}
        title={t("appointments.cancel.title")}
        description={
          <>
            <DialogHint>
              {t("appointments.cancel.question", {
                code: cancelTarget?.codigo_confirmacion ?? "",
                patient: cancelTarget?.paciente ?? "",
              })}
            </DialogHint>
            <DialogField>
              <DialogLabel htmlFor="cancel-motivo">
                {t("appointments.cancel.reason")}
              </DialogLabel>
              <DialogTextArea
                id="cancel-motivo"
                value={cancelMotivo}
                onChange={(e) => setCancelMotivo(e.target.value)}
                placeholder={t("appointments.cancel.reasonPlaceholder")}
              />
              {cancelTouched && !cancelMotivo.trim() && (
                <span style={{ color: "#dc2626", fontSize: "0.75rem" }}>
                  {t("appointments.form.errors.required")}
                </span>
              )}
            </DialogField>
          </>
        }
        confirmText={t("appointments.cancel.confirm")}
        cancelText={t("common.cancel")}
        loading={loading}
        onConfirm={confirmCancel}
        onCancel={() => {
          setCancelOpen(false);
          setCancelTarget(null);
          setCancelMotivo("");
        }}
      />
    </AppointmentsCard>
  );
};

export default Appointments;

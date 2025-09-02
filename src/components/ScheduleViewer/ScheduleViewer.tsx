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
} from "../../interfaces/schedule";

import {
  Wrapper,
  Card,
  Title,
  Subtitle,
  ControlsRow,
  Select,
  Button,
  TableWrapper,
  TableTitle,
  TopActions,
  DownloadButton,
  BackButton,
  CheckboxRow,
  TableContainer,
  Table,
  Th,
  Td,
  StaffCell,
  HoursRow,
  TotalRow,
  TableLoadingOverlay,
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
import { RoleId, Roles } from "../../constants/schedule.constants";

interface ScheduleViewerProps {
  editable?: boolean;
}

const ScheduleViewer: React.FC<ScheduleViewerProps> = ({
  editable = false,
}) => {
  const { t } = useTranslation();
  const dispatchThunk = useAppDispatchThunk();

  const { loading } = useSelector((state: AppState) => state.helpers);
  const { userData } = useSelector((state: AppState) => state.user);
  const { options, monthData, attentionTypes } = useSelector(
    (state: AppState) => state.schedule,
  );

  const editableParams: IParamsGenericQuery = {
    id_user: userData.user.id,
  };

  const rolesQueForzanMunicipio = [Roles.COORDINADOR, Roles.PERSONAL_SALUD];

  // Si el rol es COORDINADOR O PERSONAL SALUD, forzamos el municipio con userData.user.id_municipio
  const forceMunicipio = useMemo(() => {
    const roleId = userData?.roles?.id as RoleId | undefined;

    return roleId && rolesQueForzanMunicipio.includes(roleId)
      ? (userData?.user?.id_municipio ?? null)
      : null;
  }, [userData]);

  // Form state
  const [formState, setFormState] = useState<FormState>({
    selectedPeriodo: null,
    selectedTipo: null,
    selectedMunicipio: null,
  });

  // UI state
  const [showTable, setShowTable] = useState<boolean>(false);
  const [showNovedades, setShowNovedades] = useState<boolean>(false);

  // Estado local por celda: `${id_usuario}-${day}` -> sigla seleccionada
  const [attentionByCell, setAttentionByCell] = useState<
    Record<string, string>
  >({});

  // Mapa sigla -> tipo completo (para obtener horas)
  const attentionMapBySigla = useMemo(() => {
    const map = new Map<string, IAttentionTypesResponse>();
    (attentionTypes || []).forEach((a) => map.set(a.sigla, a));
    return map;
  }, [attentionTypes]);

  // Memoized values
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
        // aunque no haya select visible, validamos con el municipio efectivo
        forceMunicipio ?? formState.selectedMunicipio,
      ),
    [formState, forceMunicipio],
  );

  // Cargar opciones y tipos de atención (si editable)
  useEffect(() => {
    if (editable) {
      dispatchThunk(fetchEditableOptions(editableParams ?? {}));
      dispatchThunk(fetchAttentionTypes(editableParams ?? {}));
    } else {
      dispatchThunk(fetchScheduleOptions());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatchThunk, editable, JSON.stringify(editableParams)]);

  // Set defaults cuando options cambian (respetando municipio forzado)
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

  // Inicializa selección local por celda con valores del backend
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

  // Handlers
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
    // Limpiar Redux
    dispatchThunk(clearScheduleMonth());
    dispatchThunk(clearScheduleOptions());

    // Reset local
    setFormState({
      selectedPeriodo: null,
      selectedTipo: null,
      selectedMunicipio: null,
    });
    setShowNovedades(false);
    setShowTable(false);
    setAttentionByCell({});

    // Recargar según modo
    if (editable) {
      dispatchThunk(fetchEditableOptions(editableParams ?? {}));
      dispatchThunk(fetchAttentionTypes(editableParams ?? {}));
    } else {
      dispatchThunk(fetchScheduleOptions());
    }
  }, [dispatchThunk, editable, editableParams]);

  const handleAttentionChange = useCallback(
    (idUsuario: number, day: number, newSigla: string) => {
      const key = `${idUsuario}-${day}`;
      setAttentionByCell((prev) => ({ ...prev, [key]: newSigla }));

      // Tipo seleccionado por sigla (para obtener id y horas)
      const selectedType = attentionMapBySigla.get(newSigla) || null;

      // Buscar id_cuadro_personal del profesional
      const person = monthData?.personal_de_salud.find(
        (p) => p.id_usuario === idUsuario,
      );
      const id_cuadro_personal = person?.id_cuadro_personal;

      // Si limpian la selección, o falta info necesaria, no disparamos al backend
      if (!selectedType || !id_cuadro_personal) {
        return;
      }

      const payload: IDataEditScheduleData = {
        id_cuadro_personal,
        dia: day,
        id_tipo_atencion: selectedType.id,
        horas: selectedType.horas,
        es_novedad: false,
        editor_user_id: userData.user.id,
      };

      // Llamada al backend
      dispatchThunk(editScheduleDay(payload));
    },
    [
      attentionMapBySigla,
      monthData?.personal_de_salud,
      userData.user.id,
      dispatchThunk,
    ],
  );

  const handleDownload = useCallback(() => {
    if (!isFormValid) return;

    const municipioId = forceMunicipio ?? formState.selectedMunicipio!;

    const params: IDownloadSchedule = {
      anio: formState.selectedPeriodo!.anio,
      mes: formState.selectedPeriodo!.mes,
      id_tipo_personal_salud: formState.selectedTipo!,
      id_municipio: municipioId,
      // formato: no enviar (el backend usa pdf por defecto)
    };

    dispatchThunk(fetchDownloadSchedule(params));
  }, [dispatchThunk, formState, isFormValid, forceMunicipio]);

  const renderPersonRows = useCallback(
    (person: PersonalDeSalud) => {
      const dayBuckets = createDayBuckets(person.dias);

      return (
        <React.Fragment key={person.id_usuario}>
          {/* Fila principal */}
          <tr>
            <StaffCell>
              {formatPersonName(person.nombre, person.apellidos)}
            </StaffCell>
            {days.map((day) => {
              const cellKey = `${person.id_usuario}-${day}`;
              const currentBackendSigla =
                dayBuckets[day]?.normal?.tipo_atencion || "";
              const currentSigla =
                attentionByCell[cellKey] ?? currentBackendSigla;

              return (
                <Td key={`${person.id_usuario}-${day}`} $center>
                  {editable ? (
                    attentionTypes && attentionTypes.length > 0 ? (
                      <select
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
                      </select>
                    ) : (
                      <small style={{ color: "#6b7280" }}>
                        {t("common.loading") || "Cargando…"}
                      </small>
                    )
                  ) : (
                    currentBackendSigla
                  )}
                </Td>
              );
            })}
          </tr>

          {/* Fila de horas */}
          <HoursRow>
            <StaffCell>{t("scheduleViewer.rowHours").toUpperCase()}</StaffCell>
            {days.map((day) => {
              const key = `${person.id_usuario}-${day}`;
              const selectedSigla = attentionByCell[key] || "";
              const horasFromType =
                attentionMapBySigla.get(selectedSigla)?.horas ?? 0;

              const backendHoras = dayBuckets[day]?.normal?.horas || 0;
              const value = editable ? horasFromType : backendHoras;

              return (
                <Td key={`hn-${person.id_usuario}-${day}`} $center>
                  {value}
                </Td>
              );
            })}
          </HoursRow>

          {/* Novedades */}
          {showNovedades && (
            <>
              <tr style={{ background: "#fff5f5" }}>
                <StaffCell>
                  {t("scheduleViewer.justificationsUpdates").toUpperCase()}
                </StaffCell>
                {days.map((day) => {
                  const justifications = getNoveltyJustifications(
                    dayBuckets[day]?.novedades || [],
                  );
                  return (
                    <Td key={`jn-${person.id_usuario}-${day}`} $center>
                      {justifications}
                    </Td>
                  );
                })}
              </tr>

              <HoursRow style={{ background: "#fff1f2" }}>
                <StaffCell>
                  {t("scheduleViewer.hoursUpdates").toUpperCase()}
                </StaffCell>
                {days.map((day) => {
                  const noveltyHours = sumNoveltyHours(
                    dayBuckets[day]?.novedades || [],
                  );
                  return (
                    <Td key={`hnv-${person.id_usuario}-${day}`} $center>
                      {noveltyHours}
                    </Td>
                  );
                })}
              </HoursRow>
            </>
          )}
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
    ],
  );

  // Fila Total
  const renderTotalRow = useCallback(
    () => (
      <TotalRow>
        <StaffCell>{t("scheduleViewer.rowTotalHours").toUpperCase()}</StaffCell>
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
            <Td key={`total-${day}`} $center>
              {totalHours}
            </Td>
          );
        })}
      </TotalRow>
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

  // Pantalla de selección
  if (!showTable) {
    return (
      <Wrapper>
        <Card>
          <Title>
            {editable
              ? t("scheduleViewer.titleEditable").toUpperCase()
              : t("scheduleViewer.title").toUpperCase()}
          </Title>
          <Subtitle>
            {editable
              ? t("scheduleViewer.subtitleEditable")
              : t("scheduleViewer.subtitle")}
          </Subtitle>

          <ControlsRow>
            <Select
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
            </Select>

            <Select
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
            </Select>

            <Select
              aria-label="Tipo de personal de salud"
              value={formState.selectedTipo ?? ""}
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  selectedTipo: parseInt(e.target.value, 10),
                }))
              }
            >
              {(options?.tipos_personal_salud || []).map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nombre}
                </option>
              ))}
            </Select>

            {/* Municipio: ocultar el select si el rol fuerza el municipio */}
            {!forceMunicipio ? (
              <Select
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
              </Select>
            ) : null}

            <Button
              onClick={handleConsultar}
              disabled={loading || !isFormValid}
              aria-busy={loading}
            >
              {loading ? (
                <LoadingSpinner />
              ) : (
                (t("scheduleViewer.select")?.toUpperCase() ?? "CONSULTAR")
              )}
            </Button>
          </ControlsRow>
        </Card>
      </Wrapper>
    );
  }

  // Tabla
  const siteHeader = monthData
    ? t("scheduleViewer.tableHeader", {
        site: monthData.municipio,
      }).toUpperCase()
    : "";

  return (
    <Wrapper>
      <TableWrapper>
        <TopActions>
          <BackButton onClick={handleBack}>
            <ArrowLeft size={18} />
          </BackButton>

          <TableTitle style={{ textAlign: "center", width: "100%" }}>
            {siteHeader}
            <span>{MONTHS[monthIndex0]}</span>
          </TableTitle>
          {!editable && (
            <DownloadButton
              onClick={handleDownload}
              disabled={!isFormValid || loading}
            >
              <Download size={18} />
              {t("scheduleViewer.download").toUpperCase()}
            </DownloadButton>
          )}
        </TopActions>

        <CheckboxRow>
          <label>
            <input
              type="checkbox"
              checked={showNovedades}
              onChange={(e) => setShowNovedades(e.target.checked)}
            />
            <span>{t("scheduleViewer.news")}</span>
          </label>
        </CheckboxRow>

        <TableContainer>
          {loading && (
            <TableLoadingOverlay>
              <LoadingSpinner />
            </TableLoadingOverlay>
          )}

          <Table aria-busy={loading}>
            <thead>
              <tr>
                <Th style={{ minWidth: 220 }}>{year}</Th>
                {days.map((day) => (
                  <Th key={`h-${day}`}>
                    <div>{day}</div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: "normal",
                        color: "#6b7280",
                      }}
                    >
                      {getDayAbbreviation(day, monthIndex0, year)}
                    </div>
                  </Th>
                ))}
              </tr>
            </thead>

            <tbody>
              {/* Separador de mes */}
              <tr>
                <StaffCell>{MONTHS[monthIndex0]}</StaffCell>
                {days.map((day) => (
                  <Td key={`m-${day}`} />
                ))}
              </tr>

              {/* Filas por persona */}
              {(monthData?.personal_de_salud || []).map(renderPersonRows)}

              {/* Total */}
              {renderTotalRow()}
            </tbody>
          </Table>
        </TableContainer>
      </TableWrapper>
    </Wrapper>
  );
};

export default ScheduleViewer;

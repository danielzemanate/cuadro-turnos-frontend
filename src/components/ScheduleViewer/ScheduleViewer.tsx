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
} from "../../redux/actions/scheduleActions";
import { useAppDispatchThunk } from "../../hooks/storeHooks";
import {
  getDayAbbreviation,
  daysInMonth,
  generateDaysArray,
  sumUserDay,
  createDayBuckets,
  generateCSVContent,
  downloadCSV,
  isValidFormState,
  formatPersonName,
  getNoveltyJustifications,
  sumNoveltyHours,
  sortPeriodos,
  findPeriodo,
} from "../../helpers/ScheduleHelper";

const ScheduleViewer: React.FC = () => {
  const { t } = useTranslation();
  const dispatchThunk = useAppDispatchThunk();

  const { loading } = useSelector((state: AppState) => state.helpers);
  const { options, monthData } = useSelector(
    (state: AppState) => state.schedule,
  );

  // Form state
  const [formState, setFormState] = useState<FormState>({
    selectedPeriodo: null,
    selectedTipo: null,
    selectedMunicipio: null,
  });

  // UI state
  const [showTable, setShowTable] = useState<boolean>(false);
  const [showNovedades, setShowNovedades] = useState<boolean>(false);

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
        formState.selectedMunicipio,
      ),
    [formState],
  );

  // Load options on mount
  useEffect(() => {
    dispatchThunk(fetchScheduleOptions());
  }, [dispatchThunk]);

  // Set default values when options are loaded
  useEffect(() => {
    if (!options) return;

    setFormState((prev) => ({
      ...prev,
      selectedPeriodo: prev.selectedPeriodo || sortedPeriodos[0] || null,
      selectedTipo:
        prev.selectedTipo || options.tipos_personal_salud?.[0]?.id || null,
      selectedMunicipio:
        prev.selectedMunicipio || options.municipios?.[0]?.id || null,
    }));
  }, [options, sortedPeriodos]);

  // Event handlers
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

    const params: IScheduleMonthParams = {
      anio: formState.selectedPeriodo!.anio,
      mes: formState.selectedPeriodo!.mes,
      id_tipo_personal_salud: formState.selectedTipo!,
      id_municipio: formState.selectedMunicipio!,
    };

    dispatchThunk(fetchScheduleByMonth(params));
    setShowTable(true);
  }, [dispatchThunk, formState, isFormValid]);

  const handleBack = useCallback(() => {
    // Clear Redux state
    dispatchThunk(clearScheduleMonth());
    dispatchThunk(clearScheduleOptions());

    // Reset local state
    setFormState({
      selectedPeriodo: null,
      selectedTipo: null,
      selectedMunicipio: null,
    });
    setShowNovedades(false);
    setShowTable(false);

    // Reload options
    dispatchThunk(fetchScheduleOptions());
  }, [dispatchThunk]);

  const generateCSVData = useCallback(
    (personal: PersonalDeSalud[]) => {
      const headers = ["Profesional", ...days.map(String), "Total Horas"];
      const rows: (string | number)[][] = [];

      personal.forEach((person) => {
        const dayBuckets = createDayBuckets(person.dias);

        // Main row with attention types
        const attentionValues = days.map(
          (day) => dayBuckets[day]?.normal?.tipo_atencion || "",
        );

        const totalHours = days.reduce((total, day) => {
          const normal = dayBuckets[day]?.normal?.horas || 0;
          const novelties = sumNoveltyHours(dayBuckets[day]?.novedades || []);
          return total + (showNovedades ? normal + novelties : normal);
        }, 0);

        rows.push([
          formatPersonName(person.nombre, person.apellidos),
          ...attentionValues,
          totalHours,
        ]);

        // Hours row
        const hoursValues = days.map(
          (day) => dayBuckets[day]?.normal?.horas || 0,
        );
        rows.push(["Nº DE HORAS", ...hoursValues, totalHours]);

        // Novelty rows if enabled
        if (showNovedades) {
          const noveltyJustifications = days.map((day) =>
            getNoveltyJustifications(dayBuckets[day]?.novedades || []),
          );
          rows.push([
            "JUSTIFICACIONES NOVEDADES",
            ...noveltyJustifications,
            "",
          ]);

          const noveltyHours = days.map((day) =>
            sumNoveltyHours(dayBuckets[day]?.novedades || []),
          );
          const noveltyTotal = noveltyHours.reduce((a, b) => a + b, 0);
          rows.push(["HORAS NOVEDADES", ...noveltyHours, noveltyTotal]);
        }
      });

      return [headers, ...rows];
    },
    [days, showNovedades],
  );

  const handleDownload = useCallback(() => {
    if (!monthData) return;

    const csvData = generateCSVData(monthData.personal_de_salud);
    const csvContent = generateCSVContent(csvData);

    const monthName =
      MONTHS[monthIndex0]?.toLowerCase() ?? String(monthIndex0 + 1);
    const filename = (t("scheduleViewer.csvFilename") as string)
      .replace("{{month}}", monthName)
      .replace("{{year}}", String(year));

    downloadCSV(csvContent, filename);
  }, [monthData, generateCSVData, MONTHS, monthIndex0, year, t]);

  const renderPersonRows = useCallback(
    (person: PersonalDeSalud) => {
      const dayBuckets = createDayBuckets(person.dias);

      return (
        <React.Fragment key={person.id_usuario}>
          {/* Main attention row */}
          <tr>
            <StaffCell>
              {formatPersonName(person.nombre, person.apellidos)}
            </StaffCell>
            {days.map((day) => (
              <Td key={`${person.id_usuario}-${day}`} $center>
                {dayBuckets[day]?.normal?.tipo_atencion || ""}
              </Td>
            ))}
          </tr>

          {/* Hours row */}
          <HoursRow>
            <StaffCell>{t("scheduleViewer.rowHours").toUpperCase()}</StaffCell>
            {days.map((day) => (
              <Td key={`hn-${person.id_usuario}-${day}`} $center>
                {dayBuckets[day]?.normal?.horas || 0}
              </Td>
            ))}
          </HoursRow>

          {/* Novelty rows */}
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
    [days, showNovedades, t],
  );

  const renderTotalRow = useCallback(
    () => (
      <TotalRow>
        <StaffCell>{t("scheduleViewer.rowTotalHours").toUpperCase()}</StaffCell>
        {days.map((day) => {
          const totalHours = (monthData?.personal_de_salud || []).reduce(
            (total, person) =>
              total + sumUserDay(person.dias, day, showNovedades),
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
    [days, monthData?.personal_de_salud, showNovedades, t],
  );

  // Render selection screen
  if (!showTable) {
    return (
      <Wrapper>
        <Card>
          <Title>{t("scheduleViewer.title").toUpperCase()}</Title>
          <Subtitle>{t("scheduleViewer.subtitle")}</Subtitle>

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

  // Render table screen
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

          <DownloadButton onClick={handleDownload} disabled={!monthData}>
            <Download size={18} />
            {t("scheduleViewer.download").toUpperCase()}
          </DownloadButton>
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

        <div style={{ position: "relative" }}>
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
              {/* Month separator */}
              <tr>
                <StaffCell>{MONTHS[monthIndex0]}</StaffCell>
                {days.map((day) => (
                  <Td key={`m-${day}`} />
                ))}
              </tr>

              {/* Person rows */}
              {(monthData?.personal_de_salud || []).map(renderPersonRows)}

              {/* Total row */}
              {renderTotalRow()}
            </tbody>
          </Table>
        </div>
      </TableWrapper>
    </Wrapper>
  );
};

export default ScheduleViewer;

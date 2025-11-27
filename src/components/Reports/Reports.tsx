import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { AppState } from "../../redux/reducers/rootReducer";
import { useAppDispatchThunk } from "../../hooks/storeHooks";

// Actions
import {
  fetchReportTypes,
  fetchReportSubTypes,
  fetchDownloadReportPatientsRegister,
  fetchDownloadReportAnualComparative,
  fetchDownloadReportCostDetail,
  fetchDownloadReportCostMonth,
  fetchDownloadReportCostYear,
  fetchDownloadReportMonthDetails,
} from "../../redux/actions/reportsActions";
import { fetchScheduleOptions } from "../../redux/actions/scheduleActions";

// Helpers
import { sortPeriodos, findPeriodo } from "../../helpers/ScheduleHelper";

// Interfaces
import {
  IReportFiltersData,
  IReportTypes,
  ISubReportTypes,
} from "../../interfaces/reports";
import { Periodo } from "../../interfaces/schedule";

// Estilos
import {
  Page,
  Wrap,
  Card,
  Title,
  Subtitle,
  Grid,
  FormGroup,
  Label,
  Select,
  Button,
  Actions,
  Section,
  SectionTitle,
  Spacer,
} from "./ReportsStyles";

// Toasts
import {
  setOpenToast,
  setVariantToast,
  setMessageToast,
} from "../../redux/actions/helpersActions";

const Reports: React.FC = () => {
  const { t } = useTranslation();
  const dispatchThunk = useAppDispatchThunk();

  // Store
  const { loading } = useSelector((s: AppState) => s.helpers);
  const { reportTypes, subReportTypes } = useSelector(
    (s: AppState) => s.reports,
  );
  const { options } = useSelector((s: AppState) => s.schedule);

  // Local state
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [selectedSubType, setSelectedSubType] = useState<number | null>(null);
  const [selectedPeriodo, setSelectedPeriodo] = useState<Periodo | null>(null);
  const [selectedMunicipio, setSelectedMunicipio] = useState<number | null>(
    null,
  );
  const [selectedTipoPersonal, setSelectedTipoPersonal] = useState<
    number | null
  >(null);

  // Months del i18n
  const MONTHS = useMemo(
    () => t("scheduleViewer.months", { returnObjects: true }) as string[],
    [t],
  );

  // Periodos ordenados
  const sortedPeriodos = useMemo(() => {
    if (!options?.periodos) return [];
    return sortPeriodos(options.periodos);
  }, [options?.periodos]);

  // Cargar opciones base y tipos de reporte
  useEffect(() => {
    if (!options) dispatchThunk(fetchScheduleOptions());
    dispatchThunk(fetchReportTypes());
  }, [dispatchThunk]);

  // Cargar subtipos cuando cambia el tipo
  useEffect(() => {
    if (selectedType != null) {
      dispatchThunk(fetchReportSubTypes(String(selectedType)));
      setSelectedSubType(null);
    }
  }, [dispatchThunk, selectedType]);

  // Inicializar selects por defecto
  useEffect(() => {
    if (!options) return;

    setSelectedPeriodo((prev) => prev || sortedPeriodos[0] || null);
    setSelectedMunicipio((prev) => prev ?? options.municipios?.[0]?.id ?? null);
    setSelectedTipoPersonal(
      (prev) => prev ?? options.tipos_personal_salud?.[0]?.id ?? null,
    );
  }, [options, sortedPeriodos]);

  // Handlers
  const handlePeriodoChange = useCallback(
    (field: "mes" | "anio", value: number) => {
      if (!sortedPeriodos.length) return;
      const current = selectedPeriodo;
      let found: Periodo | null = null;

      if (field === "mes") {
        found = findPeriodo(
          sortedPeriodos,
          current?.anio ?? sortedPeriodos[0].anio,
          value,
          undefined,
          value,
        );
      } else {
        found = findPeriodo(
          sortedPeriodos,
          value,
          current?.mes ?? sortedPeriodos[0].mes,
          value,
          undefined,
        );
      }
      setSelectedPeriodo(found);
    },
    [sortedPeriodos, selectedPeriodo],
  );

  const canShowFilters = selectedType != null && selectedSubType != null;

  const handleDownload = () => {
    if (
      !selectedPeriodo ||
      selectedMunicipio == null ||
      selectedTipoPersonal == null ||
      selectedType == null ||
      selectedSubType == null
    ) {
      dispatchThunk((dispatch) => {
        dispatch(setOpenToast(true));
        dispatch(setVariantToast("error"));
        dispatch(
          setMessageToast(
            t("alerts.missingFilters", {
              defaultValue: "Por favor completa todos los filtros.",
            }) as string,
          ),
        );
      });
      return;
    }

    const payload: IReportFiltersData = {
      anio: selectedPeriodo.anio,
      mes: selectedPeriodo.mes,
      id_municipio: selectedMunicipio,
      id_tipo_personal_salud: selectedTipoPersonal,
    };

    const selectedTypeObj = (reportTypes ?? []).find(
      (rt: IReportTypes) => rt.id === selectedType,
    );
    const selectedSubTypeObj = (subReportTypes ?? []).find(
      (st: ISubReportTypes) => st.id === selectedSubType,
    );

    const typeName = selectedTypeObj?.nombre?.toLowerCase() || "";
    const subTypeName = selectedSubTypeObj?.nombre?.toLowerCase() || "";

    const noReportMessage = t("reports.noReportAvailable");

    const showNoReportToast = () => {
      dispatchThunk((dispatch) => {
        dispatch(setOpenToast(true));
        dispatch(setVariantToast("error"));
        dispatch(setMessageToast(noReportMessage));
      });
    };

    // ===== RUTEO SEGÚN TIPO / SUBTIPO =====

    // 1) COSTOS
    if (subTypeName === "costos") {
      if (typeName === "mensual detallado") {
        dispatchThunk(fetchDownloadReportCostDetail(payload));
        return;
      }
      if (typeName === "mensual comparativo") {
        dispatchThunk(fetchDownloadReportCostMonth(payload));
        return;
      }
      if (typeName === "anual") {
        dispatchThunk(fetchDownloadReportCostYear(payload));
        return;
      }

      showNoReportToast();
      return;
    }

    // 2) PACIENTES ATENDIDOS / SIAU
    const isPacientesAtendidos = subTypeName === "pacientes atendidos";
    const isSiau =
      subTypeName.startsWith("siau") || subTypeName.includes("siau");

    if (isPacientesAtendidos || isSiau) {
      if (typeName === "mensual detallado") {
        // Mensual detallado → fetchDownloadReportMonthDetails
        dispatchThunk(fetchDownloadReportMonthDetails(payload));
        return;
      }
      if (typeName === "mensual comparativo") {
        // Mensual comparativo → fetchDownloadReportPatientsRegister
        dispatchThunk(fetchDownloadReportPatientsRegister(payload));
        return;
      }
      if (typeName === "anual") {
        // Anual → fetchDownloadReportAnualComparative
        dispatchThunk(fetchDownloadReportAnualComparative(payload));
        return;
      }

      showNoReportToast();
      return;
    }

    // 3) Cualquier otro subtipo (Oportunidad, Productividad, etc.)
    showNoReportToast();
  };

  return (
    <Page>
      <Wrap>
        <Card>
          <Title>{t("reports.title")}</Title>
          <Subtitle>{t("reports.subtitle")}</Subtitle>

          {/* Tipo y Subtipo */}
          <Grid $cols={2}>
            <FormGroup>
              <Label>{t("reports.type")}</Label>
              <Select
                value={selectedType ?? ""}
                onChange={(e) =>
                  setSelectedType(Number(e.target.value) || null)
                }
              >
                <option value="">{t("common.select")}</option>
                {(reportTypes ?? []).map((rt: IReportTypes) => (
                  <option key={rt.id} value={rt.id}>
                    {rt.nombre}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>{t("reports.subtype")}</Label>
              <Select
                disabled={selectedType == null}
                value={selectedSubType ?? ""}
                onChange={(e) =>
                  setSelectedSubType(Number(e.target.value) || null)
                }
              >
                <option value="">{t("common.select")}</option>
                {(subReportTypes ?? []).map((st: ISubReportTypes) => (
                  <option key={st.id} value={st.id}>
                    {st.nombre}
                  </option>
                ))}
              </Select>
            </FormGroup>
          </Grid>

          {/* Filtros */}
          {canShowFilters && (
            <>
              <Spacer $size="lg" />

              {/* Periodo */}
              <Section>
                <SectionTitle>{t("common.period")}</SectionTitle>
                <Grid $cols={2}>
                  <FormGroup>
                    <Label>{t("common.year")}</Label>
                    <Select
                      value={selectedPeriodo?.anio ?? ""}
                      onChange={(e) =>
                        handlePeriodoChange(
                          "anio",
                          parseInt(e.target.value, 10),
                        )
                      }
                    >
                      {Array.from(
                        new Set(sortedPeriodos.map((p) => p.anio)),
                      ).map((anio) => (
                        <option key={anio} value={anio}>
                          {anio}
                        </option>
                      ))}
                    </Select>
                  </FormGroup>

                  <FormGroup>
                    <Label>{t("common.month")}</Label>
                    <Select
                      value={selectedPeriodo?.mes ?? ""}
                      onChange={(e) =>
                        handlePeriodoChange("mes", parseInt(e.target.value, 10))
                      }
                    >
                      {sortedPeriodos.map((p) => (
                        <option key={`${p.anio}-${p.mes}`} value={p.mes}>
                          {MONTHS[(p.mes - 1 + 12) % 12]}
                        </option>
                      ))}
                    </Select>
                  </FormGroup>
                </Grid>
              </Section>

              <Spacer $size="md" />

              {/* Ubicación y Personal */}
              <Grid $cols={2}>
                <FormGroup>
                  <Label>{t("common.municipality")}</Label>
                  <Select
                    value={selectedMunicipio ?? ""}
                    onChange={(e) =>
                      setSelectedMunicipio(parseInt(e.target.value, 10))
                    }
                  >
                    {(options?.municipios || []).map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nombre}
                      </option>
                    ))}
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>{t("scheduleViewer.healthPersonnelType")}</Label>
                  <Select
                    value={selectedTipoPersonal ?? ""}
                    onChange={(e) =>
                      setSelectedTipoPersonal(parseInt(e.target.value, 10))
                    }
                  >
                    {(options?.tipos_personal_salud || []).map((tp) => (
                      <option key={tp.id} value={tp.id}>
                        {tp.nombre}
                      </option>
                    ))}
                  </Select>
                </FormGroup>
              </Grid>

              <Actions>
                <Button onClick={handleDownload} disabled={loading}>
                  {t("common.download")}
                </Button>
              </Actions>
            </>
          )}
        </Card>
      </Wrap>
    </Page>
  );
};

export default Reports;

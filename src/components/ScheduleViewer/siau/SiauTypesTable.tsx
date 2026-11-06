import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDelayedLoading } from "../../../hooks/useDelayedLoading";
import { getDayAbbreviation } from "../../../helpers/ScheduleHelper";
import LoadingSpinner from "../../Shared/LoadingSpinner/LoadingSpinner";
import {
  DataTable,
  HeaderCell,
  LoadingOverlay,
  TableBody,
  TableHead,
  SiauTableContainer,
  SiauHeaderCell,
  SiauNameCell,
  SiauNameText,
  SiauValueCell,
  SiauInputField,
  SiauCalculatedRow,
  SiauCalculatedNameCell,
  SiauCalculatedCell,
} from "../ScheduleViewerStyles";

type ISiauType = { id: number; nombre: string };

const SIAU_IDS = {
  GESTANTES: 6,
  CRONICOS: 5,
  MEDICINA_GENERAL: 7,
  PEYDT: 8,
  SOL_CE_ATENDIDA: 1,
  SOL_EXTRAMURALES: 3,
  INASISTENTES: 4,
  SOL_CE_TOTAL: 2,
} as const;

// Tipos que siguen guardándose pero no se muestran en el cuadro
const HIDDEN_SIAU_IDS: readonly number[] = [SIAU_IDS.SOL_CE_ATENDIDA];

const toNumberSafe = (v: unknown): number => {
  const n = typeof v === "number" ? v : parseFloat(String(v ?? "0"));
  return Number.isFinite(n) ? n : 0;
};

const round2 = (n: number) => Math.round(n * 100) / 100;

export const SiauTypesTable: React.FC<{
  loading: boolean;
  year: number;
  monthIndex0: number;
  days: number[];
  monthLabel: string;
  siauTypes: ISiauType[];
  canEdit?: boolean;
  valuesByKey?: Record<string, number>; // `${tipoId}-${day}`
  inputsByKey?: Record<string, string>; // `${tipoId}-${day}`
  onChangeCell?: (_tipoId: number, _day: number, _v: string) => void;
  onBlurCell?: (_tipoId: number, _day: number) => void;
  ceDoctorsByDay?: Record<number, number>; // { [day]: count }
}> = ({
  loading,
  year,
  monthIndex0,
  days,
  monthLabel,
  siauTypes,
  canEdit = false,
  valuesByKey = {},
  inputsByKey = {},
  onChangeCell,
  onBlurCell,
  ceDoctorsByDay = {},
}) => {
  const { t } = useTranslation();
  const showLoading = useDelayedLoading(loading);
  // Obtiene el valor “actual” de una celda: si puede editar toma input, si no persisted
  const getValue = (tipoId: number, day: number): number => {
    const key = `${tipoId}-${day}`;
    if (canEdit) return toNumberSafe(inputsByKey[key] ?? 0);
    return toNumberSafe(valuesByKey[key] ?? 0);
  };

  const visibleSiauTypes = useMemo(
    () =>
      (siauTypes || []).filter((tipo) => !HIDDEN_SIAU_IDS.includes(tipo.id)),
    [siauTypes],
  );

  const calculatedByDay = useMemo(() => {
    const out: Record<
      number,
      {
        totalTurnos: number;
        medicosCE: number;
        citasOfertadas: number;
        tasaEficienciaPct: number; // 0..100
        indicadorDemandaInsatisfechaPct: number; // 0..100
      }
    > = {};

    days.forEach((d) => {
      const cronicos = getValue(SIAU_IDS.CRONICOS, d);
      const gestantes = getValue(SIAU_IDS.GESTANTES, d);
      const medGen = getValue(SIAU_IDS.MEDICINA_GENERAL, d);
      const peydt = getValue(SIAU_IDS.PEYDT, d);
      const inasistentes = getValue(SIAU_IDS.INASISTENTES, d);
      const totalSolicitudes = getValue(SIAU_IDS.SOL_CE_TOTAL, d);

      const medicosCE = toNumberSafe(ceDoctorsByDay[d] ?? 0);

      const totalTurnos = round2(
        cronicos * 1.33 + gestantes * 3 + medGen + peydt * 2 + inasistentes * 1,
      );

      const citasOfertadas = medicosCE * 32;

      const tasaEficienciaPct =
        citasOfertadas > 0 ? (totalTurnos / citasOfertadas) * 100 : 0;

      const indicadorDemandaInsatisfechaPct =
        totalSolicitudes > 0
          ? ((totalSolicitudes - totalTurnos) / totalSolicitudes) * 100
          : 0;

      out[d] = {
        totalTurnos,
        medicosCE,
        citasOfertadas,
        tasaEficienciaPct: round2(tasaEficienciaPct),
        indicadorDemandaInsatisfechaPct: round2(
          indicadorDemandaInsatisfechaPct,
        ),
      };
    });

    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days, canEdit, valuesByKey, inputsByKey, ceDoctorsByDay]);

  // Helper para pintar fila calculada
  const renderCalculatedRow = (
    label: string,
    getCell: (_day: number) => React.ReactNode,
  ) => (
    <SiauCalculatedRow>
      <SiauCalculatedNameCell title={label}>
        <SiauNameText>{label}</SiauNameText>
      </SiauCalculatedNameCell>
      {days.map((d) => (
        <SiauCalculatedCell key={`calc-${label}-${d}`} $center>
          {getCell(d)}
        </SiauCalculatedCell>
      ))}
    </SiauCalculatedRow>
  );

  return (
    <SiauTableContainer>
      {showLoading && (
        <LoadingOverlay>
          <LoadingSpinner />
        </LoadingOverlay>
      )}

      <DataTable aria-busy={loading}>
        <TableHead>
          <tr>
            <SiauHeaderCell $sticky>{year}</SiauHeaderCell>
            {days.map((day) => (
              <HeaderCell key={`siau-h-${day}`}>
                <div>{day}</div>
                <div>{getDayAbbreviation(day, monthIndex0, year)}</div>
              </HeaderCell>
            ))}
          </tr>
        </TableHead>

        <TableBody>
          {/* Separador con el nombre del mes */}
          <tr>
            <SiauNameCell title={monthLabel}>
              <SiauNameText>{monthLabel}</SiauNameText>
            </SiauNameCell>
            {days.map((day) => (
              <SiauValueCell key={`siau-m-${day}`} />
            ))}
          </tr>

          {/* Filas SIAU normales (persistidas/editables) */}
          {visibleSiauTypes.map((tipo) => (
            <tr key={`siau-row-${tipo.id}`}>
              <SiauNameCell title={tipo.nombre}>
                <SiauNameText>{tipo.nombre}</SiauNameText>
              </SiauNameCell>
              {days.map((d) => {
                const key = `${tipo.id}-${d}`;
                const persisted = valuesByKey[key] ?? 0;
                const inputVal = inputsByKey[key] ?? String(persisted);

                return (
                  <SiauValueCell key={`siau-${tipo.id}-${d}`} $center>
                    {canEdit ? (
                      <SiauInputField
                        type="text"
                        size={1}
                        value={inputVal}
                        onChange={(e) =>
                          onChangeCell?.(tipo.id, d, e.target.value)
                        }
                        onBlur={() => onBlurCell?.(tipo.id, d)}
                        aria-label={`SIAU ${tipo.nombre} – día ${d}`}
                      />
                    ) : (
                      persisted
                    )}
                  </SiauValueCell>
                );
              })}
            </tr>
          ))}

          {/* === FILAS CALCULADAS === */}
          {renderCalculatedRow(
            t("scheduleViewer.siau.totalTurnos"),
            (d) => calculatedByDay[d]?.totalTurnos ?? 0,
          )}

          {renderCalculatedRow(
            t("scheduleViewer.siau.medicosCe"),
            (d) => calculatedByDay[d]?.medicosCE ?? 0,
          )}

          {renderCalculatedRow(
            t("scheduleViewer.siau.citasOfertadas"),
            (d) => calculatedByDay[d]?.citasOfertadas ?? 0,
          )}

          {renderCalculatedRow(
            t("scheduleViewer.siau.tasaEficiencia"),
            (d) => `${calculatedByDay[d]?.tasaEficienciaPct ?? 0}%`,
          )}

          {renderCalculatedRow(
            t("scheduleViewer.siau.indicadorDemanda"),
            (d) =>
              `${calculatedByDay[d]?.indicadorDemandaInsatisfechaPct ?? 0}%`,
          )}
        </TableBody>
      </DataTable>
    </SiauTableContainer>
  );
};

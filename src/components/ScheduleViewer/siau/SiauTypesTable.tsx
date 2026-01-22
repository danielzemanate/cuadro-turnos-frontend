import React, { useMemo } from "react";
import { getDayAbbreviation } from "../../../helpers/ScheduleHelper";
import LoadingSpinner from "../../Shared/LoadingSpinner/LoadingSpinner";
import {
  DataCell,
  DataTable,
  HeaderCell,
  LoadingOverlay,
  StaffNameCell,
  TableBody,
  TableContainer,
  TableHead,
  InputField,
  SiauNameCell,
  SiauCalculatedRow,
  SiauCalculatedNameCell,
  SiauCalculatedCell,
} from "../ScheduleViewerStyles";

type ISiauType = { id: number; nombre: string };

// IDs existentes (según tu lista)
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

const toNumberSafe = (v: unknown): number => {
  const n = typeof v === "number" ? v : parseFloat(String(v ?? "0"));
  return Number.isFinite(n) ? n : 0;
};

// const round0 = (n: number) => Math.round(n);

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
  // Obtiene el valor “actual” de una celda: si puede editar toma input, si no persisted
  const getValue = (tipoId: number, day: number): number => {
    const key = `${tipoId}-${day}`;
    if (canEdit) return toNumberSafe(inputsByKey[key] ?? 0);
    return toNumberSafe(valuesByKey[key] ?? 0);
  };

  // ✅ Calculados por día
  const calculatedByDay = useMemo(() => {
    const out: Record<
      number,
      {
        totalTurnos: number;
        ambulatoriosProgramados: number;
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

      const atendida = getValue(SIAU_IDS.SOL_CE_ATENDIDA, d);
      const inasistentes = getValue(SIAU_IDS.INASISTENTES, d);
      const totalSolicitudes = getValue(SIAU_IDS.SOL_CE_TOTAL, d);

      const medicosCE = toNumberSafe(ceDoctorsByDay[d] ?? 0);

      // Fórmulas
      const totalTurnos = cronicos * 1.33 + gestantes * 3 + medGen;

      const ambulatoriosProgramados = atendida + inasistentes;

      const citasOfertadas = medicosCE * 32;

      const tasaEficienciaPct =
        totalSolicitudes > 0 ? (atendida / totalSolicitudes) * 100 : 0;

      const indicadorDemandaInsatisfechaPct =
        totalSolicitudes > 0
          ? ((totalSolicitudes - atendida) / totalSolicitudes) * 100
          : 0;

      out[d] = {
        totalTurnos: totalTurnos,
        ambulatoriosProgramados: ambulatoriosProgramados,
        medicosCE: medicosCE,
        citasOfertadas: citasOfertadas,
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
      <SiauCalculatedNameCell title={label}>{label}</SiauCalculatedNameCell>
      {days.map((d) => (
        <SiauCalculatedCell key={`calc-${label}-${d}`} $center>
          {getCell(d)}
        </SiauCalculatedCell>
      ))}
    </SiauCalculatedRow>
  );

  return (
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
            <StaffNameCell>{monthLabel}</StaffNameCell>
            {days.map((day) => (
              <DataCell key={`siau-m-${day}`} />
            ))}
          </tr>

          {/* Filas SIAU normales (persistidas/editables) */}
          {(siauTypes || []).map((tipo) => (
            <tr key={`siau-row-${tipo.id}`}>
              <SiauNameCell title={tipo.nombre}>{tipo.nombre}</SiauNameCell>
              {days.map((d) => {
                const key = `${tipo.id}-${d}`;
                const persisted = valuesByKey[key] ?? 0;
                const inputVal = inputsByKey[key] ?? String(persisted);

                return (
                  <DataCell key={`siau-${tipo.id}-${d}`} $center>
                    {canEdit ? (
                      <InputField
                        type="text"
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
                  </DataCell>
                );
              })}
            </tr>
          ))}

          {/* ===========================
              ✅ NUEVAS FILAS CALCULADAS
              =========================== */}
          {renderCalculatedRow(
            "N° TOTAL DE TURNOS",
            (d) => calculatedByDay[d]?.totalTurnos ?? 0,
          )}

          {renderCalculatedRow(
            "N° AMBULATORIOS PROGRAMADOS",
            (d) => calculatedByDay[d]?.ambulatoriosProgramados ?? 0,
          )}

          {renderCalculatedRow(
            "N° TOTAL DE MÉDICO GENERAL ASIGNADOS A C.E",
            (d) => calculatedByDay[d]?.medicosCE ?? 0,
          )}

          {renderCalculatedRow(
            "N° DE CITAS OFERTADAS SEGÚN MÉDICOS ASIGNADOS A C.E EN EL DÍA",
            (d) => calculatedByDay[d]?.citasOfertadas ?? 0,
          )}

          {renderCalculatedRow(
            "TASA DE EFICIENCIA DE LA UTILIZACIÓN DE CITAS (%)",
            (d) => `${calculatedByDay[d]?.tasaEficienciaPct ?? 0}%`,
          )}

          {renderCalculatedRow(
            "INDICADOR DEMANDA INSATISFECHA (%)",
            (d) =>
              `${calculatedByDay[d]?.indicadorDemandaInsatisfechaPct ?? 0}%`,
          )}
        </TableBody>
      </DataTable>
    </TableContainer>
  );
};

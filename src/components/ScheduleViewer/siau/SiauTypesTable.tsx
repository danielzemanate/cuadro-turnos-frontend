import React from "react";
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
} from "../ScheduleViewerStyles";

type ISiauType = { id: number; nombre: string };

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
}) => {
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

          {/* Filas por cada tipo SIAU */}
          {(siauTypes || []).map((tipo) => (
            <tr key={`siau-row-${tipo.id}`}>
              <StaffNameCell title={tipo.nombre}>{tipo.nombre}</StaffNameCell>
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
        </TableBody>
      </DataTable>
    </TableContainer>
  );
};

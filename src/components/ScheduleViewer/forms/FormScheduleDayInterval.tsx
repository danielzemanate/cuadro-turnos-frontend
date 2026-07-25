import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Plus, Trash2 } from "lucide-react";
import {
  createNextInterval,
  from12To24,
  from24To12,
  getScheduleIntervalsValidationError,
  hoursBetweenHhMm,
  IntervalHhMm,
  isValidScheduleIntervals,
  Meridiem,
  requiredIntervalHoursForSigla,
  Time12,
  toMinutes,
  totalIntervalHours,
} from "../../../helpers/ScheduleIntervalHelper";

const Hint = styled.p`
  margin: 0 0 0.75rem;
  color: #6b7280;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const IntervalCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 0.65rem;
  padding: 0.65rem 0.75rem;
  background: #f9fafb;
`;

const IntervalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const IntervalTitle = styled.span`
  font-size: 0.8rem;
  font-weight: 700;
  color: #374151;
`;

const RemoveButton = styled.button`
  appearance: none;
  border: none;
  background: transparent;
  color: #be123c;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.15rem 0.25rem;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const Label = styled.label`
  font-size: 0.8rem;
  font-weight: 600;
  color: #374151;
`;

const TimeRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.35rem;
`;

const Select = styled.select`
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 0.45rem 0.35rem;
  font-size: 0.85rem;
  color: #111827;
  background: #ffffff;

  &:focus {
    outline: none;
    border-color: #0f2167;
    box-shadow: 0 0 0 3px rgba(15, 33, 103, 0.15);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

const RowMeta = styled.p`
  margin: 0.4rem 0 0;
  font-size: 0.75rem;
  color: #6b7280;
`;

const FooterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 0.85rem;
  flex-wrap: wrap;
`;

const AddButton = styled.button`
  appearance: none;
  border: 1px dashed #93c5fd;
  background: #eff6ff;
  color: #0f2167;
  font-weight: 700;
  font-size: 0.8rem;
  padding: 0.45rem 0.7rem;
  border-radius: 0.5rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;

  &:hover {
    background: #dbeafe;
  }
`;

const TotalMeta = styled.p`
  margin: 0;
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
`;

const ErrorText = styled.span`
  display: block;
  margin-top: 0.5rem;
  color: #dc2626;
  font-size: 0.75rem;
`;

const HOURS_12 = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);
const MERIDIEMS: Meridiem[] = ["AM", "PM"];

type Time12PickerProps = {
  id: string;
  valueHhMm: string;
  minHhMm?: string;
  onChange: (_hhmm: string) => void;
};

const Time12Picker: React.FC<Time12PickerProps> = ({
  id,
  valueHhMm,
  minHhMm,
  onChange,
}) => {
  const time = from24To12(valueHhMm);
  const minMinutes = minHhMm ? toMinutes(minHhMm) : null;

  const commit = (next: Time12) => {
    let hhmm = from12To24(next);
    if (minMinutes !== null) {
      const mins = toMinutes(hhmm);
      if (mins !== null && mins < minMinutes) {
        hhmm = minHhMm!;
      }
    }
    onChange(hhmm);
  };

  return (
    <TimeRow>
      <Select
        id={`${id}-hour`}
        aria-label="Hora"
        value={time.hour}
        onChange={(e) => commit({ ...time, hour: Number(e.target.value) })}
      >
        {HOURS_12.map((h) => (
          <option key={h} value={h}>
            {h}
          </option>
        ))}
      </Select>
      <Select
        id={`${id}-minute`}
        aria-label="Minuto"
        value={time.minute}
        onChange={(e) => commit({ ...time, minute: Number(e.target.value) })}
      >
        {MINUTES.map((m) => (
          <option key={m} value={m}>
            {String(m).padStart(2, "0")}
          </option>
        ))}
      </Select>
      <Select
        id={`${id}-meridiem`}
        aria-label="AM/PM"
        value={time.meridiem}
        onChange={(e) =>
          commit({ ...time, meridiem: e.target.value as Meridiem })
        }
      >
        {MERIDIEMS.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </Select>
    </TimeRow>
  );
};

type FormScheduleDayIntervalProps = {
  sigla: string;
  values: IntervalHhMm[];
  onChange: (_next: IntervalHhMm[]) => void;
};

export const FormScheduleDayInterval: React.FC<
  FormScheduleDayIntervalProps
> = ({ sigla, values, onChange }) => {
  const { t } = useTranslation();
  const requiredHours = requiredIntervalHoursForSigla(sigla);
  const total = totalIntervalHours(values);
  const valid = isValidScheduleIntervals(values, sigla);
  const errorCode = getScheduleIntervalsValidationError(values, sigla);

  const updateAt = (index: number, patch: Partial<IntervalHhMm>) => {
    const next = values.map((item, i) =>
      i === index ? { ...item, ...patch } : item,
    );

    // Si se mueve el fin de un intervalo, el siguiente no puede quedar hacia atrás
    for (let i = 1; i < next.length; i += 1) {
      const prevEnd = toMinutes(next[i - 1].horaFin);
      const currStart = toMinutes(next[i].horaInicio);
      if (prevEnd !== null && currStart !== null && currStart < prevEnd) {
        next[i] = {
          ...next[i],
          horaInicio: next[i - 1].horaFin,
          horaFin:
            toMinutes(next[i].horaFin)! <= prevEnd
              ? minutesSafeEnd(prevEnd)
              : next[i].horaFin,
        };
      }
    }

    onChange(next);
  };

  const addInterval = () => {
    const previous = values[values.length - 1];
    onChange([...values, createNextInterval(previous)]);
  };

  const removeAt = (index: number) => {
    if (values.length <= 1) return;
    onChange(values.filter((_, i) => i !== index));
  };

  const errorMessage =
    errorCode === "total"
      ? t("scheduleViewer.interval.exactHoursError", {
          hours: requiredHours,
          sigla,
        })
      : errorCode === "sequence"
        ? t("scheduleViewer.interval.sequenceError")
        : errorCode === "row"
          ? t("scheduleViewer.interval.rowError")
          : errorCode
            ? t("scheduleViewer.interval.minHoursError", {
                hours: requiredHours,
              })
            : null;

  return (
    <>
      <Hint>
        {t("scheduleViewer.interval.description", {
          sigla,
          hours: requiredHours,
        })}
      </Hint>

      <List>
        {values.map((item, index) => {
          const duration = hoursBetweenHhMm(item.horaInicio, item.horaFin);
          const minStart = index > 0 ? values[index - 1].horaFin : undefined;
          return (
            <IntervalCard key={`interval-${index}`}>
              <IntervalHeader>
                <IntervalTitle>
                  {t("scheduleViewer.interval.itemLabel", {
                    number: index + 1,
                  })}
                </IntervalTitle>
                <RemoveButton
                  type="button"
                  onClick={() => removeAt(index)}
                  disabled={values.length <= 1}
                  aria-label={t("scheduleViewer.interval.remove")}
                >
                  <Trash2 size={14} />
                  {t("scheduleViewer.interval.remove")}
                </RemoveButton>
              </IntervalHeader>
              <Row>
                <Field>
                  <Label htmlFor={`schedule-interval-start-${index}-hour`}>
                    {t("scheduleViewer.interval.start")}
                  </Label>
                  <Time12Picker
                    id={`schedule-interval-start-${index}`}
                    valueHhMm={item.horaInicio}
                    minHhMm={minStart}
                    onChange={(hhmm) => updateAt(index, { horaInicio: hhmm })}
                  />
                </Field>
                <Field>
                  <Label htmlFor={`schedule-interval-end-${index}-hour`}>
                    {t("scheduleViewer.interval.end")}
                  </Label>
                  <Time12Picker
                    id={`schedule-interval-end-${index}`}
                    valueHhMm={item.horaFin}
                    minHhMm={item.horaInicio}
                    onChange={(hhmm) => updateAt(index, { horaFin: hhmm })}
                  />
                </Field>
              </Row>
              <RowMeta>
                {t("scheduleViewer.interval.duration", {
                  hours: Number.isFinite(duration) ? duration.toFixed(1) : "0",
                })}
              </RowMeta>
            </IntervalCard>
          );
        })}
      </List>

      <FooterRow>
        <AddButton type="button" onClick={addInterval}>
          <Plus size={16} />
          {t("scheduleViewer.interval.add")}
        </AddButton>
        <TotalMeta>
          {t("scheduleViewer.interval.totalDuration", {
            hours: Number.isFinite(total) ? total.toFixed(1) : "0",
            required: requiredHours,
          })}
        </TotalMeta>
      </FooterRow>

      {!valid && errorMessage && <ErrorText>{errorMessage}</ErrorText>}
    </>
  );
};

const minutesSafeEnd = (prevEnd: number): string => {
  const end = Math.min(prevEnd + 60, 23 * 60 + 59);
  const h = Math.floor(end / 60);
  const m = end % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

export default FormScheduleDayInterval;

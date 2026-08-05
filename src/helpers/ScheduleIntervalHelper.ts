import {
  INTERVAL_REQUIRED_HOURS,
  MIN_SCHEDULE_INTERVAL_HOURS,
} from "../constants/schedule.constants";

export type Meridiem = "AM" | "PM";

export type Time12 = {
  hour: number; // 1-12
  minute: number; // 0-59
  meridiem: Meridiem;
};

export type IntervalHhMm = {
  horaInicio: string; // 24h "HH:MM"
  horaFin: string;
};

/** Horas exactas requeridas según sigla (CE = 8). */
export const requiredIntervalHoursForSigla = (sigla: string): number =>
  INTERVAL_REQUIRED_HOURS[sigla as keyof typeof INTERVAL_REQUIRED_HOURS] ??
  MIN_SCHEDULE_INTERVAL_HOURS;

/** Convierte "HH:MM" (24h) a formato API `HH:MM:SS.0000`. */
export const toApiTime = (hhmm: string): string => {
  const [h = "00", m = "00"] = hhmm.split(":");
  return `${h.padStart(2, "0")}:${m.padStart(2, "0")}:00.0000`;
};

export const toMinutes = (hhmm: string): number | null => {
  if (!hhmm) return null;
  const [h, m] = hhmm.split(":").map(Number);
  if ([h, m].some((n) => Number.isNaN(n))) return null;
  if (h < 0 || h > 23 || m < 0 || m > 59) return null;
  return h * 60 + m;
};

export const minutesToHhMm = (totalMinutes: number): string => {
  const clamped = Math.max(0, Math.min(totalMinutes, 23 * 60 + 59));
  const h = Math.floor(clamped / 60);
  const m = clamped % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

export const from24To12 = (hhmm: string): Time12 => {
  const mins = toMinutes(hhmm) ?? 8 * 60;
  const h24 = Math.floor(mins / 60);
  const minute = mins % 60;
  const meridiem: Meridiem = h24 >= 12 ? "PM" : "AM";
  let hour = h24 % 12;
  if (hour === 0) hour = 12;
  return { hour, minute, meridiem };
};

export const from12To24 = (time: Time12): string => {
  let hour = time.hour % 12;
  if (time.meridiem === "PM") hour += 12;
  if (time.meridiem === "AM" && time.hour === 12) hour = 0;
  if (time.meridiem === "PM" && time.hour === 12) hour = 12;
  return minutesToHhMm(hour * 60 + (time.minute || 0));
};

/** Diferencia en horas entre dos "HH:MM" del mismo día. Si fin <= inicio, retorna 0. */
export const hoursBetweenHhMm = (start: string, end: string): number => {
  const startMin = toMinutes(start);
  const endMin = toMinutes(end);
  if (startMin === null || endMin === null) return 0;
  if (endMin <= startMin) return 0;
  return (endMin - startMin) / 60;
};

export const totalIntervalHours = (intervals: IntervalHhMm[]): number =>
  intervals.reduce(
    (sum, item) => sum + hoursBetweenHhMm(item.horaInicio, item.horaFin),
    0,
  );

/** Cada intervalo: fin > inicio; el siguiente no puede empezar antes del fin del anterior; total exacto. */
export const getScheduleIntervalsValidationError = (
  intervals: IntervalHhMm[],
  sigla: string,
): "empty" | "row" | "sequence" | "total" | null => {
  if (!intervals.length) return "empty";

  for (const item of intervals) {
    if (hoursBetweenHhMm(item.horaInicio, item.horaFin) <= 0) return "row";
  }

  for (let i = 1; i < intervals.length; i += 1) {
    const prevEnd = toMinutes(intervals[i - 1].horaFin);
    const currStart = toMinutes(intervals[i].horaInicio);
    if (prevEnd === null || currStart === null || currStart < prevEnd) {
      return "sequence";
    }
  }

  const required = requiredIntervalHoursForSigla(sigla);
  const totalMinutes = Math.round(totalIntervalHours(intervals) * 60);
  if (totalMinutes !== required * 60) return "total";

  return null;
};

export const isValidScheduleIntervals = (
  intervals: IntervalHhMm[],
  sigla: string,
): boolean => getScheduleIntervalsValidationError(intervals, sigla) === null;

export const createEmptyInterval = (sigla?: string): IntervalHhMm => {
  const hours = sigla ? requiredIntervalHoursForSigla(sigla) : 8;
  // 7:00 AM + horas exactas (tope 11:59 PM)
  const startMin = 7 * 60;
  const endMin = Math.min(startMin + hours * 60, 23 * 60 + 59);
  return {
    horaInicio: minutesToHhMm(startMin),
    horaFin: minutesToHhMm(endMin),
  };
};

export const createNextInterval = (previous: IntervalHhMm): IntervalHhMm => {
  const prevEnd = toMinutes(previous.horaFin) ?? 8 * 60;
  const start = minutesToHhMm(prevEnd);
  const end = minutesToHhMm(Math.min(prevEnd + 60, 23 * 60 + 59));
  return { horaInicio: start, horaFin: end };
};

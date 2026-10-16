import { DayBucket, Dia, PeriodoLike } from "../interfaces/schedule";

// Constants
export const DAY_ABBREVIATIONS = ["D", "L", "M", "M", "J", "V", "S"] as const;

// Date utilities
export const getDayAbbreviation = (
  day: number,
  monthIndex0: number,
  year: number,
): string => {
  const date = new Date(year, monthIndex0, day);
  const dayOfWeek = date.getDay();
  return DAY_ABBREVIATIONS[dayOfWeek];
};

export const daysInMonth = (year: number, monthIndex0: number): number =>
  new Date(year, monthIndex0 + 1, 0).getDate();

export const generateDaysArray = (totalDays: number): number[] =>
  Array.from({ length: totalDays }, (_, i) => i + 1);

// Schedule calculations
export const sumUserDay = (
  dias: Dia[],
  day: number,
  includeNovelties: boolean,
): number => {
  return dias.reduce((total, dia) => {
    if (dia.num_dia !== day) return total;
    if (dia.es_novedad) {
      return includeNovelties ? total + dia.horas : total;
    }
    return total + dia.horas;
  }, 0);
};

export const createDayBuckets = (dias: Dia[]): Record<number, DayBucket> => {
  return dias.reduce(
    (buckets, dia) => {
      if (!buckets[dia.num_dia]) {
        buckets[dia.num_dia] = { novedades: [] };
      }

      if (dia.es_novedad) {
        buckets[dia.num_dia].novedades.push(dia);
      } else {
        buckets[dia.num_dia].normal = dia;
      }

      return buckets;
    },
    {} as Record<number, DayBucket>,
  );
};

// CSV utilities
export const escapeCSV = (value: string | number): string =>
  `"${String(value).replace(/"/g, '""')}"`;

export const generateCSVContent = (data: (string | number)[][]): string =>
  data.map((row) => row.map(escapeCSV).join(",")).join("\n");

export const downloadCSV = (content: string, filename: string): void => {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
};

// Validation utilities
export const isValidFormState = (
  periodo: PeriodoLike | null,
  tipo: number | null,
  municipio: number | null,
): boolean => Boolean(periodo && tipo && municipio);

// Format utilities
export const formatPersonName = (nombre: string, apellidos: string): string =>
  `${nombre} ${apellidos}`;

export const getNoveltyJustifications = (novedades: Dia[]): string =>
  novedades
    .map((n) => n.justificacion || "")
    .filter(Boolean)
    .join(" / ");

export const sumNoveltyHours = (novedades: Dia[]): number =>
  novedades.reduce((sum, n) => sum + n.horas, 0);

const NOVELTY_HOURS_DECIMALS = 2;
const NOVELTY_HOURS_MAX_INT_DIGITS = 10;

// Coma o punto, hasta 2 decimales, y un menos solo al inicio. El resto se descarta.
export const sanitizeSignedDecimal = (raw: string): string => {
  const cleaned = raw.replace(/\./g, ",").replace(/[^\d,-]/g, "");
  const negative = cleaned.startsWith("-");
  const unsigned = cleaned.replace(/-/g, "");
  const commaAt = unsigned.indexOf(",");
  const intDigits = commaAt === -1 ? unsigned : unsigned.slice(0, commaAt);
  const intPart = intDigits.slice(0, NOVELTY_HOURS_MAX_INT_DIGITS);
  if (commaAt === -1) return negative ? `-${intPart}` : intPart;

  const decimals = unsigned
    .slice(commaAt + 1)
    .replace(/,/g, "")
    .slice(0, NOVELTY_HOURS_DECIMALS);
  const body = `${intPart},${decimals}`;
  return negative ? `-${body}` : body;
};

export const parseSignedDecimal = (raw: string | undefined): number => {
  if (!raw) return 0;
  let normalized = raw.trim().replace(",", ".");
  if (normalized.endsWith(".")) normalized = normalized.slice(0, -1);
  if (normalized.startsWith(".")) normalized = `0${normalized}`;
  if (normalized.startsWith("-.")) normalized = `-0${normalized.slice(1)}`;
  if (!/^-?\d+(\.\d+)?$/.test(normalized)) return 0;
  const value = Number(normalized);
  if (!Number.isFinite(value)) return 0;
  return Math.round(value * 100) / 100;
};

export const formatSignedDecimal = (value: number): string => {
  if (!Number.isFinite(value)) return "0";
  const rounded = Math.round(value * 100) / 100;
  const negative = rounded < 0;
  const [whole, frac] = Math.abs(rounded).toFixed(2).split(".");
  const trimmed = frac.replace(/0+$/, "");
  const body = trimmed ? `${whole},${trimmed}` : whole;
  return negative ? `-${body}` : body;
};

// Period utilities
export const sortPeriodos = <T extends { anio: number; mes: number }>(
  periodos: T[],
): T[] => [...periodos].sort((a, b) => a.anio - b.anio || a.mes - b.mes);

export const findPeriodo = <T extends { anio: number; mes: number }>(
  periodos: T[],
  targetYear: number,
  targetMonth: number,
  fallbackYear?: number,
  fallbackMonth?: number,
): T | null => {
  // Try exact match first
  const exactMatch = periodos.find(
    (p) => p.anio === targetYear && p.mes === targetMonth,
  );
  if (exactMatch) return exactMatch;

  // Try fallback with either year or month
  if (fallbackYear !== undefined) {
    const yearMatch = periodos.find(
      (p) => p.anio === fallbackYear && p.mes === targetMonth,
    );
    if (yearMatch) return yearMatch;
  }

  if (fallbackMonth !== undefined) {
    const monthMatch = periodos.find(
      (p) => p.anio === targetYear && p.mes === fallbackMonth,
    );
    if (monthMatch) return monthMatch;
  }

  // Try just by year or month
  const byYear = periodos.find((p) => p.anio === targetYear);
  if (byYear) return byYear;

  const byMonth = periodos.find((p) => p.mes === targetMonth);
  if (byMonth) return byMonth;

  return null;
};

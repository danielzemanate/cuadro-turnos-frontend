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

const TOTAL_MINUTES_PER_DAY = 480; // 8h * 60

export type PatientsTraffic = "red" | "yellow" | "green" | "none";

export const getMinutesPerPatient = (patients: number): number | null => {
  if (!patients || patients <= 0) return null;
  return TOTAL_MINUTES_PER_DAY / patients;
};

export const getPatientsTraffic = (patients: number): PatientsTraffic => {
  const mpp = getMinutesPerPatient(patients);
  if (mpp === null) return "none";

  if (mpp < 12) return "red";
  if (mpp < 13.3) return "yellow";
  if (mpp <= 17.1) return "green";
  if (mpp <= 20) return "yellow";
  return "red";
};

export const SESSION_LAST_ACTIVITY_KEY = "session:lastActivityAt";

export const readLastActivity = (): number | null => {
  try {
    const raw = localStorage.getItem(SESSION_LAST_ACTIVITY_KEY);
    if (!raw) return null;
    const value = Number(raw);
    return Number.isFinite(value) ? value : null;
  } catch {
    return null;
  }
};

export const writeLastActivity = (timestamp: number): void => {
  try {
    localStorage.setItem(SESSION_LAST_ACTIVITY_KEY, String(timestamp));
  } catch {
    // localStorage puede fallar en modo privado
  }
};

export const clearLastActivity = (): void => {
  try {
    localStorage.removeItem(SESSION_LAST_ACTIVITY_KEY);
  } catch {
    // ignore
  }
};

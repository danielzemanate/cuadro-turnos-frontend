import { useEffect, useState } from "react";

export const LOADING_SHOW_DELAY_MS = 300;

// No pintar el spinner si la petición termina antes: evita el velo de un frame.
export const useDelayedLoading = (
  loading: boolean,
  delayMs: number = LOADING_SHOW_DELAY_MS,
): boolean => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!loading) {
      setVisible(false);
      return;
    }

    const timeoutId = window.setTimeout(() => setVisible(true), delayMs);
    return () => window.clearTimeout(timeoutId);
  }, [loading, delayMs]);

  return visible;
};

/** Inactividad en página abierta antes del modal “¿Permanecer aquí?”. */
export const SESSION_STAY_MODAL_MS = 10 * 60 * 1000;

export const SESSION_STAY_MODAL_MINUTES = SESSION_STAY_MODAL_MS / 60_000;

/** Inactividad con pestaña cerrada / recarga antes de logout directo (10 h). */
export const SESSION_AWAY_LOGOUT_MS = 10 * 60 * 60 * 1000;

/** Tiempo para responder el modal; si no, se cierra la sesión. */
export const SESSION_WARNING_MS = 60 * 1000;

/** Intervalo para comprobar inactividad y el conteo del modal. */
export const SESSION_IDLE_CHECK_MS = 1000;

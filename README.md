# cuadro-turnos

Sistema de gestión de turnos para la E.S.E. Suroccidente. Módulos activos: visualización y edición de turnos, reportes PDF, administración de catálogos y usuarios, permisos especiales, citas, cargue de archivos (ASMET / NUEVA EPS) y vacaciones (solicitud del personal de salud y gestión de aprobación).

La guía para cambiar código está en `AGENTS.md`. El comportamiento de cara al usuario está en `docs/briefing-manual-usuario-para-agente.md`.

## Sesión

Tras **10 minutos** de inactividad en la página aparece un modal: **Sí, permanecer aquí** o **No, cerrar sesión**. Si no hay respuesta en 60 segundos, la sesión se cierra sola. El contador se reinicia con mouse, clic, teclado, scroll o touch. Si se cierra la pestaña y se vuelve después de **10 horas** (`SESSION_AWAY_LOGOUT_MS`), la sesión se cierra al reabrir. Los tiempos están en `src/constants/session.constants.ts`.


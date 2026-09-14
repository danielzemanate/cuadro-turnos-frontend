# cuadro-turnos

Sistema de gestión de turnos para la entidad de salud ESE Suroccidente. Incluye módulos para administración de roles, reportes, programación de turnos y almacenamiento de medicamentos.

## Sesión

Tras **10 minutos** de inactividad en la página aparece un modal: **Sí, permanecer aquí** o **No, cerrar sesión**. Si no hay respuesta en 60 segundos, la sesión se cierra sola. El contador se reinicia con mouse, clic, teclado, scroll o touch. Si se cierra la pestaña y se vuelve después de **10 horas** (`SESSION_AWAY_LOGOUT_MS`), la sesión se cierra al reabrir. Los tiempos están en `src/constants/session.constants.ts`.


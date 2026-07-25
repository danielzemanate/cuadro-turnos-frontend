# AGENTS.md — cuadro-turnos-frontend

Guía de arquitectura para agentes de IA que trabajen en este repositorio. Lee esto antes de modificar código.

## Qué es este proyecto

SPA de **gestión de cuadros de turnos** para la E.S.E. Suroccidente. Permite visualizar/editar turnos y novedades, registrar pacientes y demanda SIAU, generar reportes PDF, administrar catálogos/usuarios, otorgar permisos especiales de edición y gestionar **citas** (agenda, alta, cancelación y reprogramación) contra un backend aparte.

**Stack:** React 19 · TypeScript · Vite 7 · Redux Toolkit + redux-thunk + redux-persist · styled-components · react-router-dom 7 · axios · Formik · i18next · lucide-react.

**Puerto dev:** `3000` (`npm run dev`).

---

## Arranque y bootstrap

```
main.tsx
  └─ Provider (Redux store)
       └─ PersistGate (redux-persist)
            └─ BrowserRouter
                 └─ StyleSheetManager (filtra props inválidas al DOM)
                      └─ App.tsx
                           └─ ThemeProvider + GlobalContainerStyled + AppRouter
                                └─ WebSiteAppRouter (rutas reales)
```

Archivos clave:

| Archivo | Rol |
|---|---|
| `src/main.tsx` | Bootstrap React + Redux + Router + i18n |
| `src/App.tsx` | Theme + router |
| `src/router/AppRouter.tsx` | Wrapper trivial → `WebSiteAppRouter` |
| `src/router/WebSiteAppRouter.tsx` | Definición de rutas |
| `src/i18n.tsx` + `src/language/es.json` | Traducciones (solo español) |

---

## Estructura de carpetas

```
src/
├── components/          # UI por feature (+ Common/ y Shared/)
├── config/modules.ts    # Catálogo de módulos del dashboard (fuente de verdad de rutas/roles)
├── constants/           # Tema, breakpoints, RolesDatabase
├── helpers/             # Lógica de dominio (ScheduleHelper, PatientsColor)
├── hooks/storeHooks.ts  # useAppDispatch / useAppDispatchThunk
├── interfaces/          # Tipos de dominio por área
├── layouts/             # MainLayout (Header + Toast)
├── lib/                 # Cliente HTTP (api.ts → apiFacade.ts)
├── pages/HomePage/      # Renderiza Dashboard
├── redux/
│   ├── actions/         # Thunks y action creators por slice
│   ├── reducers/        # Reducers + rootReducer (AppState)
│   └── store/store.ts   # configureStore + persist
├── router/              # Rutas y guards
├── services/            # Llamadas HTTP por dominio
├── types/types.ts       # constants (action types), Module, ThunkResult
└── utils/               # permissions.ts, downloadCsv.ts
```

Convención: cada feature suele tener `Feature.tsx` + `FeatureStyles.tsx` juntos. No hay design system aparte del theme.

---

## Variables de entorno

| Variable | Uso |
|---|---|
| `VITE_APP_BACK_ESE` | URL base del backend principal (con `/` final). Prefijo de la mayoría de services. |
| `VITE_APP_BACK_APPOINTMENTS` | URL base del backend de citas (con `/` final). Solo `services/appointments/`. |
| `VITE_APP_API_KEY` | Header `api` en axios (`lib/apiFacade.ts`). **No está definida** en `.env` / `.env.production` actuales → se envía `undefined`. |

- Dev (`.env`): `VITE_APP_BACK_ESE=http://127.0.0.1:8000/`, `VITE_APP_BACK_APPOINTMENTS=http://127.0.0.1:8001/`
- Prod (`.env.production`): `VITE_APP_BACK_ESE=http://192.168.46.102:8000/`, `VITE_APP_BACK_APPOINTMENTS=http://192.168.46.102:8001/` (Docker copia `.env.production` como `.env` en build)

---

## Autenticación y sesión

### Flujo de login

1. `Login.tsx` → `dispatch(loginUser({ correo, password }))`
2. `userActions.loginUser` → `AuthService.login` → `POST {BACK}auth/login`
3. Si `status === 200` → `setUserInfo(response.data)` → persiste en `localStorage` (slice `user`)
4. `WebSiteAppRouter` considera autenticado si `!!userData?.access_token`
5. Redirect a `/dashboard`

### Qué se guarda

`IUserInfo` (`interfaces/user.ts`):

```ts
{ access_token, token_type, user, roles }
```

Solo el slice `user` está en el whitelist de `redux-persist`.

### Logout

`logoutUser()` despacha el action **y** ejecuta `persistor.purge()` (limpia todo el store persistido). Header llama logout y navega a `/`.

### Cambio / reset de contraseña

- Perfil: `FetchChangePassword` → tras éxito **fuerza logout**.
- Login: modal de reset vía `ConfirmDialog` → `FetchResetPassword`.

### Auth HTTP — importante

El `access_token` **no se adjunta** como `Authorization: Bearer` en las peticiones. El interceptor solo pone el header estático `api: VITE_APP_API_KEY`. No “corrijas” esto sin confirmar cómo autentica el backend.

### Endpoints auth

| Método | Path | Nota |
|---|---|---|
| POST | `auth/login` | |
| POST | `auth/auth/register` | Prefijo `auth/auth` duplicado (así está en la API) |
| POST | `auth/change-password` | |
| POST | `auth/auth/reset-password` | Prefijo `auth/auth` duplicado |

---

## Rutas y guards

Definidas en `WebSiteAppRouter.tsx`:

| Ruta | Guard | Componente |
|---|---|---|
| `/` | Público | `Login` |
| `/dashboard` | `ProtectedRoute` (token) | `HomePage` → `Dashboard` |
| `/dashboard/profile` | Solo auth (sin guard de módulo) | `Profile` |
| `/dashboard/{módulo}` | Auth + `RequireModuleAccess` | Según `MODULES` |
| `*` | — | Redirect a `/dashboard` o `/` |

### Guards

- **`ProtectedRoute`**: si no hay token → `/`.
- **`RequireModuleAccess`**: busca el módulo por path; si el rol no está en `allowedRoles` → `/dashboard`. Si la ruta **no** coincide con ningún módulo, **deja pasar**.

### Catálogo de módulos (`src/config/modules.ts`)

Esta es la **fuente de verdad** de paths, roles y componentes del menú.

| id | Nombre | Path | Roles | Componente |
|---|---|---|---|---|
| 1 | Visualización Turnos | `/dashboard/vizualizacion-turnos` | 1,2,3,4,5,6,7,10,11,12 | `ScheduleViewer` |
| 2 | Editar Turnos y Novedades | `/dashboard/gestion-turnos` | 1,6,11 | `ScheduleViewer` con `editable={true}` |
| 3 | Generar Reporte | `/dashboard/reportes` | 1,6,7,10,11,13 | `Reports` |
| 4 | Registrar Demanda Insatisfecha | `/dashboard/demanda-insatisfecha` | `[]` (nadie) | Placeholder |
| 5 | Configuración de Usuarios | `/dashboard/configuracion-usuarios` | 6,11 | `UsersConfig` |
| 6 | Administración | `/dashboard/administracion` | 6,11,13 | `Administration` |
| 7 | Citas | `/dashboard/citas` | 11 | `Appointments` |

Helpers de permisos: `utils/permissions.ts` → `filterModulesByRole`, `hasPermission`, `getModuleByPath`.

**Typo intencional en producción:** `vizualizacion-turnos` (sin la primera `s`). No lo renombres sin migración de enlaces.

---

## Roles (IDs hardcodeados)

Fuente: `constants/schedule.constants.ts`.

```ts
RolesDatabase = {
  COORDINADOR: 1,
  PERSONAL_SALUD: 2,
  DILIGENCIADOR: 3,
  COORDINADOR_SIAU: 4,
  SIAU: 5,
  ADMINISTRADOR: 6,
  GERENCIA: 7,
  SUBGERENCIA_ADMINISTRATIVA: 8,
  SEGURIDAD_PACIENTE: 9,
  LIDER_PROYECTOS: 10,
  INGENIERO: 11,
  TALENTO_HUMANO: 12,
  COSTOS: 13,
}
```

También existe `Roles` (solo `COORDINADOR` y `PERSONAL_SALUD`) usado **únicamente** para forzar municipio en `ScheduleViewer`. Para permisos generales usa siempre `RolesDatabase`.

Los permisos del frontend dependen de estos IDs numéricos. Un cambio en el seed del backend rompe la UI silenciosamente.

---

## Redux

### Store (`redux/store/store.ts`)

- Persist: whitelist `['user']`, storage = `localStorage`.
- Al refrescar se pierden `schedule`, `administration`, `reports`, `usersConfig` (se vuelven a pedir).

### Slices (`AppState`)

| Slice | Estado | Persistido | Responsabilidad |
|---|---|---|---|
| `user` | `{ userData }` | Sí | Sesión |
| `helpers` | `{ loading, openToast, messageToast, variantToast }` | No | Loading global + toasts |
| `schedule` | `{ options, monthData, attentionTypes, siauTypes }` | No | Cuadro de turnos |
| `reports` | `{ reportTypes, subReportTypes }` | No | Catálogo de reportes (descargas no van al store) |
| `administration` | `{ roles, attentionTypes, personalTypes, municipios, users }` | No | CRUD de config |
| `usersConfig` | `{ specialPermitApprovers }` | No | Permisos especiales |

### Patrón de thunks

1. `dispatch(setLoading(true))`
2. Llamar service
3. Éxito → actualizar slice (si aplica) + toast success
4. Error → toast error
5. `finally` → `setLoading(false)`

Action types: strings en `types/types.ts` → objeto `constants` (formato `"[SLICE] descripción"`).

Algunos thunks **retornan datos sin guardar en el store** (el componente los usa en estado local): p. ej. `fetchTotalPatientsByMonth`, `fetchUnmetDemand`, `fetchSpecialPermitOptions`, descargas de PDF.

### Helpers UI globales

Casi todos los thunks usan el slice `helpers` para loading/toast. El componente `Toast` lee ese slice y se auto-cierra a los 6s.

---

## Capa HTTP

```
services/*  →  lib/api.ts  →  lib/apiFacade.ts (axios instance)
```

`apiFacade.ts`:

- Timeout 30s
- Header `api: VITE_APP_API_KEY`
- Cancela requests si el navegador está offline
- Trackea requests pendientes por `method-url` (no cancela duplicados, solo advierte)

No uses `fetch` directo; pasa siempre por `api` / services.

---

## Servicios y endpoints

Base: `${import.meta.env.VITE_APP_BACK_ESE}`

### Schedule — `services/schedule/scheduleService.ts`

| Función | Método | Path |
|---|---|---|
| `getOptions` | GET | `api/cuadros/opciones` |
| `getEditableOptions` | GET | `api/cuadros/opciones-editables` |
| `getSchedulesByMonth` | GET | `api/cuadros/cuadros-mes` |
| `getAttentionTypes` | GET | `api/cuadros/tipos-atencion` |
| `getEditScheduleDay` | POST | `api/cuadros/editar-dia` |
| `postEditScheduleDayInterval` | POST | `api/cuadros/editar-dia-intervalo` (`id_cuadro_dia` + `intervalos[]`) |
| `getTotalPatientsByMonth` | GET | `api/reportes/registro-pacientes` |
| `postAddPatients` | POST | `api/reportes/registro-pacientes` |
| `getSiauTypes` | GET | `api/reportes/tipos-siau` |
| `getUnmetDemand` | GET | `api/reportes/demanda-insatisfecha` |
| `postUnmetDemand` | POST | `api/reportes/demanda-insatisfecha` |
| `postCreateSupportStaff` | POST | `api/cuadros/agregar-personal` |
| `postChangeSupportStaff` | POST | `api/cuadros/cambiar-personal` |

### Reports — `services/reports/reports.service.ts`

- Catálogo: `api/reportes/tipo-reporte`, `api/reportes/subtipo-reporte`
- PDFs (`responseType: "blob"`): `reporte/registro-pacientes.pdf`, `reporte/mensual-detallado.pdf`, `reporte/comparativo-anual.pdf`, `reporte/costo-detallado.pdf`, `reporte/costo-comparativo-mensual.pdf`, `reporte/costo-comparativo-anual.pdf`

### Administration — `services/administration/administration.service.ts`

CRUD bajo `api/config/` (roles, tipos-atencion, tipos-personal-salud, municipios, usuarios-detalle) + `auth/usuarios/:id` + contratos `auth/contrato/*`.

### Users config — `services/users-config/users-config.service.ts`

`api/cuadros/permisos-especiales/*` (opciones-coordinadores, opciones-cuadros, POST crear).

### Appointments (Citas) — `services/appointments/appointments.service.ts`

| Función | Método | Path |
|---|---|---|
| `getAppointments` | GET | `{VITE_APP_BACK_APPOINTMENTS}api/citas/agenda` (query: `id_municipio` obligatorio + filtros + `page`/`per_page`) |
| `createAppointment` | POST | `{VITE_APP_BACK_APPOINTMENTS}api/agendar` |
| `cancelAppointment` | POST | `{VITE_APP_BACK_APPOINTMENTS}api/citas/{id}/cancelar` (`motivo`, `actor_tipo: WEB`) |
| `rescheduleAppointment` | POST | `{VITE_APP_BACK_APPOINTMENTS}api/citas/{id}/reprogramar` (`id_personal_salud`, `fecha`, `hora_inicio`, `motivo`, `actor_tipo: WEB`) |

UI: `components/Appointments/Appointments.tsx`. Solo rol INGENIERO (`allowedRoles: [11]`). Lista en estado local (no slice Redux). Paginador reutilizable: `components/Common/pagination/Pagination.tsx` (opciones 10 / 20 / 50; el frontend **no** sobrescribe `per_page` con el valor de la respuesta). En alta, `id_sede` se digita a mano hasta existir catálogo de sedes.

Columnas de la tabla: código, paciente, categoría, médico, tipo atención, fecha, inicio, fin, estado, origen (+ Acciones). No se muestran municipio, sede ni dirección de atención.

Acciones por fila (**Reprogramar** / **Cancelar**): solo si `estado === "PENDIENTE"`. En cualquier otro estado no se renderizan. Si **ninguna** fila de la página actual es accionable, la columna Acciones **no se muestra**. Usa `DataTable` con `layout="fill"`, `editLabel`, `deleteLabel`, `canEdit` y `canDelete`.

Toasts de éxito específicos (no reusar `alerts.deleteSuccess` / `alerts.updateSuccess`):
- Cancelar → `appointments.cancel.success` (“Cita cancelada correctamente”)
- Reprogramar → `appointments.reschedule.success` (“Cita reprogramada correctamente”)
- Crear → `alerts.createSuccess`

Filtro de estado: `PENDIENTE` | `CONFIRMADA` | `CANCELADA` | `ATENDIDA` (sin `NO_ASISTIO` en el filtro aunque pueda llegar en datos).

### Utils — `services/utils/utilsService.ts`

`GET api/cuadros/descargar` (PDF del cuadro).

---

## Módulos de feature (comportamiento)

### Dashboard (`components/Dashboard/Dashboard.tsx`)

- En `/dashboard`: grilla de módulos filtrados por rol.
- En rutas hijas: breadcrumb (`Inicio › {módulo}`) + `<Outlet />`. Clic en **Inicio** limpia `schedule.monthData` / `schedule.options` y vuelve al home.
- Al volver al home limpia `schedule.monthData` y `schedule.options` para no arrastrar datos entre módulos.

### ScheduleViewer (`components/ScheduleViewer/ScheduleViewer.tsx`)

Componente monolítico (~1360 líneas) que sirve **vista y edición**:

- Prop `editable?: boolean` — el módulo de edición lo monta con `editable={true}` vía alias en `modules.ts`. **No** uses `ScheduleManagement.tsx` (es placeholder vacío).
- Selectores: periodo / mes / año / tipo personal / municipio.
- Roles `COORDINADOR` / `PERSONAL_SALUD`: municipio forzado al del usuario.
- Flags de capacidad (calculados por rol):
  - `canManagePatients`: DILIGENCIADOR (3) o INGENIERO (11)
  - `canManageSiau`: COORDINADOR_SIAU (4), SIAU (5) o INGENIERO (11) — solo en modo viewer
  - Personal de apoyo: ADMINISTRADOR (6) o INGENIERO (11), solo en modo editable
  - Toggle y tabla SIAU: solo si el tipo de personal seleccionado es **Médico** (`PersonalTypesDatabase.MEDICO` = 1)
- Subcomponentes: `siau/SiauTypesTable.tsx`, `supportStaff/SupportStaff.tsx`
- Helpers: `helpers/ScheduleHelper.ts` (días, buckets normal/novedades, CSV, orden de periodos), `helpers/PatientsColor.ts` (semáforo de carga)

Edición de celdas → `editScheduleDay` con `IDataEditScheduleData`. Una sola novedad por día/persona; sigla obligatoria.

**Edición de turnos solo en meses futuros:** en **Editar Turnos y Novedades** la fila de siglas (turnos) solo es editable si el mes/año seleccionado es **posterior** al mes calendario actual (`canEditTurnos = editable && isFutureSelectedMonth`, comparando `anio*12 + mes`). El mes en curso y los anteriores muestran los turnos en solo lectura (texto del backend) y aparece `scheduleViewer.turnosReadOnlyHint`. Cuando llega el 1.° del mes que antes era futuro, ese mes deja de ser editable automáticamente. Para el mes en curso se usan las **novedades**. `handleAttentionChange` y `TOTAL HORAS` respetan `canEditTurnos`.

**Intervalo CE / CEC / CED (solo Editar Turnos + tipo personal Médico):** al elegir una de esas siglas en la celda normal (no novedad), se abre un modal de horario (`FormScheduleDayInterval`) **antes** de persistir. Se pueden agregar varios intervalos (“Agregar intervalo”) en formato **12 h AM/PM**. Horas **exactas** (`INTERVAL_REQUIRED_HOURS`): **CE/CED = 8 h**, **CEC = 16 h** (ni más ni menos). Cada intervalo: fin > inicio; el siguiente **no puede empezar antes** del fin del anterior (si el primero termina a las 11:00 AM, el siguiente empieza ≥ 11:00 AM). Si no cumple, Guardar queda deshabilitado. Flujo: `editScheduleDayWithInterval` → `POST editar-dia` → `id_cuadro_dia` → `POST editar-dia-intervalo` con `intervalos[]` (`HH:MM:SS.0000`, `activo: true`). Cancelar revierte la sigla. Helpers: `ScheduleIntervalHelper.ts`; constantes: `INTERVAL_REQUIRED_SIGLAS`, `requiresScheduleInterval`.

Descarga PDF del cuadro: solo en modo viewer → `fetchDownloadSchedule`.

#### Estado "sin datos"

`GET api/cuadros/cuadros-mes` responde **404** con `{"detail":"Cuadro no encontrado para esos filtros"}` cuando no existe cuadro para el mes/tipo/municipio elegidos. Eso **no es un error**: es un resultado vacío.

- `fetchScheduleByMonth` intercepta `error.response.status === 404`, despacha `scheduleClearMonth` y **no** dispara toast de error. Cualquier otro status sí muestra `alerts.genericError`.
- `ScheduleViewer` calcula `hasScheduleData` (`monthData.personal_de_salud.length > 0`). Si es `false` pinta `EmptyState` (`scheduleViewer.noDataTitle` / `noDataDescription` con `{{tipoPersonal}}` y `{{municipio}}`) en lugar de la tabla, y oculta descargar PDF, personal de apoyo, toggles y tabla SIAU.

Si agregas otro endpoint donde "vacío" llegue como 404, replica este patrón en lugar de mostrar toast rojo.

#### Filas de novedades

Cuando el toggle **Novedades** está activo se pintan dos filas por persona:

| Fila | Comportamiento |
|---|---|
| `TIPO DE ATENCION *` | Select de sigla. Obligatoria: sin sigla no se envía nada y la fila de horas queda deshabilitada. |
| `HORAS NOVEDADES` | Input **digitado a mano** (estado `noveltyHoursByCell`). **Admite negativos** para restar horas del total. No se calcula desde `horas` del tipo de atención. |

- Las horas se sanean con `sanitizeSignedInt` (solo dígitos y un `-` inicial) y se parsean con `parseSignedInt` (vacío → `0`).
- `submitNovelty` centraliza el envío a `editScheduleDay`: lo llaman el cambio de sigla y el blur de horas.
- **No existe fila de “Justificación Novedades”** en el cuadro. El campo `justificacion` sigue en el backend y se **reenvía tal cual** desde `submitNovelty` para no borrar lo guardado.
- En **Visualización Turnos**, solo COORDINADOR (1), ADMINISTRADOR (6) e INGENIERO (11) pueden editar novedades y únicamente para el mes calendario anterior al actual. Todos los días de ese mes son editables.
- En **Editar Turnos y Novedades**, el toggle de novedades solo aparece para el mes calendario actual. Se pueden editar los días desde el 1 hasta la fecha actual; los días posteriores se muestran en modo lectura. Para meses futuros el toggle no se renderiza y `showNovedades` se fuerza a `false`.
- `canEditNoveltyDay` centraliza esas reglas temporales y de rol. Los handlers también lo validan antes de modificar estado o llamar al backend.
- La fila `TOTAL HORAS` usa las horas digitadas cuando `canEditNoveltyDay(day)` es verdadero (por eso los negativos restan); en días de solo lectura usa las horas del backend.

#### Tabla SIAU (`siau/SiauTypesTable.tsx`)

Solo visible en modo viewer cuando `selectedTipo === PersonalTypesDatabase.MEDICO` (id `1`). Para cualquier otro tipo de personal el toggle y la tabla no se renderizan (y `showSiau` se fuerza a `false`).

Filas persistidas/editables = `siauTypes` del backend, **menos** los ids de `HIDDEN_SIAU_IDS` (hoy `1` = Solicitudes C.E. atendidas: se sigue guardando pero no se muestra ni se usa en cálculos).

Filas calculadas (`calculatedByDay`, ids en `SIAU_IDS`):

| Fila | Fórmula |
|---|---|
| N° TOTAL DE TURNOS | `crónicos × 1.33 + gestantes × 3 + medicina general + PEYDT × 2 + inasistentes × 1` (redondeado a 2 decimales) |
| N° TOTAL DE MÉDICO GENERAL ASIGNADOS A C.E | Conteo de siglas `CE` por día (`ceDoctorsByDay`, calculado en `ScheduleViewer`) |
| N° DE CITAS OFERTADAS | `médicos C.E. × 32` |
| TASA DE EFICIENCIA (%) | `(total turnos / citas ofertadas) × 100` — `0` si no hay citas ofertadas |
| INDICADOR DEMANDA INSATISFECHA (%) | `((total solicitudes − total turnos) / total solicitudes) × 100` — `0` si no hay solicitudes |

`total solicitudes` = tipo SIAU id `2`. No hay fila “N° AMBULATORIOS PROGRAMADOS” (se eliminó).

Si cambias una fórmula, actualiza esta tabla en el mismo commit.

### Reports (`components/Reports/Reports.tsx`)

Elige tipo/subtipo + filtros y enruta la descarga por **nombre en minúsculas** del tipo/subtipo hacia uno de los 6 thunks de blob. Si no hay match → toast `reports.noReportAvailable`.

### Administration (`components/Administration/Administration.tsx`)

Tabs: `roles` | `usuarios` | `tiposAtencion` | `tiposPersonal`.

- Rol COSTOS (13): solo tab usuarios, solo “Ver contrato” (sin CRUD).
- Patrón: `DataTable` + form dedicado + `ConfirmDialog`.
- Crear usuario: `registerUser` (de `userActions`) + opcionalmente `updateUserRol`.
- Contratos: `FormUserContracts.tsx` (visible para INGENIERO / COSTOS).

### UsersConfig (`components/UsersConfig/UsersConfig.tsx`)

Flujo en 2 pasos:

1. Elegir coordinador aprobador
2. Formulario: fecha `hasta`, checkbox `es_novedad`, cuadro → `createSpecialPermit`

Fecha se convierte a ISO a medianoche local antes de enviar.

### Profile

Datos de solo lectura + cambio de contraseña (checklist de validación en vivo). Éxito → logout forzado.

### Placeholders (no implementar sobre ellos sin pedido explícito)

- `ScheduleManagement.tsx` → `<div>ScheduleManagement</div>` (no está en `MODULES`)
- `UnsatisfiedDemand.tsx` → placeholder; módulo con `allowedRoles: []`
- `NotFoundComponent` → existe pero **no está enrutado**

---

## UI compartida

| Componente | Uso |
|---|---|
| `MainLayout` | Header (si hay user y no es login) + children + `Toast` global |
| `Header` | Logo → dashboard, dropdown Perfil / Salir |
| `Breadcrumb` | `components/Common/breadcrumb/`; en rutas hijas del dashboard (`Inicio › módulo`). Clic en Inicio limpia schedule y vuelve a `/dashboard` |
| `DataTable` | Tabla genérica tipada. Acciones: `onAdd` / `onEdit` / `onDelete` / `onViewContract`. Labels opcionales: `editLabel`, `deleteLabel`. Visibilidad por fila: `canEdit` / `canDelete` (si ninguna fila tiene acción, la columna Acciones se oculta). Layout: `fill` (default, ancho 100%) o `fit` (ancho al contenido) |
| `Pagination` | `components/Common/pagination/`; página + `perPage` + total |
| `ConfirmDialog` | Modal genérico; `description` acepta `ReactNode` (formularios embebidos) |
| `Toast` | Lee slice `helpers`; auto-cierre 6s |
| `LoadingSpinner` | Spinner sin props |
| `NormalButton` | Botón compartido |

Estilos: styled-components + theme (`constants/theme.tsx`). Props transient con prefijo `$` (`$active`, `$sticky`, etc.). Fuentes Poppins vía `@font-face` en `GlobalStyled.tsx`.

---

## i18n

- Solo idioma `es`, archivo único `language/es.json`.
- En componentes: `useTranslation()` → `t('seccion.clave')`.
- En thunks (fuera de React): `import { t } from "i18next"`.
- No hay selector de idioma ni namespaces.

Al agregar UI nueva, añade claves en `es.json` (no hardcodees strings de usuario).

Al **quitar** UI, borra también su clave en `es.json`: no dejes texto muerto. Verifica con `rg -n 'claveABorrar' src/` antes de cerrar el cambio.

---

## Tipos de dominio importantes

| Archivo | Contenido |
|---|---|
| `interfaces/user.ts` | `IUserInfo`, `IUser`, `IRoles`, contratos |
| `interfaces/schedule.ts` | Cuadro, días, novedades, pacientes, SIAU, personal apoyo |
| `interfaces/administration.ts` | Roles config, tipos, municipios, usuarios lista, contratos |
| `interfaces/reports.ts` | Tipos/subtipos y filtros de descarga |
| `interfaces/users-config.interface.ts` | Permisos especiales |
| `interfaces/appointments.ts` | Citas (lista, filtros, alta, cancelar, reprogramar) |
| `interfaces/signIn.ts` | Login, register, change/reset password |
| `types/types.ts` | `Module`, `constants`, `ThunkResult` |

---

## Despliegue

- `Dockerfile`: multi-stage Node 22 Alpine → build → `nginx:stable-alpine`. Copia `.env.production` como `.env` antes del build.
- `nginx.conf`: SPA `try_files`; cache largo en `/assets/`; proxy `/api/` comentado (no activo).
- `vite-plugin-remove-console` elimina `console.*` en build.

---

## Convenciones para agentes

### Hacer

- Seguir el flujo **UI → action/thunk → service → api**.
- Reusar `helpers` slice para loading/toasts.
- Reusar `DataTable` / `ConfirmDialog` / `Toast` en CRUDs.
- Registrar módulos nuevos en `config/modules.ts` + ruta vía `getModuleRoutes`.
- Usar `RolesDatabase` para checks de rol.
- Props de styled-components con prefijo `$`.
- Textos de UI vía `t(...)` y `es.json`.
- Escribir comentarios en texto plano, sin emojis ni decoraciones (`// ✅`, `// 🚫`, banners de `====`).
- Borrar la clave de `es.json` cuando se elimina la UI que la usaba.
- Commits con Conventional Commits (husky + commitlint).

### No hacer

- No adjuntar `Authorization` Bearer sin confirmar con backend.
- No “arreglar” paths `auth/auth/*` ni el typo `vizualizacion-turnos` sin pedido explícito.
- No usar `ScheduleManagement` para edición de turnos (usar `ScheduleViewer` + `editable`).
- No persistir slices distintos de `user` sin discusión.
- No inventar IDs de rol; usar `RolesDatabase`.
- No meter `fetch`/`axios` directo en componentes; pasar por services.
- No usar emojis en comentarios ni en nombres de variables. Los únicos glifos permitidos son los que el usuario ve en pantalla (p. ej. el `⚠` de contrato vencido en `FormUserContracts.tsx`).
- No dejar claves huérfanas en `es.json` tras eliminar UI.
- No derivar las horas de novedad desde el tipo de atención: las digita el usuario y pueden ser negativas.
- No crear archivos markdown extra salvo que te lo pidan.
- No commitear `.env` con secretos; no tocar git config.

### Dónde tocar qué

| Quiero… | Archivos típicos |
|---|---|
| Nueva pantalla del menú | `config/modules.ts`, componente en `components/`, permisos |
| Nueva llamada API | `services/<dominio>/`, action en `redux/actions/`, tipos en `interfaces/` |
| Cambiar permisos de un módulo | `config/modules.ts` → `allowedRoles` |
| Cambiar lógica de celdas del cuadro | `ScheduleViewer.tsx` + `ScheduleHelper.ts` + `scheduleActions.ts` |
| Cambiar fórmulas o filas de la tabla SIAU | `ScheduleViewer/siau/SiauTypesTable.tsx` (`SIAU_IDS`, `HIDDEN_SIAU_IDS`, `calculatedByDay`) + tabla de fórmulas en este archivo |
| Nuevo reporte PDF | `reports.service.ts` + `reportsActions.ts` + routing por nombre en `Reports.tsx` |
| Nuevo tab de administración | `Administration.tsx` + form en `forms/` + service/actions |
| Citas (agenda / cancelar / reprogramar) | `Appointments.tsx` + forms + `appointmentsActions.ts` + `appointments.service.ts` + `interfaces/appointments.ts` + `constants/appointments.constants.ts` |
| Estilos / colores | `constants/theme.tsx` + `*Styles.tsx` de la feature |
| Textos | `language/es.json` |

---

## Quirks conocidos (no “arreglar” de paso)

1. Token no va en headers; solo header `api` (y `VITE_APP_API_KEY` no está en los `.env`).
2. Path tipográfico `vizualizacion-turnos`.
3. `ScheduleManagement` y `UnsatisfiedDemand` son placeholders; el segundo tiene `allowedRoles: []`.
4. Dos catálogos de roles: `Roles` vs `RolesDatabase`.
5. `ScheduleViewer` es monolítico a propósito (vista + edición + pacientes + SIAU + apoyo).
6. `RequireModuleAccess` deja pasar rutas que no matchean un módulo.
7. `deleteUserRol` reutiliza `DELETE api/config/roles/{id}` (mismo path que borrar rol).
8. Lógica de descarga blob duplicada entre `reportsActions` y `utilsActions`.
9. Utilidades CSV duplicadas (`utils/downloadCsv.ts` vs `ScheduleHelper`).
10. Typo en i18n: `administration.users.confirm.deleteTitle` → “Eliminar usuarip”.
11. Toast puede solapar timeouts si se disparan en ráfaga (sin `clearTimeout`).
12. `getNoveltyJustifications` (en `ScheduleHelper`) ya no alimenta ninguna fila: solo se usa para reenviar la justificación guardada en `submitNovelty`.
13. El tipo SIAU id `1` (Solicitudes C.E. atendidas) se sigue enviando/guardando aunque esté oculto y fuera de los cálculos.
14. `SIAU_IDS.SOL_EXTRAMURALES` (id `3`) está declarado pero no se usa en ninguna fórmula.
15. En alta de citas, `id_sede` se ingresa a mano (no hay catálogo de sedes en el frontend todavía).
16. `DataTable` con `layout="fill"` estira al 100% (admin y citas). Con `layout="fit"` el ancho sigue al contenido; reservar para tablas muy anchas que deban scrollear sin estirar huecos.
17. Flujo CE/CEC/CED: si `editar-dia` ok pero `editar-dia-intervalo` falla, el turno ya pudo guardarse en backend; la UI revierte la sigla local.

---

## Scripts útiles

```bash
npm run dev       # Vite en :3000
npm run build     # Build de producción
npm run lint      # ESLint
npm run preview   # Preview del build
```

Hooks: `pre-commit` (lint-staged: eslint --fix + prettier), `commit-msg` (commitlint conventional), `pre-push`.

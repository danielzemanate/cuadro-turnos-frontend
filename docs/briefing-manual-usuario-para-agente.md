# BRIEFING PARA AGENTE — Manual de usuario completo

**Sistema:** Cuadro de Turnos — E.S.E. Suroccidente (frontend SPA)  
**Idioma del producto:** solo español  
**Propósito de este archivo:** fuente de verdad funcional para que un agente Pro genere un **manual de usuario completo**, claro, orientado a usuarios finales (médicos, coordinadores, SIAU, administración, gerencia, etc.), **sin jerga de código**.

---

## Instrucciones para el agente que redactará el manual

1. Genera un **Manual de Usuario** completo en español, tono formal/institucional, fácil de seguir.
2. Estructura sugerida:
   - Introducción / para qué sirve el sistema
   - Acceso (login, logout, perfil, reset/cambio de contraseña)
   - Dashboard y navegación
   - Matriz de roles y módulos (quién ve qué)
   - Un capítulo por módulo activo
   - Reglas especiales del cuadro de turnos (turnos, novedades, pacientes, SIAU, personal de apoyo)
   - Flujos paso a paso con capturas “descriptivas” (indica qué botón/pantalla)
   - Preguntas frecuentes / glosario
3. **No inventes** pantallas, botones ni permisos que no estén aquí.
4. Omite detalles técnicos (APIs, Redux, TypeScript). Si algo es limitación conocida, descríbela en lenguaje de usuario.
5. Marca como **módulo no disponible / placeholder** lo que tenga `allowedRoles: []`.
6. Cuando un comportamiento dependa del **rol** y del **mes calendario**, explícalo con ejemplos de fecha (“si hoy es 3 de octubre…”).
7. Puedes basarte también en `docs/formulas-siau-explicacion.md` para el anexo de fórmulas SIAU (ya existe un texto “para dummies”). El contenido completo está copiado en la **sección 18.6** de este briefing.
8. Usa la **sección 18** (detalles funcionales exactos) como fuente de verdad para validaciones, textos de UI, semáforo, catálogos SIAU/reportes, formularios y mensajes de error.

---

## 1. Qué es el sistema

Aplicación web institucional para la **E.S.E. Suroccidente** que permite:

- Ver y editar **cuadros de turnos** del personal de salud por municipio, mes y tipo de personal.
- Registrar **novedades** (ajustes de tipo de atención / horas) y **total de pacientes atendidos**.
- Consultar/editar indicadores **SIAU** (solo cuando el tipo de personal es Médico).
- Gestionar **personal de apoyo** en el cuadro.
- Descargar el cuadro en **PDF**.
- Generar **reportes PDF** (varios tipos).
- Administrar **catálogos** (roles, usuarios, tipos de atención, tipos de personal) y **contratos**.
- Otorgar **permisos especiales** de edición a coordinadores.
- Gestionar **citas** (agenda, crear, cancelar, reprogramar) contra un backend de citas aparte.

La UI es una sola página (SPA). Tras iniciar sesión se llega al **Dashboard** con tarjetas de módulos según el rol.

---

## 2. Acceso y cuenta

### 2.1 Login
- Pantalla pública de inicio.
- Campos: correo y contraseña.
- Si las credenciales son correctas → Dashboard.
- Opción de **restablecer contraseña** desde el login (modal de confirmación / correo).

### 2.2 Sesión
- La sesión se mantiene al refrescar el navegador (datos de usuario persistidos).
- **Salir** desde el menú del header limpia la sesión y vuelve al login.

### 2.3 Header (cuando hay sesión)
- Logo → vuelve al Dashboard.
- Saludo / menú: **Perfil**, **Salir**.

### 2.4 Perfil (`/dashboard/profile`)
- Datos de solo lectura: nombre, correo, celular, rol, activo, si es personal de salud.
- **Cambio de contraseña** con validaciones en vivo.
- Tras cambiar la contraseña con éxito → **cierre de sesión forzado** (debe volver a entrar).

### 2.5 Navegación común
- En módulos hijos: breadcrumb **Inicio › {módulo}**.
- Clic en **Inicio** vuelve al dashboard y limpia datos del cuadro cargado (para no mezclar filtros entre módulos).

---

## 3. Roles del sistema (IDs oficiales)

| ID | Nombre |
|---:|---|
| 1 | Coordinador |
| 2 | Personal Salud |
| 3 | Diligenciador |
| 4 | Coordinador SIAU |
| 5 | SIAU |
| 6 | Administrador |
| 7 | Gerencia |
| 8 | Subgerencia Administrativa *(sin módulo en menú actual)* |
| 9 | Seguridad Paciente *(sin módulo en menú actual)* |
| 10 | Líder de Proyectos |
| 11 | Ingeniero |
| 12 | Talento Humano |
| 13 | Costos |

> Los permisos de menú dependen de estos IDs. Un usuario tiene **un rol** principal visible en perfil.

---

## 4. Módulos del menú (fuente de verdad)

| Módulo | Ruta (referencia) | Roles que lo ven |
|---|---|---|
| Visualización Turnos | `/dashboard/vizualizacion-turnos` | 1, 2, 3, 4, 5, 6, 7, 10, 11, 12 |
| Editar Turnos y Novedades | `/dashboard/gestion-turnos` | 1, 6, 11 |
| Generar Reporte | `/dashboard/reportes` | 1, 6, 7, 10, 11, 13 |
| Registrar Demanda Insatisfecha | `/dashboard/demanda-insatisfecha` | **Nadie** (`allowedRoles: []`) — placeholder, no usar en el manual como funcional |
| Configuración de Usuarios | `/dashboard/configuracion-usuarios` | 6, 11 |
| Administración | `/dashboard/administracion` | 6, 11, 13 |
| Citas | `/dashboard/citas` | 4, 5, 11 |

### 4.1 Cobertura aproximada por rol (módulos activos)

| Rol | Visualización | Editar turnos | Reportes | Config. usuarios | Administración | Citas |
|---|---|---|---|---|---|---|
| Coordinador (1) | Sí | Sí | Sí | No | No | No |
| Personal Salud (2) | Sí | No | No | No | No | No |
| Diligenciador (3) | Sí | No | No | No | No | No |
| Coordinador SIAU (4) | Sí | No | No | No | No | Sí |
| SIAU (5) | Sí | No | No | No | No | Sí |
| Administrador (6) | Sí | Sí | Sí | Sí | Sí | No |
| Gerencia (7) | Sí | No | Sí | No | No | No |
| Líder Proyectos (10) | Sí | No | Sí | No | No | No |
| Ingeniero (11) | Sí | Sí | Sí | Sí | Sí | Sí |
| Talento Humano (12) | Sí | No | No | No | No | No |
| Costos (13) | No | No | Sí | No | Sí (limitado) | No |

**Ingeniero** = acceso más amplio. **Administrador** = casi todo salvo Citas.

---

## 5. Capacidades dentro del cuadro (no son módulos, son reglas internas)

Estas reglas aplican dentro de Visualización / Editar Turnos:

| Capacidad | Quién | Dónde |
|---|---|---|
| Forzar municipio al del usuario | Coordinador (1), Personal Salud (2) | Ambos módulos de cuadro |
| Editar turnos (siglas) | Quien entra a Editar Turnos | Solo **meses futuros** |
| Editar novedades (mes actual, días ≤ hoy) | Quien entra a Editar Turnos | Editar Turnos |
| Editar novedades del **mes anterior** (ventana de gracia) | Quien puede editar novedades; **no** Personal Salud | Visualización, solo días 1–5 del mes en curso |
| Ver toggle novedades / pacientes | Casi todos en Visualización; Personal Salud **ve pero no edita** | Visualización |
| Editar total pacientes | Coordinador (1), Diligenciador (3), Ingeniero (11) | Según reglas de mes (abajo) |
| Ver / editar tabla SIAU | Ver: no Personal Salud + tipo Médico; Editar: Coordinador SIAU, SIAU, Ingeniero | Solo Visualización + tipo Médico |
| Personal de apoyo | Administrador (6), Ingeniero (11) | Solo Editar Turnos |
| Descargar PDF del cuadro | Visualización (si hay datos) | Visualización |

Constante de gracia: **`PREVIOUS_MONTH_EDIT_GRACE_DAYS = 5`**.

---

## 6. Módulo: Visualización Turnos

### 6.1 Flujo básico
1. Entrar al módulo.
2. Seleccionar **periodo (mes/año)**, **tipo de personal de salud**, **municipio**.
3. Consultar / cargar cuadro.
4. Ver tabla de profesionales × días.

Si Coordinador o Personal Salud: el **municipio queda fijado** al del usuario (no elige otro).

### 6.2 Si no hay cuadro
- Mensaje de “sin datos” para ese mes / tipo / municipio (no es un error rojo genérico).
- No aparecen descarga PDF, toggles ni tabla SIAU.

### 6.3 Toggles
- **Novedades**: muestra filas adicionales por persona (tipo de atención de novedad + horas).
- **Total pacientes atendidos**: fila por persona con cantidad por día (semáforo de colores según carga).
- **Tipos de SIAU**: solo si el tipo de personal filtrado es **Médico** y el usuario **no** es Personal Salud.

### 6.4 Descarga
- Botón **Descargar** → PDF del cuadro (solo Visualización, con datos).

### 6.5 Personal Salud (rol 2) — reglas UX
- Ve checks de **Novedades** y **Total pacientes**, todo en **solo lectura**.
- **No** ve **Tipos de SIAU**.
- No puede editar celdas de novedades ni pacientes (ni siquiera en ventana de gracia).

### 6.6 Edición en Visualización (ventana de gracia)
- Solo aplica al **mes calendario anterior**.
- Solo si hoy es día **1 a 5** del mes actual.
- En esa ventana: **todos los días** del mes anterior son editables (para novedades; pacientes además requieren rol Coordinador/Diligenciador/Ingeniero).
- Desde el día 6 en adelante: mes anterior otra vez solo lectura.
- El **mes actual** en Visualización **no** se edita (eso va en Editar Turnos).

### 6.7 Personal de apoyo en la tabla
- El backend puede devolver `personal_de_apoyo`.
- Se muestran debajo del personal de salud, con etiqueta **(Apoyo)** en el nombre.
- Entran en totales / conteos CE igual que el resto cuando aplica.

---

## 7. Módulo: Editar Turnos y Novedades

Roles: Coordinador, Administrador, Ingeniero.

Misma pantalla base que Visualización, pero con `editable=true`.

### 7.1 Edición de turnos (fila de siglas)
- Solo si el mes seleccionado es **posterior** al mes calendario actual.
- Mes actual y anteriores: turnos en solo lectura + aviso de que para el mes en curso se usan **novedades**.
- Al llegar el 1.° del mes que antes era futuro, ese mes deja de ser editable automáticamente.

### 7.2 Modal de intervalo CE (solo Médico + sigla CE)
- Al elegir **CE** en celda normal (no novedad) → modal de horarios **antes** de guardar.
- **CEC** y **CED** se guardan sin modal.
- Formato 12 h AM/PM; se pueden agregar varios intervalos.
- Suma total debe ser exactamente **8 horas** para CE.
- Cada intervalo: fin > inicio; el siguiente no puede empezar antes del fin del anterior.
- Si no cumple, Guardar deshabilitado.
- Cancelar revierte la sigla en pantalla.

### 7.3 Novedades (en Editar Turnos)
- Toggle solo visible para el **mes calendario actual**.
- Días editables: del **1 hasta hoy**. Días futuros del mes: solo lectura.
- Meses futuros: no se muestra toggle de novedades.
- Filas:
  - **Tipo de atención** (sigla obligatoria).
  - **Horas novedades** digitadas a mano; **pueden ser negativas** (restan del total).
- No hay fila de justificación en pantalla (el sistema reenvía la justificación ya guardada para no borrarla).

### 7.4 Total pacientes (en Editar Turnos)
- Toggle solo en mes calendario actual.
- Edición: días ≤ hoy, y solo roles Coordinador / Diligenciador / Ingeniero.
- Persistencia al salir de la celda (blur).

### 7.5 Personal de apoyo (solo Admin / Ingeniero en este módulo)
Pestañas:
1. **Agregar personal asistencial**
   - ¿Es apoyo? Sí/No
   - Usuario (lista de disponibles del municipio/tipo, que aún no estén en el cuadro)
   - Un POST con `id_cuadro_mes` real del cuadro (no el número de mes calendario)
2. **Cambiar personal asistencial**
   - Usuario entrante, saliente, día de entrada, ¿es apoyo?

Botón atrás desde personal de apoyo → vuelve al **cuadro**, no al filtro inicial.

Al guardar con éxito se recarga el mes.

---

## 8. Matriz resumida: novedades y pacientes

| Escenario | Novedades | Total pacientes |
|---|---|---|
| Visualización, mes actual | Ver (solo lectura) | Ver; editar solo si rol permitido **y** (no aplica mes actual aquí) → **no edita mes actual** |
| Visualización, mes anterior, hoy ≤ día 5 | Editable (excepto Personal Salud) | Editable si Coordinador/Diligenciador/Ingeniero |
| Visualización, mes anterior, hoy ≥ día 6 | Solo lectura | Solo lectura |
| Editar Turnos, mes actual | Editable días ≤ hoy | Editable días ≤ hoy si rol permitido |
| Editar Turnos, mes futuro | Toggle oculto | Toggle oculto |
| Personal Salud en cualquier caso | Ver, no editar | Ver, no editar |

---

## 9. Tabla SIAU (Visualización + tipo Médico)

### 9.1 Quién
- **Ver toggle/tabla:** cualquier rol con Visualización excepto Personal Salud, y solo con filtro tipo **Médico**.
- **Editar celdas de entrada:** Coordinador SIAU, SIAU, Ingeniero.

### 9.2 Filas digitadas
Catálogo del backend (nombres pueden variar). Se oculta en UI el tipo id 1 “Solicitudes C.E. atendidas” (se guarda pero no se muestra ni entra a fórmulas).

Entradas típicas usadas en fórmulas: crónicos, gestantes, medicina general, PEYDT, inasistentes, total solicitudes C.E.

### 9.3 Filas calculadas (solo lectura)

1. **N° TOTAL DE TURNOS**  
   `crónicos×1.33 + gestantes×3 + medicina general×1 + PEYDT×2 + inasistentes×1` (2 decimales)

2. **N° TOTAL DE MÉDICO GENERAL ASIGNADOS A C.E**  
   Conteo de siglas **CE** en el cuadro ese día.

3. **N° DE CITAS OFERTADAS…**  
   `médicos CE × 32`

4. **TASA DE EFICIENCIA (%)**  
   `(total turnos / citas ofertadas) × 100` — si no hay citas ofertadas → 0

5. **INDICADOR DEMANDA INSATISFECHA (%)**  
   `((total solicitudes − total turnos) / total solicitudes) × 100` — si no hay solicitudes → 0

Anexo detallado “para dummies”: `docs/formulas-siau-explicacion.md`.

---

## 10. Módulo: Generar Reporte

Roles: Coordinador, Administrador, Gerencia, Líder Proyectos, Ingeniero, Costos.

Flujo:
1. Elegir tipo de reporte.
2. Elegir subtipo.
3. Completar filtros (según reporte: municipio, tipo personal, periodos, etc.).
4. Descargar PDF.

Si la combinación no tiene reporte implementado → mensaje de que no hay reporte disponible.

Tipos de descarga existentes (referencia interna, no hace falta listar paths al usuario): registro de pacientes, mensual detallado, comparativo anual, costo detallado, costo comparativo mensual, costo comparativo anual.

---

## 11. Módulo: Administración

Roles: Administrador, Ingeniero, Costos.

### Tabs
- **Roles** — CRUD de roles.
- **Usuarios** — CRUD de usuarios + asignación/cambio de rol + contratos.
- **Tipos de atención** — CRUD.
- **Tipos de personal de salud** — CRUD.

### Costos (13) — limitación
- Solo tab **Usuarios**.
- Solo **Ver contrato** (sin crear/editar/eliminar usuarios ni otros tabs).

### Crear / editar usuario (campos)
- Nombres, apellidos, correo, celular.
- Tipo de personal de salud.
- Municipio.
- Activo Sí/No.
- En creación: selección de **rol** (obligatorio).
- Regla de negocio: si el rol elegido es **Personal Salud**, el sistema marca `es_personal_salud = true`; con otros roles, `false`.
- En edición: bloque de roles (ver rol actual, eliminar, actualizar rol) y, para Ingeniero/Costos, gestión de contratos.

### Contratos de usuario
- Tipos: prestación de servicios / término indefinido.
- Campos: tipo, número, salario mensual, fecha inicio, fecha fin.
- Contrato **vencido**: aviso y no se puede modificar/eliminar.

Patrón UX: tablas con agregar/editar/eliminar + diálogos de confirmación + toasts de éxito/error.

---

## 12. Módulo: Configuración de Usuarios (permisos especiales)

Roles: Administrador, Ingeniero.

Flujo en 2 pasos:
1. Elegir **coordinador aprobador**.
2. Formulario: fecha **hasta**, checkbox **¿es novedad?**, selección de **cuadro** → crear permiso especial.

Sirve para autorizar edición especial sobre un cuadro hasta cierta fecha.

---

## 13. Módulo: Citas

Roles: Coordinador SIAU, SIAU, Ingeniero.

### 13.1 Listado / filtros
- Municipio **obligatorio** para consultar.
- Otros filtros (médico, estado, fechas, etc. según UI).
- Paginación: 10 / 20 / 50 por página.
- Columnas típicas: código, paciente, categoría, médico, tipo atención, fecha, inicio, fin, estado, origen (+ Acciones).
- No se muestran en tabla: municipio, sede, dirección de atención (aunque puedan existir en datos).

### 13.2 Estados de filtro
`PENDIENTE` | `CONFIRMADA` | `CANCELADA` | `ATENDIDA`  
(Puede existir `NO_ASISTIO` en datos, pero no está en el filtro de UI.)

### 13.3 Acciones por fila
- **Reprogramar** / **Cancelar**: solo si `estado === PENDIENTE`.
- Si ninguna fila de la página es accionable, la columna Acciones no se muestra.

### 13.4 Crear cita
- Municipio: el del filtro aplicado (solo lectura en el form). Para otra sede/municipio, cambiar el filtro de la lista primero.
- Médicos: búsqueda de usuarios tipo médico activos del municipio (no listado genérico).
- `id_sede` se digita a mano (aún no hay catálogo de sedes en frontend).

### 13.5 Cancelar
- Motivo + actor WEB.
- Toast: “Cita cancelada correctamente”.

### 13.6 Reprogramar
- Nuevo médico / fecha / hora inicio + motivo + actor WEB.
- Toast: “Cita reprogramada correctamente”.

---

## 14. Tipos de personal de salud (catálogo)

IDs de referencia del seed:

| ID | Nombre |
|---:|---|
| 1 | Médico |
| 2 | Odontólogo |
| 3 | Bacteriólogo |
| 4 | Jefe enfermería |
| 5 | Auxiliar enfermería |
| 6 | Psicología |
| 7 | Fonoaudiología |
| 8 | Fisioterapia |

SIAU solo aplica cuando el filtro es **Médico**.

---

## 15. Glosario (para el manual)

- **Cuadro de turnos:** grilla mes × profesionales × días con siglas de tipo de atención y horas.
- **Sigla / tipo de atención:** código corto del turno del día (ej. CE = consulta externa).
- **Novedad:** ajuste sobre el día (otra sigla y/o horas), independiente del turno base; horas pueden ser negativas.
- **Personal de apoyo:** persona adicional en el cuadro, marcada como apoyo.
- **Ventana de gracia:** primeros 5 días del mes actual para corregir el mes anterior desde Visualización.
- **SIAU:** indicadores de demanda/oferta de consulta externa derivados del cuadro y de datos digitados.
- **Permiso especial:** autorización temporal de edición asociada a un coordinador y un cuadro.

---

## 16. Limitaciones / mensajes que el manual debe anticipar

- El módulo **Registrar Demanda Insatisfecha** no está habilitado para ningún rol.
- Sin cuadro para los filtros → pantalla vacía informativa, no error.
- En Editar Turnos, el mes actual no deja cambiar la fila de turnos: hay que usar novedades.
- Modal CE exige exactamente 8 h en intervalos consecutivos válidos.
- Personal Salud no edita novedades/pacientes ni ve SIAU.
- Costos en Administración solo consulta contratos.
- Citas: sede se escribe a mano; municipio de alta viene del filtro.
- Tras cambiar contraseña en perfil, hay que volver a iniciar sesión.
- Idioma: solo español.

---

## 17. Entregable esperado del agente Pro

Producir un documento Markdown (o DOCX/PDF si el flujo lo permite) titulado por ejemplo:

**“Manual de Usuario — Sistema de Cuadro de Turnos E.S.E. Suroccidente”**

Incluyendo:
1. Portada e índice.
2. Capítulos por módulo.
3. Sección transversal “Reglas del cuadro de turnos”.
4. Matriz rol × módulo × acciones.
5. Flujos paso a paso para:
   - Login / perfil / logout
   - Consultar y descargar cuadro
   - Editar turnos futuros + CE con horario
   - Registrar novedades mes actual
   - Corregir mes anterior en días 1–5
   - Total pacientes
   - SIAU (digitación + lectura de indicadores)
   - Personal de apoyo (agregar / cambiar)
   - Reportes
   - Administración de usuarios/roles/contratos
   - Permisos especiales
   - Citas (filtrar, crear, cancelar, reprogramar)
6. Anexo: fórmulas SIAU (puede incorporar/adaptar `docs/formulas-siau-explicacion.md`).
7. FAQ.

**No** incluir instrucciones de desarrollo, despliegue Docker, ni variables de entorno.

---

## 18. Detalles funcionales exactos (complemento revisado en código)

Fuente: frontend actual + seed SQL del backend (`cuadro-turnos-back/migrations/002_Inicial.sql`). Textos entre comillas = literales de `es.json` o placeholders hardcodeados en UI.

---

### 18.1 Validación de contraseña (login, reset, perfil)

#### A) Login (`/` — formulario principal)

| Regla | Detalle |
|---|---|
| Correo | Debe cumplir regex `^[^\s@]+@[^\s@]+\.[^\s@]+$` |
| Contraseña | Solo “no vacía”; **no** hay reglas de complejidad en login |
| Botón Ingresar | Deshabilitado si el correo es inválido **o** la contraseña está vacía **o** hay loading |

| Situación | Mensaje exacto |
|---|---|
| Correo inválido (tras tocar el campo o al enviar) | `Ingresa un correo válido.` |
| Fallo de autenticación (toast) | `Credenciales no validas` |
| Placeholders | Correo: `Correo` · Contraseña: `Contraseña` · Botón: `Ingresar` |

#### B) Restablecer contraseña (modal desde login)

Validación del correo: **misma regex** que en login. No pide contraseña nueva en este paso (solo correo).

| Situación | Mensaje / texto |
|---|---|
| Correo inválido (inline) | `Ingresa un correo válido.` |
| Error de backend / fallo (inline o toast) | Mensaje del backend si viene en `detail`, si no: `Error al cargar los datos` |
| Éxito (toast) | `Solicitud éxitosa` |

*(Existe en i18n la clave `login.reset.success` = “Si existe una cuenta asociada, te enviaremos instrucciones a tu correo.”, pero el flujo actual muestra el toast `Solicitud éxitosa` y cierra el modal.)*

#### C) Cambio de contraseña en Perfil (`/dashboard/profile`)

Campos: contraseña actual, nueva, repetir nueva.

| Regla | Condición | Texto de checklist / error |
|---|---|---|
| Obligatorios | Los tres campos con contenido | `Todos los campos son obligatorios.` |
| Longitud mínima | Nueva ≥ 8 caracteres | `La nueva contraseña debe tener mínimo 8 caracteres.` |
| Mayúscula | Al menos un carácter que coincida con `[A-ZÁÉÍÓÚÑ]` | `Debe incluir al menos una letra mayúscula.` |
| Número | Al menos un dígito `\d` | `Debe incluir al menos un número.` |
| Coincidencia | Nueva = Repetir | `Las contraseñas no coinciden.` |
| Confirmación (modal) | Antes de enviar | Título de sección UI: `Cambiar contraseña` · Texto del diálogo: `¿Confirmas que deseas cambiar la contraseña con los datos ingresados?` · Botón guardar: `Aceptar` |
| Ayuda | Texto de recomendación | `Recomendación: no reutilices contraseñas y evita datos obvios.` |

| Resultado | Mensaje |
|---|---|
| Éxito | Toast `Actualización Correcta` y **cierre de sesión forzado** (hay que volver a ingresar) |
| Error | `detail` del backend si existe; si no, toast/`Error al cargar los datos` o inline `No se pudo actualizar la contraseña.` según el camino de error |

El botón de aceptar del formulario de perfil solo se habilita si **todas** las reglas anteriores se cumplen.

---

### 18.2 Modal “Restablecer contraseña” (estructura y textos exactos)

Se abre con el enlace bajo el login: **`Restablecer contraseña`**.

Usa el componente de diálogo de confirmación con este contenido:

| Elemento | Texto exacto |
|---|---|
| Título | `Restablecer contraseña` |
| Descripción | `Ingresa tu correo para enviarte información para restablecer tu contraseña` |
| Etiqueta del campo | `Correo` |
| Placeholder del input | `usuario@ejemplo.com` (hardcodeado) |
| Botón confirmar | `Enviar` |
| Botón cancelar | `Cancelar` |
| Error de formato | `Ingresa un correo válido.` |

---

### 18.3 Dashboard: tarjetas, orden y roles 8 / 9

Las tarjetas salen del catálogo de módulos **en este orden fijo**. Solo se muestran las cuyo rol del usuario está en `allowedRoles`.

| Orden | Nombre exacto de la tarjeta | Roles que la ven (IDs) |
|---:|---|---|
| 1 | Visualización Turnos | 1, 2, 3, 4, 5, 6, 7, 10, 11, 12 |
| 2 | Editar Turnos y Novedades | 1, 6, 11 |
| 3 | Generar Reporte | 1, 6, 7, 10, 11, 13 |
| 4 | Registrar Demanda Insatisfecha | *(ninguno — `allowedRoles: []`; nunca aparece)* |
| 5 | Configuración de Usuarios | 6, 11 |
| 6 | Administración | 6, 11, 13 |
| 7 | Citas | 4, 5, 11 |

**Roles 8 y 9** (Subgerencia Administrativa = 8, Seguridad Paciente = 9):

- Pueden iniciar sesión si tienen credenciales válidas.
- En el Dashboard **no ven ninguna tarjeta de módulo** (lista vacía).
- Siguen viendo el encabezado (logo, menú de perfil / salir) y pueden ir a **Perfil**.
- Cualquier ruta de módulo protegida los redirige de vuelta al Dashboard.

---

### 18.4 Semáforo — Total de pacientes atendidos

Cálculo base: jornada de **480 minutos** (8 h).  
`minutos por paciente (mpp) = 480 ÷ cantidad_pacientes`.

Si pacientes ≤ 0 o vacío → sin color (`none`).

| Color | Condición (mpp) | Significado operativo | Rango aproximado de pacientes/día (8 h) | Color UI |
|---|---|---|---|---|
| Rojo | mpp &lt; 12 | Carga muy alta (poco tiempo por paciente) | ≥ 41 | `#ef4444` |
| Amarillo | 12 ≤ mpp &lt; 13,3 | Carga alta / cerca del límite | 37–40 | `#f59e0b` |
| Verde | 13,3 ≤ mpp ≤ 17,1 | Carga adecuada | 29–36 | `#10b981` |
| Amarillo | 17,1 &lt; mpp ≤ 20 | Carga baja | 24–28 | `#f59e0b` |
| Rojo | mpp &gt; 20 | Carga muy baja (mucho tiempo por paciente) | 1–23 | `#ef4444` |
| Sin color | sin valor / 0 | Celda vacía o cero | 0 | sin borde de semáforo |

El color se aplica al borde/input de la celda editable de total pacientes.

---

### 18.5 Catálogo SIAU digitado (seed oficial)

Orden de inserción en BD = **id** 1…8. La API `GET api/reportes/tipos-siau` devuelve estos nombres (ordenados por nombre en respuesta, pero el id es estable).

| ID | Nombre exacto (seed) | ¿Se muestra en la tabla? | ¿Entra en fórmulas? |
|---:|---|---|---|
| 1 | N° DE SOLICITUDES DE C.E MEDICINA GENERAL ATENDIDA | **No** (oculta en UI; se sigue pudiendo guardar en backend) | No |
| 2 | N° TOTAL DE SOLICITUDES DE C.E MEDICINA GENERAL | Sí | Sí — demanda insatisfecha |
| 3 | N° DE SOLICITUDES DE C.E PROGRAMADA Y ATENDIDA EN EXTRAMURALES | Sí | No |
| 4 | N° TOTAL DE INASISTENTES PROGRAMADOS | Sí | Sí — total turnos × 1 |
| 5 | N° DE PACIENTES CRÓNICOS | Sí | Sí — total turnos × 1,33 |
| 6 | N° DE PACIENTES GESTANTES | Sí | Sí — total turnos × 3 |
| 7 | N° DE PACIENTES MEDICINA GENERAL | Sí | Sí — total turnos × 1 |
| 8 | N° DE PEYDT | Sí | Sí — total turnos × 2 |

**Filas calculadas (no digitables):** ver sección 18.6 / `docs/formulas-siau-explicacion.md`.

---

### 18.6 Contenido completo de `docs/formulas-siau-explicacion.md`

> Archivo restaurado también en disco. A continuación va **tal cual** (sin omitir secciones).

--- INICIO ARCHIVO formulas-siau-explicacion.md ---

# Indicadores SIAU del cuadro de turnos  
## Guía sencilla para personal médico

**Documento de apoyo** — explica qué se ve en la tabla SIAU de *Visualización de turnos*, de dónde salen los números y qué significa cada indicador.

---

## 1. ¿Para qué sirve esta tabla?

La tabla SIAU ayuda a responder, **día a día**, preguntas como:

- ¿Cuánta demanda de consulta externa estamos midiendo?
- ¿Cuántos médicos de consulta externa (C.E.) hay asignados ese día?
- ¿Cuántas citas se podrían ofertar con esos médicos?
- ¿Qué tan bien se están usando esas citas? (**eficiencia**)
- ¿Qué parte de la demanda no se está cubriendo? (**demanda insatisfecha**)

Todo se calcula **por cada día del mes** (columna 1, 2, 3… del cuadro).

> **Importante:** la tabla SIAU solo aparece cuando el filtro de tipo de personal es **Médico**, en el módulo de **Visualización de turnos**.

---

## 2. Dos tipos de filas

### A) Filas que se digitan (datos de entrada)

Son números que el personal autorizado **escribe o registra** en el sistema (por ejemplo roles SIAU / Coordinador SIAU / Ingeniero).  
Cada celda es: **un tipo de dato × un día**.

Catálogo oficial (`tipos_siau`, seed backend — orden de inserción = id):

| ID | Nombre exacto en BD | Visible en UI | Entra en fórmulas |
|---:|---|---|---|
| 1 | N° DE SOLICITUDES DE C.E MEDICINA GENERAL ATENDIDA | No (oculta) | No |
| 2 | N° TOTAL DE SOLICITUDES DE C.E MEDICINA GENERAL | Sí | Sí (demanda insatisfecha) |
| 3 | N° DE SOLICITUDES DE C.E PROGRAMADA Y ATENDIDA EN EXTRAMURALES | Sí | No |
| 4 | N° TOTAL DE INASISTENTES PROGRAMADOS | Sí | Sí (total turnos ×1) |
| 5 | N° DE PACIENTES CRÓNICOS | Sí | Sí (total turnos ×1,33) |
| 6 | N° DE PACIENTES GESTANTES | Sí | Sí (total turnos ×3) |
| 7 | N° DE PACIENTES MEDICINA GENERAL | Sí | Sí (total turnos ×1) |
| 8 | N° DE PEYDT | Sí | Sí (total turnos ×2) |

### B) Filas calculadas (las hace el sistema solo)

El sistema **no deja editarlas**. Se recalculan automáticamente cuando cambian los datos digitados o cuando cambia cuántos médicos tienen sigla **CE** ese día en el cuadro de turnos.

Las filas calculadas son:

1. **N° TOTAL DE TURNOS**
2. **N° TOTAL DE MÉDICO GENERAL ASIGNADOS A C.E**
3. **N° DE CITAS OFERTADAS SEGÚN MÉDICOS ASIGNADOS A C.E EN EL DÍA**
4. **TASA DE EFICIENCIA DE LA UTILIZACIÓN DE CITAS (%)**
5. **INDICADOR DEMANDA INSATISFECHA (%)**

---

## 3. Fórmulas (versión “para dummies”)

### 3.1 N° TOTAL DE TURNOS

```text
Total turnos =
  (Crónicos × 1,33)
+ (Gestantes × 3)
+ (Medicina general × 1)
+ (PEYDT × 2)
+ (Inasistentes × 1)
```

Redondeo a **2 decimales**.

### 3.2 N° TOTAL DE MÉDICO GENERAL ASIGNADOS A C.E

```text
Médicos C.E. del día = cantidad de celdas con sigla "CE" ese día
```

### 3.3 N° DE CITAS OFERTADAS…

```text
Citas ofertadas = Médicos C.E. × 32
```

### 3.4 TASA DE EFICIENCIA (%)

```text
Si Citas ofertadas > 0:
  Eficiencia (%) = (Total turnos ÷ Citas ofertadas) × 100
Si no:
  Eficiencia (%) = 0
```

### 3.5 INDICADOR DEMANDA INSATISFECHA (%)

```text
Si Total solicitudes (id 2) > 0:
  Demanda insatisfecha (%) =
    ((Total solicitudes − Total turnos) ÷ Total solicitudes) × 100
Si no:
  Demanda insatisfecha (%) = 0
```

---

## 4. Ejemplo completo de un día

| Entrada | Valor |
|---|---:|
| Crónicos | 10 |
| Gestantes | 2 |
| Medicina general | 20 |
| PEYDT | 4 |
| Inasistentes | 3 |
| Total solicitudes C.E. | 80 |
| Médicos con CE en el cuadro | 3 |

1. Total turnos = `10×1,33 + 2×3 + 20 + 4×2 + 3` = **50,30**  
2. Médicos C.E. = **3**  
3. Citas ofertadas = `3 × 32` = **96**  
4. Eficiencia = `(50,30 / 96) × 100` = **52,40%**  
5. Demanda insatisfecha = `((80 − 50,30) / 80) × 100` = **37,13%**

---

## 5. Constantes de negocio

| Constante | Valor |
|---|---:|
| Factor crónicos | 1,33 |
| Factor gestantes | 3 |
| Factor medicina general | 1 |
| Factor PEYDT | 2 |
| Factor inasistentes | 1 |
| Citas por médico CE / día | 32 |
| Redondeo | 2 decimales |

---

*Documento alineado con `SiauTypesTable.tsx` y seed `tipos_siau` del backend.*


--- FIN ARCHIVO formulas-siau-explicacion.md ---

### 18.7 Generar Reporte — tipos/subtipos y filtros

#### Catálogo seed (nombres exactos)

**Tipos** (`tipo_reporte`):

| ID | Nombre |
|---:|---|
| 1 | Mensual Detallado |
| 2 | Mensual Comparativo |
| 3 | Anual |

**Subtipos** (los mismos 7 nombres se repiten para cada tipo):

| Nombre del subtipo |
|---|
| Total de horas programadas y novedades |
| Pacientes atendidos y SIAU |
| Por tipo de atención |
| Por personal de salud |
| Oportunidad |
| Productividad |
| Costos |

#### Filtros que pide la pantalla (iguales para **cualquier** tipo+subtipo una vez elegidos)

Aparecen solo cuando ya hay tipo **y** subtipo seleccionados:

| Campo en pantalla | Etiqueta exacta | Origen de opciones |
|---|---|---|
| Año | `Año` | Periodos del catálogo de opciones del cuadro |
| Mes | `Mes` | Idem (nombres de mes vía i18n) |
| Municipio | `Municipio` | Lista de municipios de opciones |
| Tipo personal | `Tipo personal de salud` | Tipos de personal de salud de opciones |

Botón: `Descargar`.  
Si faltan filtros al descargar → toast: **`Por favor completa todos los filtros.`**  
(La clave i18n `alerts.missingFilters` no está en `es.json`; se usa ese `defaultValue`.)

#### Qué combinación descarga PDF real vs. mensaje “no disponible”

El enrutamiento usa el **nombre en minúsculas**:

| Condición subtipo | Condición tipo | Resultado |
|---|---|---|
| nombre = `costos` | `mensual detallado` | PDF costos detallado |
| nombre = `costos` | `mensual comparativo` | PDF costos comparativo mensual |
| nombre = `costos` | `anual` | PDF costos comparativo anual |
| nombre contiene `siau` **o** es exactamente `pacientes atendidos` | `mensual detallado` | PDF mensual detallado |
| idem | `mensual comparativo` | PDF registro pacientes |
| idem | `anual` | PDF comparativo anual |
| Cualquier otro subtipo (horas, oportunidad, productividad, etc.) | cualquiera | Toast de no disponible |

Con el seed actual, **“Pacientes atendidos y SIAU”** coincide por contener `siau`. **“Costos”** coincide exacto. El resto muestra:

> `Aún no hay reportes disponibles para descargar para este tipo y subtipo. Estamos trabajando en ello y próximamente estarán disponibles.`

---

### 18.8 Citas → Crear cita: campos, listas y errores

Título del formulario: **`Nueva cita`**.

| Campo (etiqueta UI) | Obligatorio | Tipo / valores | Origen de la lista / valor |
|---|---|---|---|
| Tipo de documento | Sí | CC, TI, CE, PA, RC | Constante fija del frontend (códigos literales) |
| Número de documento | Sí | texto | Digitado |
| Nombre completo | Sí | texto | Digitado |
| Teléfono de contacto | Sí | texto | Digitado |
| Categoría paciente | Sí (default GENERAL) | General / Gestante / Crónico | Constante `GENERAL`, `GESTANTE`, `CRONICO` + textos i18n (`appointments.filters.category` = `Categoría paciente`) |
| Municipio | Sí (no editable) | solo lectura | Del **filtro aplicado** de la agenda (no se elige otro al crear) |
| Médico | Sí | select | Búsqueda de usuarios médicos activos del municipio (`POST auth/usuarios/search`, tipo personal médico). Placeholder: `Seleccione…` |
| ID sede | Sí | número &gt; 0 | Digitado a mano (no hay catálogo de sedes) |
| Fecha | Sí | date | Digitado |
| Hora inicio | Sí | time | Digitado |
| Duración (min) | Sí (default 20) | número &gt; 0 | Digitado |
| Origen | Sí (default WEB) | Web / WhatsApp | Constante `WEB`, `WHATSAPP` + i18n |
| Observaciones | No | texto libre | Digitado |

Botones: `Cancelar` · `Crear`.

| Error de validación | Texto exacto |
|---|---|
| Cualquier obligatorio vacío / sede ≤ 0 / sin médico | `Campo requerido` |
| Duración no numérica o ≤ 0 | `Ingrese una duración válida mayor a 0` |
| Fallo al crear en servidor (toast) | `Error al cargar los datos` |
| Éxito al crear (toast) | `Creación Correcta` |

---

### 18.9 Mensajes de error (y éxito) en acciones principales

Salvo donde se indique otro, el **error genérico de toast** es siempre:

> `Error al cargar los datos`

| Acción | Éxito (toast) | Error (toast / inline) |
|---|---|---|
| Login fallido | — | `Credenciales no validas` |
| Restablecer contraseña | `Solicitud éxitosa` | `Error al cargar los datos` (+ inline de correo inválido) |
| Cambio contraseña (perfil) | `Actualización Correcta` (+ logout) | `detail` backend o `Error al cargar los datos` / `No se pudo actualizar la contraseña.` |
| Guardar turno (sigla / día) | `Actualización Correcta` | `Error al cargar los datos` |
| Guardar turno CE + intervalo | `Actualización Correcta` | `Error al cargar los datos`; si falta id de día: `No se recibió el identificador del día para guardar el intervalo.` |
| Validaciones del modal de intervalo (antes de enviar) | — | `Revisa los intervalos: deben sumar las horas exactas requeridas.` · `Para {{sigla}} la suma debe ser exactamente {{hours}} horas (ni más ni menos).` · `Cada intervalo debe empezar a la misma hora en que terminó el anterior o después; no se permite ir hacia atrás.` · `En cada intervalo la hora fin debe ser posterior a la hora inicio.` |
| Guardar novedad | `Actualización Correcta` | `Error al cargar los datos` |
| Guardar total pacientes / SIAU / personal apoyo | `Actualización Correcta` | `Error al cargar los datos` |
| Crear usuario (Administración) | `Creación Correcta` | Si el backend manda `detail`, se intenta traducir esa clave; si no: `Error al cargar los datos` |
| Editar usuario / rol / catálogos admin | `Actualización Correcta` | `Error al cargar los datos` |
| Eliminar (admin) | `Eliminación Correcta` | `Error al cargar los datos` |
| Crear cita | `Creación Correcta` | Validación form (arriba) o toast `Error al cargar los datos` |
| Cancelar cita | `Cita cancelada correctamente` | `Error al cargar los datos` |
| Reprogramar cita | `Cita reprogramada correctamente` | `Error al cargar los datos` |
| Descargar reporte / PDF cuadro | `Descarga éxitosa` | `Error al descargar los datos` (o `detail` del backend si el blob trae JSON de error) |
| Filtros incompletos en reportes | — | `Por favor completa todos los filtros.` |
| Subtipo de reporte sin PDF | — | mensaje largo de `reports.noReportAvailable` (ver 18.7) |

**Nota para el manual:** en muchas fallas de red/API el usuario verá el mismo texto genérico `Error al cargar los datos`, aunque la acción haya sido guardar, crear o cancelar. No inventar mensajes más específicos si no aparecen en la UI.

---

*Briefing generado desde el comportamiento real del frontend `cuadro-turnos-frontend` (configuración de módulos, roles y reglas de ScheduleViewer / Administración / Citas / SIAU), complementado con el seed SQL del backend para nombres oficiales de SIAU y reportes.*

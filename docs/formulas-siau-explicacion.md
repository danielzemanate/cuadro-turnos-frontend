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

import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Wrapper,
  Card,
  Title,
  Subtitle,
  ControlsRow,
  Select,
  Button,
  TableWrapper,
  TableTitle,
  TopActions,
  DownloadButton,
  CheckboxRow,
  Table,
  Th,
  Td,
  StaffCell,
  HoursRow,
  TotalRow,
} from "./ScheduleViewerStyles";
import { Download } from "lucide-react";

type ShiftCode = "CE" | ""; // amplía cuando se agregue más tipos

const year = 2025;

// Función para obtener la abreviación del día de la semana
const getDayAbbreviation = (day: number, month: number, year: number) => {
  const date = new Date(year, month, day);
  const dayOfWeek = date.getDay(); // 0 = Domingo, 1 = Lunes, etc.
  const abbreviations = ["D", "L", "M", "M", "J", "V", "S"]; // Dom, Lun, Mar, Mié, Jue, Vie, Sáb
  return abbreviations[dayOfWeek];
};

/** 🔹 Datos quemados (mock) */
const MOCK_SCHEDULE = {
  site: "BOLÍVAR",
  hoursPerShift: 8,
  staff: [
    {
      name: "PABLO SAMIR MAFLA MARTÍNEZ",
      shifts: {
        3: "CE",
        5: "CE",
        10: "CE",
        12: "CE",
        17: "CE",
        19: "CE",
        24: "CE",
        27: "CE",
      } as Record<number, ShiftCode>,
      // Datos de novedades - justificaciones
      noveltyJustifications: {
        5: "CE",
        12: "CE",
        19: "CE",
      } as Record<number, ShiftCode>,
      // Datos de novedades - horas
      noveltyHours: {
        5: 8,
        12: 8,
        19: 8,
      } as Record<number, number>,
    },
    {
      name: "NILSA ALEJANDRA CHACUA",
      shifts: {} as Record<number, ShiftCode>,
      noveltyJustifications: {
        8: "CE",
        15: "CE",
      } as Record<number, ShiftCode>,
      noveltyHours: {
        8: 8,
        15: 8,
      } as Record<number, number>,
    },
  ],
};

const daysInMonth = (y: number, mIndex: number) =>
  new Date(y, mIndex + 1, 0).getDate();

const toCSV = (data: {
  monthIndex: number;
  days: number[];
  staff: {
    name: string;
    shifts: Record<number, ShiftCode>;
    noveltyJustifications?: Record<number, ShiftCode>;
    noveltyHours?: Record<number, number>;
  }[];
  hoursPerShift: number;
  months: string[];
  filenameTmpl: string; // i18n template e.g. "turnos_{{month}}_{{year}}.csv"
  showNovedades: boolean;
}) => {
  const headers = [
    "Profesional",
    ...data.days.map((d) => `${d}`),
    "Total Horas",
  ];

  const rows: (string | number)[][] = [];

  data.staff.forEach((s) => {
    // Fila principal del profesional
    const values = data.days.map((d) => (s.shifts[d] ? s.shifts[d] : ""));
    const total = data.days.reduce(
      (acc, d) => acc + (s.shifts[d] ? data.hoursPerShift : 0),
      0,
    );
    rows.push([s.name, ...values, total]);

    // Fila de horas
    const hoursValues = data.days.map((d) =>
      s.shifts[d] ? data.hoursPerShift : 0,
    );
    rows.push(["Nº DE HORAS", ...hoursValues, total]);

    // Filas de novedades si están activadas
    if (data.showNovedades) {
      const noveltyJustValues = data.days.map(
        (d) => s.noveltyJustifications?.[d] || "",
      );
      rows.push(["JUSTIFICACIONES NOVEDADES", ...noveltyJustValues, ""]);

      const noveltyHoursValues = data.days.map((d) => s.noveltyHours?.[d] || 0);
      const noveltyHoursTotal = data.days.reduce(
        (acc, d) => acc + (s.noveltyHours?.[d] || 0),
        0,
      );
      rows.push(["HORAS NOVEDADES", ...noveltyHoursValues, noveltyHoursTotal]);
    }
  });

  const csv = [headers, ...rows]
    .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const monthName =
    data.months[data.monthIndex]?.toLowerCase?.() ?? `${data.monthIndex + 1}`;
  a.href = url;
  a.download = data.filenameTmpl
    .replace("{{month}}", monthName)
    .replace("{{year}}", String(year));
  a.click();
  URL.revokeObjectURL(url);
};

const ScheduleViewer: React.FC = () => {
  const { t } = useTranslation();
  const MONTHS = t("scheduleViewer.months", {
    returnObjects: true,
  }) as string[];
  const [monthIndex, setMonthIndex] = useState<number>(new Date().getMonth());
  const [showTable, setShowTable] = useState<boolean>(false);
  const [showNovedades, setShowNovedades] = useState<boolean>(false);

  const totalDays = useMemo(() => daysInMonth(year, monthIndex), [monthIndex]);
  const days = useMemo(
    () => Array.from({ length: totalDays }, (_, i) => i + 1),
    [totalDays],
  );

  const handleSelect = () => setShowTable(true);

  const handleDownload = () =>
    toCSV({
      monthIndex,
      days,
      staff: MOCK_SCHEDULE.staff,
      hoursPerShift: MOCK_SCHEDULE.hoursPerShift,
      months: MONTHS,
      filenameTmpl: t("scheduleViewer.csvFilename") as string,
      showNovedades,
    });

  if (!showTable) {
    return (
      <Wrapper>
        <Card>
          <Title>{t("scheduleViewer.title").toUpperCase()}</Title>
          <Subtitle>{t("scheduleViewer.subtitle")}</Subtitle>

          <ControlsRow>
            <Select
              aria-label={t("scheduleViewer.title").toUpperCase()}
              value={monthIndex}
              onChange={(e) => setMonthIndex(parseInt(e.target.value, 10))}
            >
              {MONTHS.map((m, idx) => (
                <option key={m} value={idx}>
                  {m}
                </option>
              ))}
            </Select>

            <Button onClick={handleSelect}>
              {t("scheduleViewer.select").toUpperCase()}
            </Button>
          </ControlsRow>
        </Card>
      </Wrapper>
    );
  }

  // Cálculos de horas por persona y totales
  // const perStaffHours = MOCK_SCHEDULE.staff.map((s) =>
  //   days.reduce(
  //     (acc, d) => acc + (s.shifts[d] ? MOCK_SCHEDULE.hoursPerShift : 0),
  //     0
  //   )
  // );
  // const totalHoursAll = perStaffHours.reduce((a, b) => a + b, 0); // disponible para mostrar un total global

  return (
    <Wrapper>
      <TableWrapper>
        <TopActions>
          <TableTitle style={{ textAlign: "center", width: "100%" }}>
            {t("scheduleViewer.tableHeader", {
              site: MOCK_SCHEDULE.site,
            }).toUpperCase()}
            <span>{MONTHS[monthIndex]}</span>
          </TableTitle>

          <DownloadButton onClick={handleDownload}>
            <Download size={18} />
            {t("scheduleViewer.download").toUpperCase()}
          </DownloadButton>
        </TopActions>

        <CheckboxRow>
          <label>
            <input
              type="checkbox"
              checked={showNovedades}
              onChange={(e) => setShowNovedades(e.target.checked)}
            />
            <span>{t("scheduleViewer.news")}</span>
          </label>
        </CheckboxRow>

        <Table>
          <thead>
            <tr>
              <Th style={{ minWidth: 220 }}>{year}</Th>
              {days.map((d) => (
                <Th key={`h-${d}`}>
                  <div>{d}</div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: "normal",
                      color: "#6b7280",
                    }}
                  >
                    {getDayAbbreviation(d, monthIndex, year)}
                  </div>
                </Th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* Fila con el nombre del mes (tipo separador) */}
            <tr>
              <StaffCell>{MONTHS[monthIndex]}</StaffCell>
              {days.map((d) => (
                <Td key={`m-${d}`} />
              ))}
            </tr>

            {/* Filas por profesional */}
            {MOCK_SCHEDULE.staff.map((s) => (
              <React.Fragment key={s.name}>
                <tr>
                  <StaffCell>{s.name}</StaffCell>
                  {days.map((d) => (
                    <Td key={`${s.name}-${d}`} $center>
                      {s.shifts[d] || ""}
                    </Td>
                  ))}
                </tr>

                {/* Fila Nº DE HORAS por profesional */}
                <HoursRow>
                  <StaffCell>
                    {t("scheduleViewer.rowHours").toUpperCase()}
                  </StaffCell>
                  {days.map((d) => (
                    <Td key={`h-${s.name}-${d}`} $center>
                      {s.shifts[d] ? MOCK_SCHEDULE.hoursPerShift : 0}
                    </Td>
                  ))}
                </HoursRow>

                {/* Filas de novedades (solo si está activado el checkbox) */}
                {showNovedades && (
                  <>
                    {/* Fila JUSTIFICACIONES NOVEDADES */}
                    <tr style={{ background: "#fff5f5" }}>
                      <StaffCell
                        style={{ background: "#fef2f2", color: "#dc2626" }}
                      >
                        {t(
                          "scheduleViewer.justificationsUpdates",
                        ).toUpperCase()}
                      </StaffCell>
                      {days.map((d) => (
                        <Td key={`jn-${s.name}-${d}`} $center>
                          {s.noveltyJustifications?.[d] || ""}
                        </Td>
                      ))}
                    </tr>

                    {/* Fila HORAS NOVEDADES */}
                    <HoursRow style={{ background: "#fff1f2" }}>
                      <StaffCell
                        style={{ background: "#fef2f2", color: "#dc2626" }}
                      >
                        {t("scheduleViewer.hoursUpdates").toUpperCase()}
                      </StaffCell>
                      {days.map((d) => (
                        <Td key={`hn-${s.name}-${d}`} $center>
                          {s.noveltyHours?.[d] || 0}
                        </Td>
                      ))}
                    </HoursRow>
                  </>
                )}
              </React.Fragment>
            ))}

            {/* Fila TOTAL HORAS (suma de todos) */}
            <TotalRow>
              <StaffCell>
                {t("scheduleViewer.rowTotalHours").toUpperCase()}
              </StaffCell>
              {days.map((d) => {
                const sum = MOCK_SCHEDULE.staff.reduce(
                  (acc, s) =>
                    acc + (s.shifts[d] ? MOCK_SCHEDULE.hoursPerShift : 0),
                  0,
                );
                return (
                  <Td key={`total-${d}`} $center>
                    {sum}
                  </Td>
                );
              })}
            </TotalRow>
          </tbody>
        </Table>
      </TableWrapper>
    </Wrapper>
  );
};

export default ScheduleViewer;

export type CSVRow = {
  doctorName: string;
  specialty: string;
  patientName: string;
  service: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
};

export function downloadCSV(filename: string, rows: CSVRow[]) {
  const header = [
    "Doctor",
    "Especialidad",
    "Paciente",
    "Servicio",
    "Fecha",
    "Hora",
  ];

  const escape = (val: string) => `"${String(val).replace(/"/g, '""')}"`;

  const csv = [
    header.join(","),
    ...rows.map((r) =>
      [
        escape(r.doctorName),
        escape(r.specialty),
        escape(r.patientName),
        escape(r.service),
        r.date,
        r.time,
      ].join(","),
    ),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

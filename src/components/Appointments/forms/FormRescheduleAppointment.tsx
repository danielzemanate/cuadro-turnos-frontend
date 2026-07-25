import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  IAppointment,
  IRescheduleAppointmentPayload,
} from "../../../interfaces/appointments";
import { IUserListItem } from "../../../interfaces/administration";
import {
  Actions,
  Card,
  ErrorText,
  Field,
  Ghost,
  Grid,
  Input,
  Label,
  Primary,
  Select,
  TextArea,
  Title,
} from "./FormAppointmentStyles";

type Props = {
  appointment: IAppointment;
  healthStaff: IUserListItem[];
  loading?: boolean;
  onSubmit: (_payload: IRescheduleAppointmentPayload) => void;
  onCancel: () => void;
};

const toTimeInput = (raw: string): string => {
  const value = String(raw ?? "").trim();
  if (!value) return "";
  if (value.includes("T")) {
    const time = value.split("T")[1] ?? "";
    return time.slice(0, 5);
  }
  return value.slice(0, 5);
};

const FormRescheduleAppointment: React.FC<Props> = ({
  appointment,
  healthStaff,
  loading = false,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();
  const [touched, setTouched] = useState(false);
  const [idPersonalSalud, setIdPersonalSalud] = useState<number | "">(
    appointment.id_personal_salud || "",
  );
  const [fecha, setFecha] = useState(appointment.fecha?.slice(0, 10) ?? "");
  const [horaInicio, setHoraInicio] = useState(
    toTimeInput(appointment.hora_inicio),
  );
  const [motivo, setMotivo] = useState("");

  const staffOptions = useMemo(() => {
    const byMunicipio = healthStaff.filter(
      (u) =>
        u.es_personal_salud &&
        Number(u.id_municipio) === Number(appointment.id_municipio),
    );
    return byMunicipio.length > 0 ? byMunicipio : healthStaff;
  }, [appointment.id_municipio, healthStaff]);

  const errors = {
    id_personal_salud: !idPersonalSalud,
    fecha: !fecha,
    hora_inicio: !horaInicio,
    motivo: !motivo.trim(),
  };
  const hasErrors = Object.values(errors).some(Boolean);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (hasErrors) return;

    const hora = horaInicio.length === 5 ? `${horaInicio}:00.000` : horaInicio;

    onSubmit({
      id_personal_salud: Number(idPersonalSalud),
      fecha,
      hora_inicio: hora,
      motivo: motivo.trim(),
      actor_tipo: "WEB",
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Card>
        <Title>{t("appointments.reschedule.title")}</Title>
        <p style={{ margin: "0 0 1rem", color: "#4b5563", fontSize: "0.9rem" }}>
          {t("appointments.reschedule.subtitle", {
            code: appointment.codigo_confirmacion,
            patient: appointment.paciente,
          })}
        </p>

        <Grid>
          <Field>
            <Label htmlFor="rs-staff">
              {t("appointments.filters.healthStaff")}
            </Label>
            <Select
              id="rs-staff"
              value={idPersonalSalud}
              onChange={(e) =>
                setIdPersonalSalud(e.target.value ? Number(e.target.value) : "")
              }
            >
              <option value="">{t("common.selectPlaceholder")}</option>
              {staffOptions.map((u) => (
                <option key={u.id} value={u.id}>
                  {`${u.nombre} ${u.apellidos}`.trim()}
                </option>
              ))}
            </Select>
            {touched && errors.id_personal_salud && (
              <ErrorText>{t("appointments.form.errors.required")}</ErrorText>
            )}
          </Field>

          <Field>
            <Label htmlFor="rs-date">{t("appointments.form.date")}</Label>
            <Input
              id="rs-date"
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
            {touched && errors.fecha && (
              <ErrorText>{t("appointments.form.errors.required")}</ErrorText>
            )}
          </Field>

          <Field>
            <Label htmlFor="rs-time">{t("appointments.form.startTime")}</Label>
            <Input
              id="rs-time"
              type="time"
              step={60}
              value={horaInicio}
              onChange={(e) => setHoraInicio(e.target.value)}
            />
            {touched && errors.hora_inicio && (
              <ErrorText>{t("appointments.form.errors.required")}</ErrorText>
            )}
          </Field>
        </Grid>

        <Field>
          <Label htmlFor="rs-motivo">{t("appointments.cancel.reason")}</Label>
          <TextArea
            id="rs-motivo"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder={t("appointments.cancel.reasonPlaceholder")}
          />
          {touched && errors.motivo && (
            <ErrorText>{t("appointments.form.errors.required")}</ErrorText>
          )}
        </Field>

        <Actions>
          <Ghost type="button" onClick={onCancel} disabled={loading}>
            {t("common.cancel")}
          </Ghost>
          <Primary type="submit" disabled={loading}>
            {t("appointments.reschedule.confirm")}
          </Primary>
        </Actions>
      </Card>
    </form>
  );
};

export default FormRescheduleAppointment;

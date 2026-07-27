import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  AppointmentCategory,
  AppointmentOrigin,
  ICreateAppointmentPayload,
} from "../../../interfaces/appointments";
import { IUserListItem } from "../../../interfaces/administration";
import {
  APPOINTMENT_CATEGORIES,
  APPOINTMENT_ORIGINS,
  DOCUMENT_TYPES,
} from "../../../constants/appointments.constants";
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
  idMunicipio: number;
  municipioNombre?: string;
  doctors: IUserListItem[];
  loading?: boolean;
  onSubmit: (_payload: ICreateAppointmentPayload) => void;
  onCancel: () => void;
};

type FormState = {
  tipo_documento: string;
  numero_documento: string;
  nombre_completo: string;
  telefono_contacto: string;
  categoria_paciente: AppointmentCategory | "";
  id_personal_salud: number | "";
  id_sede: number | "";
  fecha: string;
  hora_inicio: string;
  duracion_min: string;
  origen: AppointmentOrigin | "";
  observaciones: string;
};

const FormAppointment: React.FC<Props> = ({
  idMunicipio,
  municipioNombre,
  doctors,
  loading = false,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();
  const [touched, setTouched] = useState(false);
  const [form, setForm] = useState<FormState>({
    tipo_documento: "CC",
    numero_documento: "",
    nombre_completo: "",
    telefono_contacto: "",
    categoria_paciente: "GENERAL",
    id_personal_salud: "",
    id_sede: "",
    fecha: "",
    hora_inicio: "",
    duracion_min: "20",
    origen: "WEB",
    observaciones: "",
  });

  const errors = useMemo(() => {
    const duration = Number(form.duracion_min);
    return {
      tipo_documento: !form.tipo_documento,
      numero_documento: !form.numero_documento.trim(),
      nombre_completo: !form.nombre_completo.trim(),
      telefono_contacto: !form.telefono_contacto.trim(),
      categoria_paciente: !form.categoria_paciente,
      id_personal_salud: !form.id_personal_salud,
      id_sede: !form.id_sede || Number(form.id_sede) <= 0,
      fecha: !form.fecha,
      hora_inicio: !form.hora_inicio,
      duracion_min: !Number.isFinite(duration) || duration <= 0,
      origen: !form.origen,
    };
  }, [form]);

  const hasErrors = Object.values(errors).some(Boolean);

  const setField =
    <K extends keyof FormState>(key: K) =>
    (value: FormState[K]) =>
      setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (hasErrors) return;

    const timeRaw = form.hora_inicio;
    const hora_inicio = timeRaw.length === 5 ? `${timeRaw}:00.000` : timeRaw;

    onSubmit({
      tipo_documento: form.tipo_documento,
      numero_documento: form.numero_documento.trim(),
      nombre_completo: form.nombre_completo.trim(),
      telefono_contacto: form.telefono_contacto.trim(),
      categoria_paciente: form.categoria_paciente as AppointmentCategory,
      id_personal_salud: Number(form.id_personal_salud),
      id_municipio: idMunicipio,
      id_sede: Number(form.id_sede),
      fecha: form.fecha,
      hora_inicio,
      duracion_min: Number(form.duracion_min),
      origen: form.origen as AppointmentOrigin,
      observaciones: form.observaciones.trim(),
    });
  };

  const showError = (key: keyof typeof errors) => touched && errors[key];

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Card>
        <Title>{t("appointments.form.newTitle")}</Title>

        <Grid>
          <Field>
            <Label htmlFor="ap-doc-type">
              {t("appointments.form.documentType")}
            </Label>
            <Select
              id="ap-doc-type"
              value={form.tipo_documento}
              onChange={(e) => setField("tipo_documento")(e.target.value)}
            >
              {DOCUMENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
            {showError("tipo_documento") && (
              <ErrorText>{t("appointments.form.errors.required")}</ErrorText>
            )}
          </Field>

          <Field>
            <Label htmlFor="ap-doc-number">
              {t("appointments.form.documentNumber")}
            </Label>
            <Input
              id="ap-doc-number"
              value={form.numero_documento}
              onChange={(e) => setField("numero_documento")(e.target.value)}
            />
            {showError("numero_documento") && (
              <ErrorText>{t("appointments.form.errors.required")}</ErrorText>
            )}
          </Field>

          <Field>
            <Label htmlFor="ap-name">{t("appointments.form.fullName")}</Label>
            <Input
              id="ap-name"
              value={form.nombre_completo}
              onChange={(e) => setField("nombre_completo")(e.target.value)}
            />
            {showError("nombre_completo") && (
              <ErrorText>{t("appointments.form.errors.required")}</ErrorText>
            )}
          </Field>

          <Field>
            <Label htmlFor="ap-phone">{t("appointments.form.phone")}</Label>
            <Input
              id="ap-phone"
              value={form.telefono_contacto}
              onChange={(e) => setField("telefono_contacto")(e.target.value)}
            />
            {showError("telefono_contacto") && (
              <ErrorText>{t("appointments.form.errors.required")}</ErrorText>
            )}
          </Field>

          <Field>
            <Label htmlFor="ap-category">
              {t("appointments.filters.category")}
            </Label>
            <Select
              id="ap-category"
              value={form.categoria_paciente}
              onChange={(e) =>
                setField("categoria_paciente")(
                  e.target.value as AppointmentCategory | "",
                )
              }
            >
              {APPOINTMENT_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {t(`appointments.categories.${category}`)}
                </option>
              ))}
            </Select>
          </Field>

          <Field>
            <Label htmlFor="ap-municipio">
              {t("appointments.filters.municipality")}
            </Label>
            <Input
              id="ap-municipio"
              value={municipioNombre ?? String(idMunicipio)}
              readOnly
              disabled
            />
          </Field>

          <Field>
            <Label htmlFor="ap-staff">{t("appointments.form.doctor")}</Label>
            <Select
              id="ap-staff"
              value={form.id_personal_salud}
              onChange={(e) =>
                setField("id_personal_salud")(
                  e.target.value ? Number(e.target.value) : "",
                )
              }
            >
              <option value="">{t("common.selectPlaceholder")}</option>
              {doctors.map((u) => (
                <option key={u.id} value={u.id}>
                  {`${u.nombre} ${u.apellidos}`.trim()}
                </option>
              ))}
            </Select>
            {showError("id_personal_salud") && (
              <ErrorText>{t("appointments.form.errors.required")}</ErrorText>
            )}
          </Field>

          <Field>
            <Label htmlFor="ap-sede">{t("appointments.form.siteId")}</Label>
            <Input
              id="ap-sede"
              type="number"
              min={1}
              value={form.id_sede}
              onChange={(e) =>
                setField("id_sede")(
                  e.target.value ? Number(e.target.value) : "",
                )
              }
            />
            {showError("id_sede") && (
              <ErrorText>{t("appointments.form.errors.required")}</ErrorText>
            )}
          </Field>

          <Field>
            <Label htmlFor="ap-date">{t("appointments.form.date")}</Label>
            <Input
              id="ap-date"
              type="date"
              value={form.fecha}
              onChange={(e) => setField("fecha")(e.target.value)}
            />
            {showError("fecha") && (
              <ErrorText>{t("appointments.form.errors.required")}</ErrorText>
            )}
          </Field>

          <Field>
            <Label htmlFor="ap-time">{t("appointments.form.startTime")}</Label>
            <Input
              id="ap-time"
              type="time"
              step={60}
              value={form.hora_inicio}
              onChange={(e) => setField("hora_inicio")(e.target.value)}
            />
            {showError("hora_inicio") && (
              <ErrorText>{t("appointments.form.errors.required")}</ErrorText>
            )}
          </Field>

          <Field>
            <Label htmlFor="ap-duration">
              {t("appointments.form.duration")}
            </Label>
            <Input
              id="ap-duration"
              type="number"
              min={1}
              value={form.duracion_min}
              onChange={(e) => setField("duracion_min")(e.target.value)}
            />
            {showError("duracion_min") && (
              <ErrorText>
                {t("appointments.form.errors.invalidDuration")}
              </ErrorText>
            )}
          </Field>

          <Field>
            <Label htmlFor="ap-origin">
              {t("appointments.filters.origin")}
            </Label>
            <Select
              id="ap-origin"
              value={form.origen}
              onChange={(e) =>
                setField("origen")(e.target.value as AppointmentOrigin | "")
              }
            >
              {APPOINTMENT_ORIGINS.map((origin) => (
                <option key={origin} value={origin}>
                  {t(`appointments.origins.${origin}`)}
                </option>
              ))}
            </Select>
          </Field>
        </Grid>

        <Field>
          <Label htmlFor="ap-notes">{t("appointments.form.notes")}</Label>
          <TextArea
            id="ap-notes"
            value={form.observaciones}
            onChange={(e) => setField("observaciones")(e.target.value)}
          />
        </Field>

        <Actions>
          <Ghost type="button" onClick={onCancel} disabled={loading}>
            {t("common.cancel")}
          </Ghost>
          <Primary type="submit" disabled={loading}>
            {t("common.create")}
          </Primary>
        </Actions>
      </Card>
    </form>
  );
};

export default FormAppointment;

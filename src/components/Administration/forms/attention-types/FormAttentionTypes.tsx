import React from "react";
import {
  IConfigAttentionTypes,
  IPersonalType,
} from "../../../../interfaces/administration";
import {
  Card,
  Title,
  Field,
  Label,
  Input,
  Actions,
  Primary,
  Ghost,
  Grid,
  Select,
} from "./FormAttentionTypesStyles";
import { useTranslation } from "react-i18next";

type Props = {
  onSubmit: (_payload: Partial<IConfigAttentionTypes>) => void;
  onCancel: () => void;
  defaultValue?: Partial<IConfigAttentionTypes>;
  personalTypes: IPersonalType[];
};

const FormAttentionTypes: React.FC<Props> = ({
  onSubmit,
  onCancel,
  defaultValue,
  personalTypes,
}) => {
  const { t } = useTranslation();

  const [nombre, setNombre] = React.useState(defaultValue?.nombre ?? "");
  const [sigla, setSigla] = React.useState(defaultValue?.sigla ?? "");
  const [horas, setHoras] = React.useState(
    defaultValue?.horas !== undefined ? String(defaultValue.horas) : "",
  );
  const [personalId, setPersonalId] = React.useState<string>(
    defaultValue?.id_tipo_personal_salud !== undefined
      ? String(defaultValue.id_tipo_personal_salud)
      : "",
  );

  const isEditing = Boolean(defaultValue?.id);

  const disabled =
    !nombre.trim() || !sigla.trim() || !String(horas).trim() || !personalId;

  const handleSubmit = () => {
    if (disabled) return;
    const horasNumber = Number(horas);
    onSubmit({
      nombre,
      sigla,
      horas: Number.isNaN(horasNumber) ? 0 : horasNumber,
      id_tipo_personal_salud: Number(personalId),
    });
  };

  return (
    <Card>
      <Title>
        {isEditing
          ? t("administration.attentionTypes.form.editTitle")
          : t("administration.attentionTypes.form.newTitle")}
      </Title>

      <Grid>
        <Field>
          <Label htmlFor="at-nombre">
            {t("administration.attentionTypes.form.nameLabel")}
          </Label>
          <Input
            id="at-nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder={t(
              "administration.attentionTypes.form.placeholderName",
            )}
          />
        </Field>

        <Field>
          <Label htmlFor="at-sigla">
            {t("administration.attentionTypes.form.abbrLabel")}
          </Label>
          <Input
            id="at-sigla"
            value={sigla}
            onChange={(e) => setSigla(e.target.value.toUpperCase())}
            placeholder={t(
              "administration.attentionTypes.form.placeholderAbbr",
            )}
            maxLength={10}
          />
        </Field>

        <Field>
          <Label htmlFor="at-horas">
            {t("administration.attentionTypes.form.hoursLabel")}
          </Label>
          <Input
            id="at-horas"
            type="number"
            min={0}
            step={1}
            value={horas}
            onChange={(e) => setHoras(e.target.value)}
            placeholder={t(
              "administration.attentionTypes.form.placeholderHours",
            )}
          />
        </Field>

        <Field>
          <Label htmlFor="at-personal">
            {t("administration.attentionTypes.form.personalLabel")}
          </Label>
          <Select
            id="at-personal"
            value={personalId}
            onChange={(e) => setPersonalId(e.target.value)}
          >
            <option value="">
              {t("administration.attentionTypes.form.placeholderSelect")}
            </option>
            {personalTypes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </Select>
        </Field>
      </Grid>

      <Actions>
        <Ghost onClick={onCancel}>{t("common.cancel")}</Ghost>
        <Primary onClick={handleSubmit} disabled={disabled}>
          {isEditing ? t("common.update") : t("common.create")}
        </Primary>
      </Actions>
    </Card>
  );
};

export default FormAttentionTypes;

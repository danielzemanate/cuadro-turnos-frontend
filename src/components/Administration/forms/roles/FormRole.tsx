import React from "react";
import {
  Card,
  Title,
  Field,
  Label,
  Input,
  Actions,
  Primary,
  Ghost,
} from "./FormRoleStyles";
import { IRoles } from "../../../../interfaces/user";
import { useTranslation } from "react-i18next";

type Props = {
  onSubmit: (_payload: Partial<IRoles>) => void;
  onCancel: () => void;
  defaultValue?: Partial<IRoles>;
};

const FormRole: React.FC<Props> = ({ onSubmit, onCancel, defaultValue }) => {
  const { t } = useTranslation();

  const [nombre, setNombre] = React.useState(defaultValue?.nombre ?? "");
  const isEditing = Boolean(defaultValue?.id);
  const disabled = !nombre.trim();

  const handleSubmit = () => {
    if (disabled) return;
    onSubmit({ nombre });
  };

  return (
    <Card>
      <Title>
        {isEditing
          ? t("administration.roles.form.editTitle")
          : t("administration.roles.form.newTitle")}
      </Title>

      <Field>
        <Label htmlFor="rol-nombre">
          {t("administration.roles.form.nameLabel")}
        </Label>
        <Input
          id="rol-nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder={t("administration.roles.form.placeholderName")}
        />
      </Field>

      <Actions>
        <Ghost onClick={onCancel}>{t("common.cancel")}</Ghost>
        <Primary onClick={handleSubmit} disabled={disabled}>
          {isEditing ? t("common.update") : t("common.create")}
        </Primary>
      </Actions>
    </Card>
  );
};

export default FormRole;

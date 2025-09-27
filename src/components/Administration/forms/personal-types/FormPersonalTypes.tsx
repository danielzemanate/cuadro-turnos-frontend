import React from "react";
import { IPersonalType } from "../../../../interfaces/administration";
import {
  Card,
  Title,
  Field,
  Label,
  Input,
  Actions,
  Primary,
  Ghost,
} from "./FormPersonalTypesStyles";
import { useTranslation } from "react-i18next";

type Props = {
  onSubmit: (_payload: Partial<IPersonalType>) => void;
  onCancel: () => void;
  defaultValue?: Partial<IPersonalType>;
};

const FormPersonalTypes: React.FC<Props> = ({
  onSubmit,
  onCancel,
  defaultValue,
}) => {
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
          ? t("administration.personalTypes.form.editTitle")
          : t("administration.personalTypes.form.newTitle")}
      </Title>

      <Field>
        <Label htmlFor="pt-nombre">
          {t("administration.personalTypes.form.nameLabel")}
        </Label>
        <Input
          id="pt-nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder={t("administration.personalTypes.form.placeholderName")}
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

export default FormPersonalTypes;

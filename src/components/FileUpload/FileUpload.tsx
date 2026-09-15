import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import {
  FILE_UPLOAD_ACCEPT,
  FILE_UPLOAD_KINDS,
} from "../../constants/fileUpload.constants";
import { useAppDispatchThunk } from "../../hooks/storeHooks";
import { FileUploadKind, ICargaValidacion } from "../../interfaces/fileUpload";
import {
  confirmActivePatientsFile,
  validateActivePatientsFile,
} from "../../redux/actions/fileUploadActions";
import { AppState } from "../../redux/reducers/rootReducer";
import {
  Actions,
  Button,
  Card,
  Field,
  FileInput,
  FileName,
  FileRow,
  KindCard,
  KindGrid,
  KindHint,
  KindName,
  Label,
  Page,
  Subtitle,
  Summary,
  SummaryList,
  SummaryRow,
  SummaryTitle,
  Title,
  Wrap,
} from "./FileUploadStyles";

const FileUpload: React.FC = () => {
  const { t } = useTranslation();
  const dispatchThunk = useAppDispatchThunk();
  const loading = useSelector((state: AppState) => state.helpers.loading);
  const [kind, setKind] = useState<FileUploadKind>("ASMET");
  const [file, setFile] = useState<File | null>(null);
  const [validation, setValidation] = useState<ICargaValidacion | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canValidate = Boolean(file) && !loading;
  const canLoad =
    Boolean(
      validation?.valido &&
        validation.errores_bloqueantes === 0 &&
        validation.carga_id &&
        validation.token_confirmacion,
    ) && !loading;

  const resetFileState = () => {
    setValidation(null);
  };

  const handleKindChange = (next: FileUploadKind) => {
    setKind(next);
    resetFileState();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = event.target.files?.[0] ?? null;
    setFile(next);
    resetFileState();
  };

  const handleValidate = async () => {
    if (!file || loading) return;
    const result = await dispatchThunk(validateActivePatientsFile(kind, file));
    setValidation(result);
  };

  const handleLoad = async () => {
    if (!validation || loading) return;
    const result = await dispatchThunk(
      confirmActivePatientsFile(
        validation.carga_id,
        validation.token_confirmacion,
      ),
    );
    if (result) {
      setFile(null);
      setValidation(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <Page>
      <Wrap>
        <Card>
          <Title>{t("fileUpload.title")}</Title>
          <Subtitle>{t("fileUpload.subtitle")}</Subtitle>

          <KindGrid>
            {FILE_UPLOAD_KINDS.map((item) => (
              <KindCard
                key={item}
                type="button"
                $active={kind === item}
                onClick={() => handleKindChange(item)}
                disabled={loading}
              >
                <KindName>{t(`fileUpload.kinds.${item}.name`)}</KindName>
                <KindHint>{t(`fileUpload.kinds.${item}.hint`)}</KindHint>
              </KindCard>
            ))}
          </KindGrid>

          <Field>
            <Label htmlFor="file-upload-input">{t("fileUpload.file")}</Label>
            <FileRow>
              <FileInput
                id="file-upload-input"
                ref={fileInputRef}
                type="file"
                accept={FILE_UPLOAD_ACCEPT}
                onChange={handleFileChange}
                disabled={loading}
              />
              {file && <FileName>{file.name}</FileName>}
            </FileRow>
          </Field>

          {validation && (
            <Summary>
              <SummaryTitle>{t("fileUpload.summary.title")}</SummaryTitle>
              <SummaryRow>
                {t("fileUpload.summary.status")}: {validation.estado}
              </SummaryRow>
              <SummaryRow>
                {t("fileUpload.summary.origin")}: {validation.origen}
              </SummaryRow>
              <SummaryRow>
                {t("fileUpload.summary.rowsRead")}: {validation.filas_leidas}
              </SummaryRow>
              <SummaryRow>
                {t("fileUpload.summary.rowsValid")}:{" "}
                {validation.filas_activas_validas}
              </SummaryRow>
              <SummaryRow>
                {t("fileUpload.summary.rowsInvalid")}:{" "}
                {validation.filas_invalidas}
              </SummaryRow>
              <SummaryRow>
                {t("fileUpload.summary.blockingErrors")}:{" "}
                {validation.errores_bloqueantes}
              </SummaryRow>
              <SummaryRow>
                {t("fileUpload.summary.toReplace")}:{" "}
                {validation.registros_actuales_a_reemplazar}
              </SummaryRow>
              {validation.advertencias.length > 0 && (
                <>
                  <SummaryRow>{t("fileUpload.summary.warnings")}</SummaryRow>
                  <SummaryList>
                    {validation.advertencias.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </SummaryList>
                </>
              )}
              {validation.errores.length > 0 && (
                <>
                  <SummaryRow>{t("fileUpload.summary.errors")}</SummaryRow>
                  <SummaryList>
                    {validation.errores.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </SummaryList>
                </>
              )}
            </Summary>
          )}

          <Actions>
            <Button
              type="button"
              $variant="secondary"
              onClick={handleValidate}
              disabled={!canValidate}
            >
              {t("fileUpload.validate")}
            </Button>
            <Button type="button" onClick={handleLoad} disabled={!canLoad}>
              {t("fileUpload.load")}
            </Button>
          </Actions>
        </Card>
      </Wrap>
    </Page>
  );
};

export default FileUpload;

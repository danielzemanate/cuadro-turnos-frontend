import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { ArrowLeft } from "lucide-react";

import {
  Wrapper,
  Card,
  Title,
  Subtitle,
  ControlsRow,
  Select,
  Button,
  FormCard,
  FormHeader,
  BackIconBtn,
  HeaderTitle,
  FormGrid,
  FormField,
  Label,
  Input,
  CheckboxContainer,
  CheckboxRow,
  ActionsRow,
} from "./UsersConfigStyles";

import { AppState } from "../../redux/reducers/rootReducer";
import { useAppDispatchThunk } from "../../hooks/storeHooks";
import {
  fetchSpecialPermitApprovers,
  fetchSpecialPermitOptions,
  createSpecialPermit,
} from "../../redux/actions/usersConfigActions";
import { SpecialPermitApprover } from "../../interfaces/users-config.interface";

type CuadroOption = {
  id: number;
  anio: number;
  mes: number;
  tipo_personal_salud: string;
  municipio: string;
  label: string;
};

const UsersConfig: React.FC = () => {
  const { t } = useTranslation();
  const dispatchThunk = useAppDispatchThunk();

  const { loading } = useSelector((s: AppState) => s.helpers);
  const approvers = useSelector(
    (s: AppState) => s.usersConfig.specialPermitApprovers,
  );
  const { userData } = useSelector((s: AppState) => s.user);

  const [selectedCoordinator, setSelectedCoordinator] =
    useState<SpecialPermitApprover | null>(null);
  const [hideSelector, setHideSelector] = useState(false);

  // Form state
  const [hastaLocalDate, setHastaLocalDate] = useState<string>(""); // YYYY-MM-DD
  const [esNovedad, setEsNovedad] = useState<boolean>(false);
  const [cuadros, setCuadros] = useState<CuadroOption[]>([]);
  const [selectedCuadroId, setSelectedCuadroId] = useState<number | null>(null);

  const selectedId = useMemo(
    () => (selectedCoordinator?.id ? String(selectedCoordinator.id) : ""),
    [selectedCoordinator],
  );

  /** Convierte 'YYYY-MM-DD' a ISO con hora 00:00 (medianoche local) */
  const dateAtLocalMidnightToISO = (yyyyMmDd: string) => {
    if (!yyyyMmDd) return "";
    const [y, m, d] = yyyyMmDd.split("-").map(Number);
    const dt = new Date(y, m - 1, d, 0, 0, 0, 0); // medianoche local
    return dt.toISOString();
  };

  useEffect(() => {
    if (!approvers) dispatchThunk(fetchSpecialPermitApprovers());
  }, [dispatchThunk, approvers]);

  const handleConfirm = async () => {
    setHideSelector(true);

    if (selectedCoordinator?.id) {
      const result = await dispatchThunk(
        fetchSpecialPermitOptions({
          id_coordinador: selectedCoordinator.id,
        }),
      );
      if (result && !(result instanceof Error)) {
        const data = result;
        setCuadros(data.cuadros ?? []);
      } else {
        setCuadros([]);
      }
    }
  };

  const handleCoordinatorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value);
    const found = (approvers ?? []).find((x) => x.id === id) || null;
    setSelectedCoordinator(found);
  };

  const handleBackToSelect = () => {
    setHideSelector(false);
    setSelectedCoordinator(null);
    setHastaLocalDate("");
    setEsNovedad(false);
    setCuadros([]);
    setSelectedCuadroId(null);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      id_usuario: selectedCoordinator?.id ?? 0,
      hasta: dateAtLocalMidnightToISO(hastaLocalDate), // <-- 00:00
      es_novedad: esNovedad,
      id_cuadro_mes: selectedCuadroId ?? 0,
      creado_por: userData?.user?.id ?? 0,
    };

    console.log("payload permiso especial =>", payload);
    await dispatchThunk(createSpecialPermit(payload));
  };

  return (
    <Wrapper>
      {!hideSelector ? (
        <Card $slim>
          <Title $small $upper>
            {t("usersConfig.selectCoordinator.title")}
          </Title>
          <Subtitle $small>
            {t("usersConfig.selectCoordinator.subtitle")}
          </Subtitle>

          <ControlsRow>
            <Select
              value={selectedId}
              onChange={handleCoordinatorChange}
              disabled={loading || (approvers?.length ?? 0) === 0}
              aria-label={t("usersConfig.selectCoordinator.aria")}
            >
              <option value="" disabled>
                {loading ? t("common.loading") : t("common.selectPlaceholder")}
              </option>
              {(approvers ?? []).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre_completo}
                  {c.municipio ? ` — ${c.municipio}` : ""}
                </option>
              ))}
            </Select>

            <Button
              onClick={handleConfirm}
              disabled={!selectedCoordinator || loading}
            >
              {t("common.select")}
            </Button>
          </ControlsRow>
        </Card>
      ) : (
        <FormCard>
          <FormHeader>
            <BackIconBtn
              onClick={handleBackToSelect}
              aria-label={t("common.back")}
            >
              <ArrowLeft size={18} />
            </BackIconBtn>
            <HeaderTitle>{t("usersConfig.permitForm.title")}</HeaderTitle>
            <div />
          </FormHeader>

          <Subtitle $small $left>
            {t("usersConfig.permitForm.subtitle")}
          </Subtitle>

          <form onSubmit={handleSubmitForm}>
            <FormGrid>
              <FormField>
                <Label htmlFor="hasta">
                  {t("usersConfig.permitForm.until")}
                </Label>
                <Input
                  id="hasta"
                  type="date"
                  value={hastaLocalDate}
                  onChange={(e) => setHastaLocalDate(e.target.value)}
                  required
                />
              </FormField>

              <FormField>
                <Label htmlFor="cuadro">
                  {t("usersConfig.permitForm.sheet")}
                </Label>
                <Select
                  id="cuadro"
                  value={selectedCuadroId ?? ""}
                  onChange={(e) => setSelectedCuadroId(Number(e.target.value))}
                  required
                >
                  <option value="" disabled>
                    {t("common.selectPlaceholder")}
                  </option>
                  {cuadros.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </Select>
              </FormField>

              <CheckboxContainer>
                <Label>{t("usersConfig.permitForm.changeType")}</Label>
                <CheckboxRow>
                  <input
                    id="novedad"
                    type="checkbox"
                    checked={esNovedad}
                    onChange={(e) => setEsNovedad(e.target.checked)}
                  />
                  <label htmlFor="novedad">
                    {t("usersConfig.permitForm.novedadLabel")}
                  </label>
                </CheckboxRow>
              </CheckboxContainer>
            </FormGrid>

            <ActionsRow>
              <Button
                type="submit"
                disabled={loading || !selectedCuadroId || !hastaLocalDate}
              >
                {t("common.send")}
              </Button>
            </ActionsRow>
          </form>
        </FormCard>
      )}
    </Wrapper>
  );
};

export default UsersConfig;

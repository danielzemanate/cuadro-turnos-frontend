import { FileUploadKind } from "../interfaces/fileUpload";

/** Solo validación de derechos por ahora. RFAST se oculta hasta que backend lo habilite. */
export const FILE_UPLOAD_KINDS: readonly FileUploadKind[] = [
  "ASMET",
  "NUEVA_EPS",
] as const;

export const FILE_UPLOAD_ACCEPT = ".csv";

export const FILE_UPLOAD_VALIDATE_TIMEOUT_MS = 180_000;

const BACK_ESE = import.meta.env.VITE_APP_BACK_ESE;

export const FILE_UPLOAD_VALIDATE_URL = `${BACK_ESE}api/pacientes-activos/cargas/validar`;

export const fileUploadConfirmUrl = (cargaId: string) =>
  `${BACK_ESE}api/pacientes-activos/cargas/${cargaId}/confirmar`;

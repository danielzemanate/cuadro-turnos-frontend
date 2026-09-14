export type FileUploadKind = "ASMET" | "NUEVA_EPS";

export interface ICargaValidacion {
  carga_id: string;
  estado: string;
  origen: FileUploadKind | string;
  ambito_carga: string;
  sha256: string;
  expira_en: string;
  aplicada_en: string | null;
  filas_leidas: number;
  filas_activas_validas: number;
  filas_excluidas_por_estado: number;
  filas_invalidas: number;
  errores_bloqueantes: number;
  errores: string[];
  advertencias: string[];
  esquema_version: string;
  valido: boolean;
  primera_carga: boolean;
  registros_actuales_a_reemplazar: number;
  token_confirmacion: string;
}

export interface ICargaConfirmacion extends ICargaValidacion {
  registros_eliminados: number;
  registros_insertados: number;
}

export interface IConfirmarCargaPayload {
  token_confirmacion: string;
  confirmar_reemplazo: boolean;
}

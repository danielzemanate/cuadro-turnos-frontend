import {
  FILE_UPLOAD_VALIDATE_TIMEOUT_MS,
  FILE_UPLOAD_VALIDATE_URL,
  fileUploadConfirmUrl,
} from "../../constants/fileUpload.constants";
import {
  FileUploadKind,
  IConfirmarCargaPayload,
} from "../../interfaces/fileUpload";
import api from "../../lib/api";

const bearerHeaders = (accessToken: string) => ({
  Authorization: `Bearer ${accessToken}`,
});

const FileUploadService = {
  validateCarga: async (
    origen: FileUploadKind,
    file: File,
    accessToken: string,
  ) => {
    const formData = new FormData();
    formData.append("origen", origen);
    formData.append("archivo", file);

    return await api.post(FILE_UPLOAD_VALIDATE_URL, formData, {
      timeout: FILE_UPLOAD_VALIDATE_TIMEOUT_MS,
      headers: bearerHeaders(accessToken),
    });
  },

  confirmCarga: async (
    cargaId: string,
    data: IConfirmarCargaPayload,
    accessToken: string,
  ) => {
    return await api.post(fileUploadConfirmUrl(cargaId), data, {
      timeout: FILE_UPLOAD_VALIDATE_TIMEOUT_MS,
      headers: bearerHeaders(accessToken),
    });
  },
};

export default FileUploadService;

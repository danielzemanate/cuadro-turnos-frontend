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

const FileUploadService = {
  validateCarga: async (origen: FileUploadKind, file: File) => {
    const formData = new FormData();
    formData.append("origen", origen);
    formData.append("archivo", file);

    return await api.post(FILE_UPLOAD_VALIDATE_URL, formData, {
      timeout: FILE_UPLOAD_VALIDATE_TIMEOUT_MS,
    });
  },

  confirmCarga: async (cargaId: string, data: IConfirmarCargaPayload) => {
    return await api.post(fileUploadConfirmUrl(cargaId), data, {
      timeout: FILE_UPLOAD_VALIDATE_TIMEOUT_MS,
    });
  },
};

export default FileUploadService;

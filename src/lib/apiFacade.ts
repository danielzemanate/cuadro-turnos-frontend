import axios, { AxiosStatic, InternalAxiosRequestConfig } from "axios";

const { CancelToken, isCancel, Cancel } = axios as AxiosStatic;
type CancelFunction = (_message?: string) => void;
let isOnline = navigator.onLine;
const pendingRequests = new Map<string, CancelFunction>();

const instance = axios.create({
  timeout: 30000,
  headers: {
    "Content-type": "application/json",
    api: import.meta.env.VITE_APP_API_KEY,
  },
});

// Interceptor de solicitud
instance.interceptors.request.use(
  function (config: InternalAxiosRequestConfig) {
    if (!isOnline) {
      return Promise.reject(new Cancel("No internet connection"));
    }

    // Generar un identificador único para la solicitud
    const requestKey = `${config.method}-${config.url}`;

    if (pendingRequests.has(requestKey)) {
      console.warn(`Duplicate request detected: ${requestKey}, not canceling.`);
    } else {
      config.cancelToken = new CancelToken((cancel) => {
        pendingRequests.set(requestKey, cancel);
      });
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

// Interceptor de respuesta
instance.interceptors.response.use(
  function (response) {
    // Eliminar la solicitud de la lista cuando se complete correctamente
    const requestKey = `${response.config.method}-${response.config.url}`;
    pendingRequests.delete(requestKey);
    return response;
  },
  function (error) {
    if (isCancel(error)) {
      console.error("Request canceled:", error.message);
    }
    return Promise.reject(error);
  },
);

// Manejo de eventos de red
const handleOffline = () => {
  isOnline = false;
  console.warn("Offline: Canceling all pending requests");
  pendingRequests.forEach((cancel) => cancel?.("No internet connection"));
  pendingRequests.clear();
};

const handleOnline = () => {
  isOnline = true;
  console.log("Back online");
};

window.addEventListener("offline", handleOffline);
window.addEventListener("online", handleOnline);

export default instance;

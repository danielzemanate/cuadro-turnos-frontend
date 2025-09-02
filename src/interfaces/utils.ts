export interface IDownloadSchedule {
  anio: number;
  mes: number;
  id_tipo_personal_salud: number;
  id_municipio: number;
  formato?: string; //Default value : pdf
}

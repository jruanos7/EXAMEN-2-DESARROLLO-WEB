export type VacancyStatus = "abierta" | "cerrada";

export interface Vacancy {
  id: number;
  puesto: string;
  departamento: string;
  modalidad: "presencial" | "remoto" | "híbrido";
  salarioBase: number;
  fechaPublicacion: string; // ISO date string
  estado: VacancyStatus;
  candidatos: string[];
}

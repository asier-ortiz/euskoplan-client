import type  {StepModel} from "@/models/step.model";

export interface PlanModel {
  id:           number;
  id_usuario:   number;
  idioma:       string;
  titulo:       string;
  descripcion?: string;
  votos:        number;
  publico:      boolean;
  pasos?:       StepModel[];
}



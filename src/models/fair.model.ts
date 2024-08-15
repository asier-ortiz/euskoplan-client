import type  {ImageModel} from "@/models/image.model";

export interface FairModel {
  id:                number;
  coleccion:         string;
  codigo:            string;
  tipo_recurso?:     string;
  nombre?:           string;
  descripcion?:      string;
  url_ficha_portal?: string;
  direccion?:        string;
  codigo_postal?:    string;
  numero_telefono?:  string;
  email?:            string;
  pagina_web?:       string;
  codigo_provincia?: string;
  codigo_municipio?: string;
  nombre_provincia?: string;
  nombre_municipio?: string;
  longitud?:         string;
  latitud?:          string;
  atracciones?:      string;
  horario?:          string;
  tarifas?:          string;
  imagenes?:         ImageModel[];
}

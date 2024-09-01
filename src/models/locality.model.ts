import type  {ImageModel} from "@/models/image.model";

export interface LocalityModel {
  id:                 number;
  coleccion:          string;
  slug:                    string;
  codigo:             string;
  tipo_recurso?:      string;
  nombre?:            string;
  descripcion?:       string;
  url_ficha_portal?:  string;
  codigo_provincia?:  string;
  codigo_municipio?:  string;
  codigo_localidad?:  string;
  nombre_provincia?:  string;
  nombre_municipio?:  string;
  nombre_localidad?:  string;
  longitud?:          string;
  latitud?:           string;
  numero_habitantes?: string;
  superficie?:        string;
  imagenes?:          ImageModel[];
}

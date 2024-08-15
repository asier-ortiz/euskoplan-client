import type  {ImageModel} from "@/models/image.model";
import type  {ServiceModel} from "@/models/service.model";

export interface CulturalModel {
  id:                      number;
  coleccion:               string;
  codigo:                  string;
  tipo_recurso?:           string;
  nombre?:                 string;
  descripcion?:            string;
  url_ficha_portal?:       string;
  direccion?:              string;
  codigo_postal?:          string;
  numero_telefono?:        string;
  email?:                  string;
  pagina_web?:             string;
  codigo_provincia?:       string;
  codigo_municipio?:       string;
  codigo_localidad?:       string;
  nombre_provincia?:       string;
  nombre_municipio?:       string;
  nombre_localidad?:       string;
  longitud?:               string;
  latitud?:                string;
  subtipo_recurso?:        string;
  nombre_subtipo_recurso?: string;
  tipo_monumento?:         string;
  estilo_artistico?:       string;
  imagenes?:               ImageModel[];
  servicios?:              ServiceModel[];
}

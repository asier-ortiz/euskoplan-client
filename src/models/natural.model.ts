import type  {ImageModel} from "@/models/image.model";
import type  {ServiceModel} from "@/models/service.model";

export interface NaturalModel {
  id:                                           number;
  coleccion:                                    string;
  slug:                    string;
  codigo:                                       string;
  tipo_recurso?:                                string;
  nombre?:                                      string;
  descripcion?:                                 string;
  url_ficha_portal?:                            string;
  direccion?:                                   string;
  codigo_postal?:                               string;
  numero_telefono?:                             string;
  email?:                                       string;
  pagina_web?:                                  string;
  codigo_provincia?:                            string;
  codigo_municipio?:                            string;
  nombre_provincia?:                            string;
  nombre_municipio?:                            string;
  longitud?:                                    string;
  latitud?:                                     string;
  subtipo_recurso_espacio_natural?:             string;
  nombre_subtipo_recurso_espacio_natural?:      string;
  fauna?:                                       string;
  flora?:                                       string;
  subtipo_recurso_playas_pantanos_rios?:        string;
  nombre_subtipo_recurso_playas_pantanos_rios?: string;
  horario?:                                     string;
  actividades?:                                 string;
  imagenes?:                                    ImageModel[];
  servicios?:                                   ServiceModel[];
}

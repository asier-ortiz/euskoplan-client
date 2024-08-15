import type {ImageModel} from "@/models/image.model";
import type {ServiceModel} from "@/models/service.model";
import type {PriceModel} from "@/models/price.model";

export interface AccommodationModel {
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
  nombre_provincia?:       string;
  nombre_municipio?:       string;
  longitud?:               string;
  latitud?:                string;
  subtipo_recurso?:        string;
  nombre_subtipo_recurso?: string;
  categoria?:              string;
  capacidad?:              string;
  anno_apertura?:          string;
  num_hab_individuales?:   string;
  num_hab_dobles?:         string;
  num_hab_salon?:          string;
  num_hab_hasta_4_plazas?: string;
  num_hab_mas_4_plazas?:   string;
  imagenes?:               ImageModel[];
  servicios?:              ServiceModel[];
  precios?:                PriceModel[];
}

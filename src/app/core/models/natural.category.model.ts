export interface NaturalCategoryModel {
  espacio_natural:      EspacioNatural[];
  playas_pantanos_rios: PlayasPantanosRios[];
}

export interface EspacioNatural {
  nombre_subtipo_recurso_espacio_natural: string;
}

export interface PlayasPantanosRios {
  nombre_subtipo_recurso_playas_pantanos_rios: string;
}

import type { AccommodationModel } from "@/models/accommodation.model";
import type { CaveModel } from "@/models/cave.model";
import type { CulturalModel } from "@/models/cultural.model";
import type { EventModel } from "@/models/event.model";
import type { FairModel } from "@/models/fair.model";
import type { MuseumModel } from "@/models/museum.model";
import type { NaturalModel } from "@/models/natural.model";
import type { RestaurantModel } from "@/models/restaurant.model";
import type { PlanModel } from "@/models/plan.model";

export interface FavoriteModel {
    id_usuario: number;
    favoritos: {
        alojamientos?: { id: number; recurso: AccommodationModel }[];
        cuvas_restos_arqueologicos?: { id: number; recurso: CaveModel }[];
        recursos_culturales?: { id: number; recurso: CulturalModel }[];
        eventos?: { id: number; recurso: EventModel }[];
        parques_tematicos?: { id: number; recurso: FairModel }[];
        museos_centos_interpretacion?: { id: number; recurso: MuseumModel }[];
        parques_naturales?: { id: number; recurso: NaturalModel }[];
        restaurantes?: { id: number; recurso: RestaurantModel }[];
        planes?: { id: number; recurso: PlanModel }[];
    };
}

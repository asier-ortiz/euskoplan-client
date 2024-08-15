import type  {AccommodationModel} from "@/models/accommodation.model";
import type  {CaveModel} from "@/models/cave.model";
import type  {CulturalModel} from "@/models/cultural.model";
import type  {EventModel} from "@/models/event.model";
import type {FairModel} from "@/models/fair.model";
import type {LocalityModel} from "@/models/locality.model";
import type {MuseumModel} from "@/models/museum.model";
import type {NaturalModel} from "@/models/natural.model";
import type  {RestaurantModel} from "@/models/restaurant.model";

export interface StepModel {
  id: number;
  indice: number;
  indicaciones?: string;
  recurso: AccommodationModel | CaveModel | CulturalModel | EventModel | FairModel | LocalityModel | MuseumModel | NaturalModel | RestaurantModel;
}

import {AccommodationModel} from "@core/models/accommodation.model";
import {CaveModel} from "@core/models/cave.model";
import {CulturalModel} from "@core/models/cultural.model";
import {EventModel} from "@core/models/event.model";
import {FairModel} from "@core/models/fair.model";
import {LocalityModel} from "@core/models/locality.model";
import {MuseumModel} from "@core/models/museum.model";
import {NaturalModel} from "@core/models/natural.model";
import {RestaurantModel} from "@core/models/restaurant.model";

export interface StepModel {
  id: number;
  indice: number;
  indicaciones?: string;
  recurso: AccommodationModel | CaveModel | CulturalModel | EventModel | FairModel | LocalityModel | MuseumModel | NaturalModel | RestaurantModel;
}

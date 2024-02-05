import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "@environments/environment";
import {Observable} from "rxjs";
import {RestaurantModel} from "@core/models/restaurant.model";
import {AccommodationModel} from "@core/models/accommodation.model";
import {CommonCategoryModel} from "@core/models/common.category.model";
import {CaveModel} from "@core/models/cave.model";
import {CulturalModel} from "@core/models/cultural.model";
import {EventModel} from "@core/models/event.model";
import {FairModel} from "@core/models/fair.model";
import {MuseumModel} from "@core/models/museum.model";
import {NaturalModel} from "@core/models/natural.model";
import {NaturalCategoryModel} from "@core/models/natural.category.model";
import {LocalityModel} from "@core/models/locality.model";
import {LocalityNameModel} from "@core/models/locality.name.model";
import {withCache} from '@ngneat/cashew';

@Injectable({
  providedIn: 'root'
})
export class CollectionsService {

  private readonly API_URL: string = environment.api_url;

  constructor(private _httpClient: HttpClient) {
  }

  //////////////////////// COLLECTIONS ////////////////////////

  // Accommodation
  public getAccommodationsFiltering(query: Record<string, string>): Observable<AccommodationModel[]> {
    let params = new HttpParams();
    if (query['idioma']) params = params.append('idioma', query['idioma']);
    if (query['nombre']) params = params.append('nombre', query['nombre']);
    if (query['nombre_provincia']) params = params.append('nombre_provincia', query['nombre_provincia']);
    if (query['nombre_municipio']) params = params.append('nombre_municipio', query['nombre_municipio']);
    if (query['nombre_subtipo_recurso']) params = params.append('nombre_subtipo_recurso', query['nombre_subtipo_recurso']);
    if (query['descripcion']) params = params.append('descripcion', query['descripcion']);
    if (query['aleatorio']) params = params.append('aleatorio', query['aleatorio']);
    if (query['limite']) params = params.append('limite', query['limite']);
    return this._httpClient.get<AccommodationModel[]>(`${this.API_URL}/accommodation/results/filter`, {
      params: params,
      context: withCache()
    });
  }

  public getAccommodationsSearching(query: Record<string, string>): Observable<AccommodationModel[]> {
    let params = new HttpParams();
    if (query['idioma']) params = params.append('idioma', query['idioma']);
    if (query['busqueda']) params = params.append('busqueda', query['busqueda']);
    return this._httpClient.get<AccommodationModel[]>(`${this.API_URL}/accommodation/results/search`, {params: params});
  }

  public getAccommodation(code: number, langague: string): Observable<AccommodationModel> {
    return this._httpClient.get<AccommodationModel>(`${this.API_URL}/accommodation/result/${code}/${langague}`);
  }

  public getAccommodationCategories(language: string): Observable<CommonCategoryModel[]> {
    return this._httpClient.get<CommonCategoryModel[]>(`${this.API_URL}/accommodation/categories/${language}`);
  }

  // Cave
  public getCavesFiltering(query: Record<string, string>): Observable<CaveModel[]> {
    let params = new HttpParams();
    if (query['idioma']) params = params.append('idioma', query['idioma']);
    if (query['nombre']) params = params.append('nombre', query['nombre']);
    if (query['nombre_provincia']) params = params.append('nombre_provincia', query['nombre_provincia']);
    if (query['nombre_municipio']) params = params.append('nombre_municipio', query['nombre_municipio']);
    if (query['nombre_subtipo_recurso']) params = params.append('nombre_subtipo_recurso', query['nombre_subtipo_recurso']);
    if (query['descripcion']) params = params.append('descripcion', query['descripcion']);
    if (query['aleatorio']) params = params.append('aleatorio', query['aleatorio']);
    if (query['limite']) params = params.append('limite', query['limite']);

    return this._httpClient.get<CaveModel[]>(`${this.API_URL}/cave/results/filter`, {
      params: params,
      context: withCache()
    });
  }

  public getCavesSearching(query: Record<string, string>): Observable<CaveModel[]> {
    let params = new HttpParams();
    if (query['idioma']) params = params.append('idioma', query['idioma']);
    if (query['busqueda']) params = params.append('busqueda', query['busqueda']);
    return this._httpClient.get<CaveModel[]>(`${this.API_URL}/cave/results/search`, {params: params});
  }

  public getCave(code: number, langague: string): Observable<CaveModel> {
    return this._httpClient.get<CaveModel>(`${this.API_URL}/cave/result/${code}/${langague}`);
  }

  public getCaveCategories(language: string): Observable<CommonCategoryModel[]> {
    return this._httpClient.get<CommonCategoryModel[]>(`${this.API_URL}/cave/categories/${language}`);
  }

  // Cultural
  public getCulturalsFiltering(query: Record<string, string>): Observable<CulturalModel[]> {
    let params = new HttpParams();
    if (query['idioma']) params = params.append('idioma', query['idioma']);
    if (query['nombre']) params = params.append('nombre', query['nombre']);
    if (query['nombre_provincia']) params = params.append('nombre_provincia', query['nombre_provincia']);
    if (query['nombre_municipio']) params = params.append('nombre_municipio', query['nombre_municipio']);
    if (query['nombre_subtipo_recurso']) params = params.append('nombre_subtipo_recurso', query['nombre_subtipo_recurso']);
    if (query['descripcion']) params = params.append('descripcion', query['descripcion']);
    if (query['aleatorio']) params = params.append('aleatorio', query['aleatorio']);
    if (query['limite']) params = params.append('limite', query['limite']);

    return this._httpClient.get<CulturalModel[]>(`${this.API_URL}/cultural/results/filter`, {
      params: params,
      context: withCache()
    });
  }

  public getCulturalsSearching(query: Record<string, string>): Observable<CulturalModel[]> {
    let params = new HttpParams();
    if (query['idioma']) params = params.append('idioma', query['idioma']);
    if (query['busqueda']) params = params.append('busqueda', query['busqueda']);
    return this._httpClient.get<CulturalModel[]>(`${this.API_URL}/cultural/results/search`, {params: params});
  }

  public getCultural(code: number, langague: string): Observable<CulturalModel> {
    return this._httpClient.get<CulturalModel>(`${this.API_URL}/cultural/result/${code}/${langague}`);
  }

  public getCulturalCategories(language: string): Observable<CommonCategoryModel[]> {
    return this._httpClient.get<CommonCategoryModel[]>(`${this.API_URL}/cultural/categories/${language}`);
  }

  // Event
  public getEventsFiltering(query: Record<string, string>): Observable<EventModel[]> {
    let params = new HttpParams();
    if (query['idioma']) params = params.append('idioma', query['idioma']);
    if (query['nombre']) params = params.append('nombre', query['nombre']);
    if (query['nombre_provincia']) params = params.append('nombre_provincia', query['nombre_provincia']);
    if (query['nombre_municipio']) params = params.append('nombre_municipio', query['nombre_municipio']);
    if (query['nombre_subtipo_recurso']) params = params.append('nombre_subtipo_recurso', query['nombre_subtipo_recurso']);
    if (query['fecha_inicio']) params = params.append('fecha_inicio', query['fecha_inicio']);
    if (query['fecha_fin']) params = params.append('fecha_fin', query['fecha_fin']);
    if (query['descripcion']) params = params.append('descripcion', query['descripcion']);
    if (query['aleatorio']) params = params.append('aleatorio', query['aleatorio']);
    if (query['limite']) params = params.append('limite', query['limite']);
    return this._httpClient.get<EventModel[]>(`${this.API_URL}/event/results/filter`, {
      params: params,
      context: withCache()
    });
  }

  public getEventsSearching(query: Record<string, string>): Observable<EventModel[]> {
    let params = new HttpParams();
    if (query['idioma']) params = params.append('idioma', query['idioma']);
    if (query['busqueda']) params = params.append('busqueda', query['busqueda']);
    return this._httpClient.get<EventModel[]>(`${this.API_URL}/event/results/search`, {params: params});
  }

  public getEvent(code: number, langague: string): Observable<EventModel> {
    return this._httpClient.get<EventModel>(`${this.API_URL}/event/result/${code}/${langague}`);
  }

  public getEventCategories(language: string): Observable<CommonCategoryModel[]> {
    return this._httpClient.get<CommonCategoryModel[]>(`${this.API_URL}/event/categories/${language}`);
  }

  // Fair
  public getFairsFiltering(query: Record<string, string>): Observable<FairModel[]> {
    let params = new HttpParams();
    if (query['idioma']) params = params.append('idioma', query['idioma']);
    if (query['nombre']) params = params.append('nombre', query['nombre']);
    if (query['nombre_provincia']) params = params.append('nombre_provincia', query['nombre_provincia']);
    if (query['nombre_municipio']) params = params.append('nombre_municipio', query['nombre_municipio']);
    if (query['descripcion']) params = params.append('descripcion', query['descripcion']);
    if (query['aleatorio']) params = params.append('aleatorio', query['aleatorio']);
    if (query['limite']) params = params.append('limite', query['limite']);
    return this._httpClient.get<FairModel[]>(`${this.API_URL}/fair/results/filter`, {
      params: params,
      context: withCache()
    });
  }

  public getFairsSearching(query: Record<string, string>): Observable<FairModel[]> {
    let params = new HttpParams();
    if (query['idioma']) params = params.append('idioma', query['idioma']);
    if (query['busqueda']) params = params.append('busqueda', query['busqueda']);
    return this._httpClient.get<FairModel[]>(`${this.API_URL}/fair/results/search`, {params: params});
  }

  public getFair(code: number, langague: string): Observable<FairModel> {
    return this._httpClient.get<FairModel>(`${this.API_URL}/fair/result/${code}/${langague}`);
  }

  // Locality
  public getLocalitiesFiltering(query: Record<string, string>): Observable<LocalityModel[]> {
    let params = new HttpParams();
    if (query['idioma']) params = params.append('idioma', query['idioma']);
    if (query['nombre']) params = params.append('nombre', query['nombre']);
    if (query['nombre_provincia']) params = params.append('nombre_provincia', query['nombre_provincia']);
    if (query['descripcion']) params = params.append('descripcion', query['descripcion']);
    if (query['aleatorio']) params = params.append('aleatorio', query['aleatorio']);
    if (query['limite']) params = params.append('limite', query['limite']);
    return this._httpClient.get<LocalityModel[]>(`${this.API_URL}/locality/results/filter`, {
      params: params,
      context: withCache()
    });
  }

  public getLocalitiesSearching(query: Record<string, string>): Observable<LocalityModel[]> {
    let params = new HttpParams();
    if (query['idioma']) params = params.append('idioma', query['idioma']);
    if (query['busqueda']) params = params.append('busqueda', query['busqueda']);
    return this._httpClient.get<LocalityModel[]>(`${this.API_URL}/locality/results/search`, {params: params});
  }

  public getLocality(code: number, langague: string): Observable<LocalityModel> {
    return this._httpClient.get<LocalityModel>(`${this.API_URL}/locality/${code}/${langague}`);
  }

  public getLocalityNames(query: Record<string, string>): Observable<LocalityNameModel[]> {
    let params = new HttpParams();
    if (query['idioma']) params = params.append('idioma', query['idioma']);
    return this._httpClient.get<LocalityNameModel[]>(`${this.API_URL}/locality/names`, {params: params});
  }

  // Museum
  public getMuseumsFiltering(query: Record<string, string>): Observable<MuseumModel[]> {
    let params = new HttpParams();
    if (query['idioma']) params = params.append('idioma', query['idioma']);
    if (query['nombre']) params = params.append('nombre', query['nombre']);
    if (query['nombre_provincia']) params = params.append('nombre_provincia', query['nombre_provincia']);
    if (query['nombre_municipio']) params = params.append('nombre_municipio', query['nombre_municipio']);
    if (query['nombre_subtipo_recurso']) params = params.append('nombre_subtipo_recurso', query['nombre_subtipo_recurso']);
    if (query['descripcion']) params = params.append('descripcion', query['descripcion']);
    if (query['aleatorio']) params = params.append('aleatorio', query['aleatorio']);
    if (query['limite']) params = params.append('limite', query['limite']);
    return this._httpClient.get<MuseumModel[]>(`${this.API_URL}/museum/results/filter`, {
      params: params,
      context: withCache()
    });
  }

  public getMuseumsSearching(query: Record<string, string>): Observable<MuseumModel[]> {
    let params = new HttpParams();
    if (query['idioma']) params = params.append('idioma', query['idioma']);
    if (query['busqueda']) params = params.append('busqueda', query['busqueda']);
    return this._httpClient.get<MuseumModel[]>(`${this.API_URL}/museum/results/search`, {params: params});
  }

  public getMuseum(code: number, langague: string): Observable<MuseumModel> {
    return this._httpClient.get<MuseumModel>(`${this.API_URL}/museum/result/${code}/${langague}`);
  }

  public getMuseumCategories(language: string): Observable<CommonCategoryModel[]> {
    return this._httpClient.get<CommonCategoryModel[]>(`${this.API_URL}/museum/categories/${language}`);
  }

  // Natural
  public getNaturalsFiltering(query: Record<string, string>): Observable<NaturalModel[]> {
    let params = new HttpParams();
    if (query['idioma']) params = params.append('idioma', query['idioma']);
    if (query['nombre']) params = params.append('nombre', query['nombre']);
    if (query['nombre_provincia']) params = params.append('nombre_provincia', query['nombre_provincia']);
    if (query['nombre_municipio']) params = params.append('nombre_municipio', query['nombre_municipio']);
    if (query['nombre_subtipo_recurso_espacio_natural']) params = params.append('nombre_subtipo_recurso_espacio_natural', query['nombre_subtipo_recurso_espacio_natural']);
    if (query['nombre_subtipo_recurso_playas_pantanos_rios']) params = params.append('nombre_subtipo_recurso_playas_pantanos_rios', query['nombre_subtipo_recurso_playas_pantanos_rios']);
    if (query['descripcion']) params = params.append('descripcion', query['descripcion']);
    if (query['aleatorio']) params = params.append('aleatorio', query['aleatorio']);
    if (query['limite']) params = params.append('limite', query['limite']);
    return this._httpClient.get<NaturalModel[]>(`${this.API_URL}/natural/results/filter`, {
      params: params,
      context: withCache()
    });
  }

  public getNaturalsSearching(query: Record<string, string>): Observable<NaturalModel[]> {
    let params = new HttpParams();
    if (query['idioma']) params = params.append('idioma', query['idioma']);
    if (query['busqueda']) params = params.append('busqueda', query['busqueda']);
    return this._httpClient.get<NaturalModel[]>(`${this.API_URL}/natural/results/search`, {params: params});
  }

  public getNatural(code: number, langague: string): Observable<NaturalModel> {
    return this._httpClient.get<NaturalModel>(`${this.API_URL}/natural/result/${code}/${langague}`);
  }

  public getNaturalCategories(language: string): Observable<NaturalCategoryModel[]> {
    return this._httpClient.get<NaturalCategoryModel[]>(`${this.API_URL}/natural/categories/${language}`);
  }

  // Restaurant
  public getRestaurantsFiltering(query: Record<string, string>): Observable<RestaurantModel[]> {
    let params = new HttpParams();
    if (query['idioma']) params = params.append('idioma', query['idioma']);
    if (query['nombre']) params = params.append('nombre', query['nombre']);
    if (query['nombre_provincia']) params = params.append('nombre_provincia', query['nombre_provincia']);
    if (query['nombre_municipio']) params = params.append('nombre_municipio', query['nombre_municipio']);
    if (query['nombre_subtipo_recurso']) params = params.append('nombre_subtipo_recurso', query['nombre_subtipo_recurso']);
    if (query['descripcion']) params = params.append('descripcion', query['descripcion']);
    if (query['aleatorio']) params = params.append('aleatorio', query['aleatorio']);
    if (query['limite']) params = params.append('limite', query['limite']);
    return this._httpClient.get<RestaurantModel[]>(`${this.API_URL}/restaurant/results/filter`, {
      params: params,
      context: withCache()
    });
  }

  public getRestaurantsSearching(query: Record<string, string>): Observable<RestaurantModel[]> {
    let params = new HttpParams();
    if (query['idioma']) params = params.append('idioma', query['idioma']);
    if (query['busqueda']) params = params.append('busqueda', query['busqueda']);
    return this._httpClient.get<RestaurantModel[]>(`${this.API_URL}/restaurant/results/search`, {params: params});
  }

  public getRestaurant(code: number, langague: string): Observable<RestaurantModel> {
    return this._httpClient.get<RestaurantModel>(`${this.API_URL}/restaurant/result/${code}/${langague}`);
  }

  public getRestaurantCategories(language: string): Observable<CommonCategoryModel[]> {
    return this._httpClient.get<CommonCategoryModel[]>(`${this.API_URL}/restaurant/categories/${language}`);
  }

}

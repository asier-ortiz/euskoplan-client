import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CollectionsService} from "@shared/services/collections.service";
import {BehaviorSubject, finalize, Observable, Subscription} from "rxjs";

@Component({
  selector: 'app-resource-list-page',
  templateUrl: './resource-list-page.component.html',
  styleUrls: ['./resource-list-page.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ResourceListPageComponent implements OnInit, OnDestroy {

  public _resources$ = new BehaviorSubject<any>(null);
  private _resourcesSub$: Subscription;
  public _loading$ = new BehaviorSubject<boolean>(true);
  public _collection: string;
  private _collectionObservable: Observable<any>;

  constructor(
    private _collectionsService: CollectionsService,
    private _router: Router,
    private _route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this._collection = this._route.snapshot.url[0].path;

    let query: Record<string, string> = {};
    query['idioma'] = 'es';

    this._setCollectionObservable(query);

    this._resourcesSub$ = this._collectionObservable
      .pipe(
        // Observable para el spinner de 'cargando' del mapa
        finalize(() => this._loading$.next(false))
      )
      .subscribe({
        next: res => this._resources$.next(res),
        error: err => console.error(err)
      });
  }

  ngOnDestroy(): void {
    this._resourcesSub$?.unsubscribe();
  }

  private _setCollectionObservable(query: Record<string, string>) {

    switch (this._collection) {
      case 'accommodations':
        this._collectionObservable = this._collectionsService.getAccommodationsFiltering(query);
        break
      case 'caves':
        this._collectionObservable = this._collectionsService.getCavesFiltering(query);
        break
      case 'culturals':
        this._collectionObservable = this._collectionsService.getCulturalsFiltering(query);
        break
      case 'events':
        this._collectionObservable = this._collectionsService.getEventsFiltering(query);
        break
      case 'fairs':
        this._collectionObservable = this._collectionsService.getFairsFiltering(query);
        break
      case 'localities':
        this._collectionObservable = this._collectionsService.getLocalitiesFiltering(query);
        break
      case 'naturals':
        this._collectionObservable = this._collectionsService.getNaturalsFiltering(query);
        break
      case 'museums':
        this._collectionObservable = this._collectionsService.getMuseumsFiltering(query);
        break
      case 'restaurants':
        this._collectionObservable = this._collectionsService.getRestaurantsFiltering(query);
        break
    }
  }

  public _onFilterFormSubmit(data) {
    const category = data.category;
    const locality = data.locality;
    const province = data.province;
    const startDate = data.startDate;
    const endDate = data.endDate;

    let query: Record<string, string> = {};
    query['idioma'] = 'es';
    if (category) query[category.subtype] = category.name;
    if (locality) query['nombre_municipio'] = locality.name;
    if (province) query['nombre_provincia'] = province.name;
    if (startDate) query['fecha_inicio'] = startDate;
    if (endDate) query['fecha_fin'] = endDate;

    this._loading$.next(true);
    this._resourcesSub$?.unsubscribe();
    this._setCollectionObservable(query);

    this._resourcesSub$ = this._collectionObservable
      .pipe(
        finalize(() => this._loading$.next(false))
      )
      .subscribe({
        next: res => this._resources$.next(res),
        error: err => console.error(err)
      });
  }

}

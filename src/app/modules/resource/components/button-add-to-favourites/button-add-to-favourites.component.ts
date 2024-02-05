import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AccommodationModel} from "@core/models/accommodation.model";
import {CaveModel} from "@core/models/cave.model";
import {CulturalModel} from "@core/models/cultural.model";
import {EventModel} from "@core/models/event.model";
import {FairModel} from "@core/models/fair.model";
import {LocalityModel} from "@core/models/locality.model";
import {MuseumModel} from "@core/models/museum.model";
import {NaturalModel} from "@core/models/natural.model";
import {RestaurantModel} from "@core/models/restaurant.model";
import {FavouritesService} from "@shared/services/favourites.service";
import {finalize, Subscription} from "rxjs";
import {MessageService} from "primeng/api";
import {showToast} from "@shared/helpers/shared.helpers";

@Component({
  selector: 'app-button-add-to-favourites',
  templateUrl: './button-add-to-favourites.component.html',
  styleUrls: ['./button-add-to-favourites.component.css']
})
export class ButtonAddToFavouritesComponent implements OnInit, OnDestroy {

  @Input() _resource: AccommodationModel | CaveModel | CulturalModel | EventModel | FairModel | LocalityModel | MuseumModel | NaturalModel | RestaurantModel;

  private _favouritesSub$: Subscription;
  private _addRemoveFavouriteSub$: Subscription;
  public _favourites: any;
  public _formBeingSubmitted: boolean = false;

  constructor(private _favouriteService: FavouritesService, private _messageService: MessageService) {
  }

  ngOnInit(): void {

    this._favouritesSub$ = this._favouriteService.getFavourites()
      .subscribe({
        next: favourites => this._favourites = favourites,
        error: err => console.error(err)
      });

  }

  ngOnDestroy(): void {
    this._favouritesSub$?.unsubscribe();
    this._addRemoveFavouriteSub$?.unsubscribe();
  }

  _onAddRemoveToFavouritesFormSubmit() {

    this._formBeingSubmitted = true;

    if (!this._resourceIsAlreadyInFavourites()) {

      this._addRemoveFavouriteSub$ = this._favouriteService.saveFavourite({
        'id_favorito': this._resource.id,
        'tipo_favorito': this._resource.coleccion
      })
        .pipe(finalize(() =>
          this._formBeingSubmitted = false
        ))
        .subscribe({
          next: favourites => {
            this._favourites = favourites;
            showToast(this._messageService, 'success', `${this._resource.nombre}`, 'Añadido a favoritos');
          },
          error: err => {
            console.error(err);
            showToast(this._messageService, 'error', 'Error', 'No se ha podido añadir el favorito');
          }
        });

    } else {

      this._addRemoveFavouriteSub$ = this._favouriteService.deleteFavourite(this._getFavouriteID())
        .pipe(finalize(() =>
          this._formBeingSubmitted = false
        ))
        .subscribe({
          next: favourites => {
            this._favourites = favourites;
            showToast(this._messageService, 'success', `${this._resource.nombre}`, 'Eliminado de favoritos');
          },
          error: err => {
            console.error(err);
            showToast(this._messageService, 'error', 'Error', 'No se ha podido eliminar el favorito');
          }
        });
    }
  }

  private _getAllResourcesInFavourites() {
    let allResourcesInFavourites: any[] = [];

    allResourcesInFavourites.push(
      ...this._favourites.favoritos?.alojamientos ?? [],
      ...this._favourites.favoritos?.cuvas_restos_arqueologicos ?? [],
      ...this._favourites.favoritos?.recursos_culturales ?? [],
      ...this._favourites.favoritos?.eventos ?? [],
      ...this._favourites.favoritos?.parques_tematicos ?? [],
      ...this._favourites.favoritos?.localidades ?? [],
      ...this._favourites.favoritos?.museos_centos_interpretacion ?? [],
      ...this._favourites.favoritos?.parques_naturales ?? [],
      ...this._favourites.favoritos?.restaurantes ?? [],
      ...this._favourites.favoritos?.planes ?? []
    )

    return allResourcesInFavourites;
  }

  public _resourceIsAlreadyInFavourites(): boolean {
    if (!this._favourites || !this._resource) return false;

    return this._getAllResourcesInFavourites().some((value) => {
      return value.recurso.codigo == this._resource.codigo;
    });
  }

  private _getFavouriteID(): number | null {
    if (!this._favourites || !this._resource) return null;

    return this._getAllResourcesInFavourites().find(resourceObj => {
      return resourceObj.recurso.codigo == this._resource.codigo
    }).id;
  }

}

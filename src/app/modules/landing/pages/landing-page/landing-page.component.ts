export interface VerMas{
  id : null,
  nombre: string,
  imagenes: string[]
}

import {Component, OnDestroy, OnInit} from '@angular/core';
import {CollectionsService} from "@shared/services/collections.service";
import {finalize, forkJoin, Observable, Subscription} from "rxjs";
import {AccommodationModel} from "@core/models/accommodation.model";
import {CaveModel} from "@core/models/cave.model";
import {CulturalModel} from "@core/models/cultural.model";
import {EventModel} from "@core/models/event.model";
import {FairModel} from "@core/models/fair.model";
import {LocalityModel} from "@core/models/locality.model";
import {MuseumModel} from "@core/models/museum.model";
import {NaturalModel} from "@core/models/natural.model";
import {RestaurantModel} from "@core/models/restaurant.model";

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  collService: CollectionsService;
  limitCarousel: string = "10";
  
  tipoCarousel = ["CuevasParaValientes","ParquesAtracciones","Museos","PlanesNaturales","PlanesCulturales"]
  
  dataCultural: CulturalModel[] = []; 
  dataCaves: CaveModel[] = []; 
  dataFairs: FairModel[] = []; 
  dataMuseums: MuseumModel[] = []; 
  dataNatural: NaturalModel[] = []; 
  dataRestaurant : RestaurantModel[] = [];
  dataAccommodation : AccommodationModel[] = [];
  dataEvent : EventModel[] = [];

  myObservables: Observable<{
    cultural: CulturalModel[];
    caves: CaveModel[];
    fairs: FairModel[];
    museums: MuseumModel[];
    naturals: NaturalModel[];
    restaurant : RestaurantModel[];
    accommodation : AccommodationModel[];
    event : EventModel[];
}>

colections : Subscription;
public lectura: boolean = true;


datos : any[];

 tipoCueva : String = "CuevasParaValientes";
 tipoParque : String = "ParquesAtracciones";
 tipoMuseo : String = "Museos";
 tipoNatural : String = "PlanesNaturales";
 tipoCultural : String = "PlanesCulturales";
 
  
  constructor(private _collService: CollectionsService) {
    this.collService = _collService;   
    
  }

  ngOnInit(){
   
      this.colections = this.getObservables().pipe(finalize(() => this.lectura= false)).subscribe(data => {
        
        this.dataCaves.push(...data.caves);
        this.dataFairs.push(...data.fairs);
        this.dataMuseums.push(...data.museums);
        this.dataNatural.push(...data.naturals);
        this.dataCultural.push(...data.cultural);
        this.dataRestaurant.push(...data.restaurant);
        this.dataAccommodation.push(...data.accommodation);
        this.dataEvent.push(...data.event);
  });}

  ngOnDestroy(): void {
    this.colections.unsubscribe();
  }



  getObservables(): Observable<{cultural: CulturalModel[]; caves: CaveModel[]; 
                                fairs: FairModel[]; museums: MuseumModel[]; 
                                naturals: NaturalModel[]; restaurant : RestaurantModel[];
                                accommodation : AccommodationModel[];
                                event : EventModel[];}> {
    this.myObservables = forkJoin(
      // as of RxJS 6.5+ we can use a dictionary of sources
      {
        cultural: this._collService.getCulturalsFiltering({'idioma': this.getLang(),'limite': this.limitCarousel}),
        caves: this._collService.getCavesFiltering({'idioma': this.getLang(),'limite': this.limitCarousel}),
        fairs: this._collService.getFairsFiltering({'idioma': this.getLang(),'limite': this.limitCarousel}),
        museums: this._collService.getMuseumsFiltering({'idioma': this.getLang(),'limite': this.limitCarousel}),
        naturals: this._collService.getNaturalsFiltering({'idioma': this.getLang(),'limite': this.limitCarousel}),
        restaurant: this._collService.getRestaurantsFiltering({'idioma': this.getLang(),'limite': this.limitCarousel}),
        accommodation :this._collService.getAccommodationsFiltering({'idioma': this.getLang(),'limite': this.limitCarousel}) ,
        event : this._collService.getEventsFiltering({'idioma': this.getLang(),'limite': this.limitCarousel}) 
      }); 
      return this.myObservables;
  }

  public getLang(): string {
    return localStorage.getItem('lang');
  }
  
  
}


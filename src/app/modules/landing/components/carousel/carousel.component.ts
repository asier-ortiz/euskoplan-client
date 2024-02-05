export interface VerMas{
  id : null,
  nombre: string,
  imagenes: string[]
}
import { TranslateService } from '@ngx-translate/core';
import { ImageModel } from '@core/models/image.model';
import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";


@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CarouselComponent implements OnInit {

  //Recibimos el limite del Carousel y el tipo de Colección
  @Input() tipoCarousel: string;
  @Input() datosCarousel : any[];
  @Input() lectura : boolean;
  dataFinCarga : any[] =  [];

  limitCarousel: string = "10";
  imgGeneric: string = "";

  responsiveOptions: { breakpoint: string; numVisible: number; numScroll: number; }[] = [];

  imagenes : ImageModel[] = [];

  private _route: ActivatedRoute;
  private _router: Router;

  public lang: string;

  private collectionName: string;
  public collectionNamePlural: string;

  constructor(public translate: TranslateService,_route:ActivatedRoute, _router:Router) {
    this._route = _route;
    this._router = _router;
    translate.addLangs(['es', 'eu']);
    translate.setDefaultLang('es');


  }

  ngOnChanges():void {

    if(this.lectura == false) {
      if(this.lang == "es") {
        this.datosCarousel.push({ id : null, nombre: "Ver más", imagenes: null})
      } else {
        this.datosCarousel.push({ id : null, nombre: "Gehiago ikusi", imagenes: null})
      }

      this.dataFinCarga = this.datosCarousel;
    }
  }

  ngOnInit(): void {

    //Leo el idioma de localStorage
    if(!localStorage.getItem('lang')==null)  {
      this.lang = "es";
      localStorage.setItem('lang', 'es');
  } else {
      this.lang = localStorage.getItem('lang');
    }

    this.switchLang(this.lang);


  this.setResponsiveOptions();
  console.log(this.tipoCarousel);
  console.log(this.datosCarousel);

    switch (this.tipoCarousel) {
      case "PlanesNaturales":
        this.imgGeneric = "generic-natural.jpg";
        this.collectionName = 'natural';
        this.collectionNamePlural = 'naturals'
      break;
      case "Museos":
        this.imgGeneric = "generic-museum.jpg";
        this.collectionName = 'museum';
        this.collectionNamePlural = 'museums'
      break;
      case "Eventos":
        this.imgGeneric = "generic-event.jpg";
        this.collectionName = 'event';
        this.collectionNamePlural = 'events'
      break;
      case "Restaurantes":
        this.imgGeneric = "generic-restaurant.jpg";
        this.collectionName = 'restaurant';
        this.collectionNamePlural = 'restaurants'
      break;
      case "PlanesCulturales":
        this.imgGeneric = "generic-cultural.jpg";
        this.collectionName = 'cultural';
        this.collectionNamePlural = 'culturals'
      break;
      case "Alojamientos":
        this.imgGeneric = "generic-accommodation.jpg";
        this.collectionName = 'accommodation';
        this.collectionNamePlural = 'accommodations'
      break;
      case "ParquesAtracciones":
        this.imgGeneric = "generic-fair.jpg";
        this.collectionName = 'fair';
        this.collectionNamePlural = 'fairs'
      break;
      case "CuevasParaValientes":
        this.imgGeneric = "gereic-cave.jpg";
        this.collectionName = 'cave';
        this.collectionNamePlural = 'caves'
      break;
    }


  }

   //Metodo que cambia el idioma
   switchLang(lang: string) {
    this.translate.use(this.lang);
  }

  public getImagen(imagenes: any, id: any): string {

    this.imagenes = imagenes;
    if(id == null) {
      return "assets/images/verMas.jpg"
    }
    if(this.imagenes[0] == null) {
      return "assets/images/"+this.imgGeneric;
    } else {
      return this.imagenes[0].fuente;
    }
  }

  public getImagenTitulo(imagenes: any, id:any): string {

    this.imagenes = imagenes;
    if(id == null) {
      return "";
    }
    if(this.imagenes[0] == null) {
      return "Imagen generica";
    } else {
      return this.imagenes[0].titulo;
    }
  }

  goDetalle(id: string, tipoCarousel: string, nombre: string, codigo: string) {

    if(id == null) {
      //Si el id es nulo, es un ver mas, llamar al metodo goMas
      this.goMas(tipoCarousel);
    } else {
        console.log(codigo);
      //Sino ir a la página del elemento
      //   this._router.navigate(['/detail/'+tipoCarousel+'/'+id+'/'+codigo]);
        this._router.navigate([`/resource/${this.collectionName}/${codigo}`]);


    }

    }

  goMas(tipoCarousel: string) {

    console.log("Tipo Carousel:"+tipoCarousel);
    console.log("Ir a la página de la lista");
    this._router.navigate([`/resource/${this.collectionNamePlural}`]);
  }


  public getLang(): string {
    return localStorage.getItem('lang');
  }

  //Metodo que establece las opciones responsive
  setResponsiveOptions() : void {
    this.responsiveOptions = [
      {
          breakpoint: '1024px',
          numVisible: 3,
          numScroll: 3
      },
      {
          breakpoint: '768px',
          numVisible: 2,
          numScroll: 2
      },
      {
          breakpoint: '560px',
          numVisible: 1,
          numScroll: 1
      }
  ];
  }

}

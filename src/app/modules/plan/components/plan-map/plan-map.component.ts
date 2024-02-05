import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {PlanModel} from "@core/models/plan.model";
import {environment} from "@environments/environment";
import mapboxgl, {LngLatBounds, Map, Marker} from "mapbox-gl";
import {PlansService} from "@shared/services/plans.service";
import {StepModel} from "@core/models/step.model";
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-plan-map',
  templateUrl: './plan-map.component.html',
  styleUrls: ['./plan-map.component.css']
})
export class PlanMapComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() public _plan$: Observable<PlanModel>;
  @Input() public _loading$: Observable<boolean>;
  @ViewChild('mapDiv') private _mapDivElement!: ElementRef;
  private readonly MAPBOX_TOKEN: string = environment.mapboxToken;
  private _planSub$: Subscription;
  private _loadingSub$: Subscription;
  private _routeSub$: Subscription;
  private _map: Map;
  private _bounds: LngLatBounds = new LngLatBounds();
  private _markers: Marker[] = [];
  private _mapIsReady: boolean = false;
  private _plan: PlanModel;
  private _profile: string = 'driving';
  public _isLoading: boolean;
  public _mapStyleIsDark: boolean = false;
  public _speedDialItems: any[] = [];
  
  planes = [
    'Visita guiada al Guggenhein',
    'Paseo en Kayak por la ría',
    'Visita a bodega de Txakoli',
    'Comida en la brasa canalla',
    'Concierto de Barrikada',
    'Pintxos por el casco antiguo',
    'Concierto de Barrikada',
  ];

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.planes, event.previousIndex, event.currentIndex);
  }

  constructor(private _planService: PlansService) {
  }

  ngOnInit(): void {
    this._loadingSub$ = this._loading$.subscribe({
      next: bool => this._isLoading = bool,
      error: _ => this._isLoading = false
    });

    this._speedDialItems = [
      {
        icon: 'pi pi-car',
        command: () => this._onChangeMapRouteProfile('driving')
      },
      {
        icon: 'bi bi-bicycle',
        command: () => this._onChangeMapRouteProfile('cycling')
      },
      {
        icon: 'bi bi-universal-access',
        command: () => this._onChangeMapRouteProfile('walking')
      }
    ];
  }

  ngAfterViewInit(): void {
    this._initMap();
    this._planSub$ = this._plan$.subscribe({
      next: (plan: PlanModel) => {
        if (!plan) return;
        this._plan = plan;
      },
      error: err => console.error(err)
    });
  }

  ngOnDestroy(): void {
    this._planSub$?.unsubscribe();
    this._loadingSub$.unsubscribe();
  }

  private _initMap() {
    mapboxgl.accessToken = this.MAPBOX_TOKEN;

    this._map = new Map({
      attributionControl: false,
      logoPosition: 'bottom-right',
      container: this._mapDivElement.nativeElement,
      style: this._mapStyleIsDark ? 'mapbox://styles/mapbox/navigation-night-v1' : 'mapbox://styles/mapbox/navigation-day-v1',
      center: [-2.616667, 42.983333], // Euskadi,
      pitch: 45,
      zoom: 7,
    });

    this._map.addControl(new mapboxgl.NavigationControl());
    this._map.addControl(new mapboxgl.FullscreenControl());

    this._map.on('style.load', () => {

      this._map.getStyle().layers.forEach((layer) => {
        if (layer.id === 'poi-label') this._map.removeLayer(layer.id);
      });

      this._map.setFog({
        "range": [0.8, 15],
        "color": "#00bfff",
        "horizon-blend": 0.5,
        // @ts-ignore
        "high-color": "#245bde",
        "space-color": "#000000",
        "star-intensity": 0.15
      });

      const loading = () => {
        if (!this._map.isStyleLoaded() || !this._plan) {
          setTimeout(loading, 200);
        } else {
          this._mapIsReady = true;
          this._addMarkers();
        }
      };
      loading();
    });
  }

  private _addMarkers() {

    this._plan.pasos.forEach((step: StepModel, index: number) => {

      const popup = new mapboxgl.Popup(
        {
          closeOnClick: false,
          closeButton: false,
          closeOnMove: false,
          anchor: 'left',
          offset: [20, -20]
        }
      ).setText(step.recurso.nombre);

      let el = document.createElement('div');
      el.className = 'route-marker';
      el.innerHTML = '<span><b>' + (index + 1) + '</b></span>'

      const marker = new Marker(el)
        .setLngLat([Number(step.recurso.longitud), Number(step.recurso.latitud)])
        .setPopup(popup)
        .addTo(this._map)
        .togglePopup();

      this._markers.push(marker);
    });

    this._fitBounds();
    this._drawPlanRoute();
  }


  private _fitBounds() {
    if (!this._markers) return;
    this._markers.forEach(marker => this._bounds.extend(marker.getLngLat()));
    this._map.fitBounds(this._bounds, {padding: 100});
  }

  private _drawPlanRoute() {
    this._routeSub$?.unsubscribe();
    this._clearMap();
    if (this._markers.length < 2) return;

    this._routeSub$ = this._planService.getPlanRoute(this._plan.id, this._profile)
      .subscribe({
        next: route => {
          if (!route?.routes) return;

          // Recursos
          this._map.addSource('route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: route.routes[0].geometry
            }
          });

          // Capa ruta
          this._map.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#000',
              'line-width': 10
            }
          });

          // Capa contorno
          this._map.addLayer({
            'id': 'outline',
            'type': 'line',
            'source': 'route',
            'layout': {},
            'paint': {
              'line-color': '#03a1fc',
              'line-width': 7
            }
          });
        },
        error: err => {
          console.error(err);
        }
      });
  }

  private _clearMap(): void {

    // Capas
    const layerNames: string[] = ['route', 'outline'];
    layerNames.forEach((name: string) => {
      const layer = this._map.getLayer(name);
      if (typeof layer !== 'undefined') this._map.removeLayer(name);
    });

    // Fuentes
    if (this._map.getSource('route')) this._map.removeSource('route');
  }

  public _onChangeMapStyleButtonClicked(): void {
    this._mapStyleIsDark = !this._mapStyleIsDark;
    if (this._mapStyleIsDark) this._map.setStyle('mapbox://styles/mapbox/navigation-night-v1');
    else this._map.setStyle('mapbox://styles/mapbox/navigation-day-v1');
  }

  public _onChangeMapRouteProfile(profile: string): void {
    this._profile = profile;
    this._drawPlanRoute();
  }

}

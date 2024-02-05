import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import mapboxgl, {LngLatBounds, LngLatLike, Map, MapMouseEvent} from 'mapbox-gl';
import {environment} from "@environments/environment";
import * as GeoJSON from 'geojson/geojson.js';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() public _resources$: Observable<any>
  @Input() public _loading$: Observable<boolean>;
  @Input() public _collection: string;
  @ViewChild('mapDiv') private _mapDivElement!: ElementRef;
  private readonly MAPBOX_TOKEN: string = environment.mapboxToken;
  private static _userLocation?: [number, number];
  private static _popup: mapboxgl.Popup;
  private static _selectResourceRef: any;
  private static _isAnyMarkerSelected: boolean = false;
  private _resourcesSub$: Subscription;
  private _loadingSub$: Subscription;
  private _map: Map;
  private _bounds: LngLatBounds;
  private _geoData: any;
  private _mapIsReady: boolean = false;
  private _clickOnMapCallbackRef: any;
  private _clickOnMarkerCallbackRef: any;
  private _clickOnClusterCallbackRef: any;
  private _mouseEnteredClusterCallbackRef: any;
  private _mouseLeftClusterCallbackRef: any;
  private _mouseEnteredMarkerCallbackRef: any;
  private _mouseLeftMarkerCallbackRef: any;
  public _isLoading: boolean;
  public _mapStyleIsDark: boolean = false;
  public _shouldKeepPopup: boolean = false;
  public _shouldFitBounds: boolean = true;

  ngOnInit(): void {

    this._loadingSub$ = this._loading$.subscribe({
      next: bool => this._isLoading = bool,
      error: _ => this._isLoading = false
    });

  }

  ngAfterViewInit(): void {
    this._initMap();

    this._resourcesSub$ = this._resources$.subscribe({
      next: res => {
        if (!res) return;
        if (!Object.keys(res).length) {
          MapComponent._flyTo(this._map, [-2.616667, 42.983333]).then(() => this._clearMap());
          return;
        }
        this._bounds = new LngLatBounds();
        this._geoData = GeoJSON.parse(res, {Point: ['latitud', 'longitud']});
        if (this._mapIsReady) this._setupLayers();
      },
      error: err => console.error(err)
    });
  }

  ngOnDestroy(): void {
    this._resourcesSub$?.unsubscribe();
    this._loadingSub$?.unsubscribe();
  }

  //////////////////////// MAP SETUP ////////////////////////

  private _initMap(): void {
    mapboxgl.accessToken = this.MAPBOX_TOKEN;

    this._map = new Map({
      attributionControl: false,
      logoPosition: 'bottom-right',
      container: this._mapDivElement.nativeElement,
      style: this._mapStyleIsDark ? 'mapbox://styles/mapbox/dark-v10' : 'mapbox://styles/mapbox/streets-v11',
      center: [-2.616667, 42.983333], // Euskadi
      pitch: 0,
      zoom: 7
    });

    let locateControl = new mapboxgl.GeolocateControl({
      positionOptions: {enableHighAccuracy: true},
      showUserHeading: true,
      showAccuracyCircle: true,
    });

    locateControl.on('geolocate', (object: any) => {
      const {coords} = object;
      MapComponent._userLocation = [coords.longitude, coords.latitude];
      MapComponent._popup?.setHTML(MapComponent._getPopupHTML());
    });

    locateControl.on('error', () => {
      MapComponent._userLocation = null;
      MapComponent._popup?.setHTML(MapComponent._getPopupHTML());
    });

    this._map.addControl(new mapboxgl.NavigationControl());
    this._map.addControl(new mapboxgl.FullscreenControl());
    this._map.addControl(locateControl);

    this._map.on('style.load', () => {

      this._map.getStyle().layers.forEach((layer) => {
        if (layer.id === 'poi-label') this._map.removeLayer(layer.id);
      });

      this._map.setFog({
        "range": [0.8, 15],
        "color": this._mapStyleIsDark ? "#1a1717" : "#00bfff",
        "horizon-blend": 0.5,
        // @ts-ignore
        "high-color": "#245bde",
        "space-color": "#000000",
        "star-intensity": this._mapStyleIsDark ? 0.75 : 0.15
      });

      const loading = () => {
        if (!this._map.isStyleLoaded() || !this._geoData) {
          setTimeout(loading, 200);
        } else {
          this._mapIsReady = true;
          this._setupLayers();
        }
      };
      loading();
    });
  }

  private _setupLayers(): void {

    this._clearMap();

    // Recursos
    this._map.addSource('resources', {
      type: "geojson",
      data: this._geoData,
      cluster: true,
      clusterMaxZoom: 12,
      clusterRadius: 60,
      generateId: true
    });

    // Capa clusters
    this._map.addLayer({
      id: 'clusters',
      type: 'circle',
      source: 'resources',
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': [
          'step',
          ['get', 'point_count'],
          '#51bbd6',
          100,
          '#f1f075',
          750,
          '#f28cb1'
        ],
        'circle-radius': [
          'step',
          ['get', 'point_count'],
          20,
          100,
          30,
          750,
          40
        ]
      }
    });

    // Capa contador cluster
    this._map.addLayer({
      id: 'cluster-count',
      type: 'symbol',
      source: 'resources',
      filter: ['has', 'point_count'],
      layout: {
        'text-field': '{point_count_abbreviated}',
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 12
      }
    });

    // Icono marcador
    let marker = new Image(1000, 1000);
    marker.onload = () => this._map.addImage('marker', marker);
    marker.src = `assets/images/map/${this._collection}-marker.svg`

    // Capa marcadores
    this._map.addLayer({
      id: 'unclustered-points',
      type: 'symbol',
      source: 'resources',
      filter: ["!has", "point_count"],
      layout: {
        'text-field': ['get', 'nombre'],
        'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
        'text-radial-offset': 1.50,
        'text-justify': 'auto',
        'icon-image': 'marker',
        "icon-size": ['match', ['get', 'id'], 0, 0.045, 0.035],
        "icon-allow-overlap": true,
      },
      paint: {
        'text-color': this._mapStyleIsDark ? "#FFF" : '#000',
      }
    });

    // Evento click en mapa
    this._map.on('click', this._clickOnMapCallbackRef = this._onMapClick.bind({map: this._map}));

    // Evento click en cluster
    this._map.on('click', 'clusters', this._clickOnClusterCallbackRef = this._onClusterClick.bind({map: this._map}))

    // Evento click marcador
    this._map.on('click', 'unclustered-points',
      this._clickOnMarkerCallbackRef = this._onMarkerClick.bind({map: this._map}));

    // Eventos cambio de cursor al entrar en clusters o marcadores
    this._map.on('mouseenter', 'clusters',
      this._mouseEnteredClusterCallbackRef = this._onMouseEnteredCluster.bind({map: this._map}));

    this._map.on('mouseleave', 'clusters',
      this._mouseLeftClusterCallbackRef = this._onMouseLeftCluster.bind({map: this._map}));

    this._map.on('mouseenter', 'unclustered-points',
      this._mouseEnteredMarkerCallbackRef = this._onMouseEnteredMarker.bind({map: this._map}));

    this._map.on('mouseleave', 'unclustered-points', this._mouseLeftMarkerCallbackRef = this._onMouseLeftMarker);

    // Mantiene el tamaño del marcador seleccionado después de cambiar el estilo del mapa
    if (MapComponent._selectResourceRef) {
      this._map.setLayoutProperty('unclustered-points', 'icon-size',
        ['match', ['get', 'id'], MapComponent._selectResourceRef.properties['id'], 0.045, 0.035]);
    }

    this._fitBounds();
  }

  //////////////////////// EVENTS ////////////////////////

  private _onMapClick(e: MapMouseEvent): void {
    // @ts-ignore
    const map: Map = this.map;
    const features: any = map.queryRenderedFeatures(e.point, {layers: ['unclustered-points']});

    if (!features.length) {
      MapComponent._selectResourceRef = null;
      MapComponent._isAnyMarkerSelected = false;
      map.setLayoutProperty('unclustered-points', 'icon-size', ['match', ['get', 'id'], 0, 0.045, 0.035]);
      return;
    }
  }

  private _onClusterClick(e: MapMouseEvent): void {
    // @ts-ignore
    const map: Map = this.map;
    const features: any = map.queryRenderedFeatures(e.point, {layers: ['clusters']});
    if (!features.length) return;
    const clusterId: number = features[0].properties['cluster_id'];
    const source: mapboxgl.GeoJSONSource = map.getSource('resources') as mapboxgl.GeoJSONSource;

    source.getClusterExpansionZoom(
      clusterId,
      (err, zoom) => {
        if (err) return;
        map.easeTo({
          center: features[0].geometry['coordinates'],
          zoom: zoom
        });
      }
    );
  }

  private _onMarkerClick(e: MapMouseEvent): void {
    // @ts-ignore
    const map: Map = this.map;
    const features: any = map.queryRenderedFeatures(e.point, {layers: ['unclustered-points']});

    if (!features.length) {
      map.setLayoutProperty('unclustered-points', 'icon-size', ['match', ['get', 'id'], 0, 0.045, 0.035]);
      return;
    }

    const feature: any = features[0];
    map.setLayoutProperty('unclustered-points', 'icon-size', ['match', ['get', 'id'], feature.properties['id'], 0.045, 0.035]);
    MapComponent._isAnyMarkerSelected = true;
    feature.properties['imagenes'] = JSON.parse(feature.properties['imagenes']);
    MapComponent._selectResourceRef = feature;
    MapComponent._popup?.remove();
    MapComponent._setPopup(feature);

    MapComponent._flyTo(map, feature.geometry['coordinates']).then(() => {
      MapComponent._popup.addTo(map);
    });
  }

  public _onMouseEnteredCluster(): void {
    // @ts-ignore
    const map: Map = this.map;
    map.getCanvas().style.cursor = 'pointer'
  }

  public _onMouseLeftCluster(): void {
    // @ts-ignore
    const map: Map = this.map;
    map.getCanvas().style.cursor = ''
  }

  public _onMouseEnteredMarker(e: MapMouseEvent): void {
    // @ts-ignore
    const map: Map = this.map;
    map.getCanvas().style.cursor = 'pointer';
    const features: any = map.queryRenderedFeatures(e.point, {layers: ['unclustered-points']});
    if (!features.length || MapComponent._isAnyMarkerSelected) return
    const feature: any = features[0];
    feature.properties['imagenes'] = JSON.parse(feature.properties['imagenes']);
    MapComponent._selectResourceRef = feature;
    MapComponent._popup?.remove();
    MapComponent._setPopup(feature);
    MapComponent._popup.addTo(map)
  }

  public _onMouseLeftMarker(): void {
    if (MapComponent._isAnyMarkerSelected) return;
    MapComponent._selectResourceRef = null;
    MapComponent._popup?.remove();
  }

  //////////////////////// UTILITIES ////////////////////////

  private static _flyTo(map: Map, coords: LngLatLike): Promise<void> {
    return new Promise<void>((resolve, _) => {
      map.flyTo({
          zoom: map.getZoom(),
          center: coords,
          essential: true
        }
      );
      resolve();
    });
  }

  private static _getPopupHTML(): string | any {

    if (!MapComponent._selectResourceRef) return;

    const collectionName = MapComponent._selectResourceRef.properties['coleccion'];
    const resourceCode = MapComponent._selectResourceRef.properties['codigo'];

    const imgSource = MapComponent._selectResourceRef.properties['imagenes'][0]
      ? MapComponent._selectResourceRef.properties['imagenes'][0]['fuente']
      : `assets/images/generic-${collectionName}.jpg`;

    const imgAlt =
      MapComponent._selectResourceRef.properties['imagenes'][0] ?
        MapComponent._selectResourceRef.properties['imagenes'][0]['titulo'] : '' ?
          MapComponent._selectResourceRef.properties['imagenes'][0]['titulo'] : '';

    let distance;

    if (MapComponent._userLocation) {
      distance = MapComponent._calcDistance(
        MapComponent._selectResourceRef.geometry['coordinates'][1],
        MapComponent._selectResourceRef.geometry['coordinates'][0],
        MapComponent._userLocation[1],
        MapComponent._userLocation[0]
      );
      distance = distance + ' ' + 'km';
    }

    let html = String(`
          <div class="card map-card shadow-lg">
                <img class="card-img-top map-card-img-top text-light text-center"
                src='${imgSource}'
                onerror="this.onerror=null; this.src='assets/images/generic-${collectionName}.jpg'"
                alt='${imgAlt}'>
                <div class="card-body map-card-body">
                    <h6 class="card-title map-card-title">${MapComponent._selectResourceRef.properties['nombre'] ?? ''}</h6>
                    <p class="card-text text-secondary lh-sm my-1" >${MapComponent._selectResourceRef.properties['nombre_subtipo_recurso'] ?? ''}</p>
                    <p class="card-text text-primary mb-0">${MapComponent._selectResourceRef.properties['nombre_provincia'] ?? ''}</p>
                    <p class="card-text text-primary mb-1">${MapComponent._selectResourceRef.properties['nombre_municipio'] ?? ''}</p>
        `);

    if (distance) {
      let htmlChunk2 = String(`
            <p class="card-text map-card-text mt-0 mb-2">
               <i class="bi bi-geo-alt-fill me-1"></i>
               ${distance}
            </p>
          `);
      html += htmlChunk2;
    }

    let htmlChunk3 = String(`
                     <a role="button"
                     href="${'/resource/' + collectionName + '/' + resourceCode}"
                     class="btn btn-sm btn-primary mt-1 w-100">Ver detalles
                     </a>
                </div>
            </div>
        `);
    html += htmlChunk3;

    return html;
  }

  private static _setPopup(feature: any): void {

    MapComponent._popup = new mapboxgl.Popup(
      {
        closeOnClick: true,
        closeButton: false,
        closeOnMove: false,
        offset: 30,
        anchor: window.innerWidth > 480 ? "left" : "bottom",
        className: 'map-popup'
      }).setLngLat(feature.geometry['coordinates']);

    MapComponent._popup.setHTML(MapComponent._getPopupHTML());
  }

  public static _calcDistance(lat1: number, lon1: number, lat2: number, lon2: number): string {
    if ((lat1 == lat2) && (lon1 == lon2)) {
      return '0';
    } else {
      const radlat1: number = Math.PI * lat1 / 180;
      const radlat2: number = Math.PI * lat2 / 180;
      const theta: number = lon1 - lon2;
      const radtheta: number = Math.PI * theta / 180;
      let dist: number = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) dist = 1;
      dist = Math.acos(dist);
      dist = dist * 180 / Math.PI;
      dist = dist * 60 * 1.1515;
      dist = dist * 1.609344
      return dist.toFixed(2);
    }
  }

  private _fitBounds(): void {
    if (!this._geoData || !this._map) return;
    if (this._shouldFitBounds) {
      this._geoData.features.forEach((feature: any) => this._bounds.extend(feature.geometry.coordinates));
      this._map.fitBounds(this._bounds, {padding: 100});
    }
    this._shouldFitBounds = true;
  }

  private _clearMap(): void {

    // Popup
    if (!this._shouldKeepPopup) MapComponent._popup?.remove();
    this._shouldKeepPopup = false;

    // Eventos
    this._map.off('click', this._clickOnMapCallbackRef);
    this._map.off('click', 'clusters', this._clickOnClusterCallbackRef);
    this._map.off('click', 'unclustered-points', this._clickOnMarkerCallbackRef);
    this._map.off('mouseenter', 'clusters', this._mouseEnteredClusterCallbackRef);
    this._map.off('mouseleave', 'clusters', this._mouseLeftClusterCallbackRef);
    this._map.off('mouseenter', 'unclustered-points', this._mouseEnteredMarkerCallbackRef);
    this._map.off('mouseleave', 'unclustered-points', this._mouseLeftMarkerCallbackRef);

    // Capas
    const layerNames: string[] = ['clusters', 'cluster-count', 'unclustered-points'];
    layerNames.forEach((name: string) => {
      const layer = this._map.getLayer(name);
      if (typeof layer !== 'undefined') this._map.removeLayer(name);
    });

    // Imágenes
    if (this._map.hasImage('marker')) this._map.removeImage('marker');

    // Fuentes
    if (this._map.getSource('resources')) this._map.removeSource('resources');
  }

  public _onChangeMapStyleButtonClicked(): void {
    this._mapStyleIsDark = !this._mapStyleIsDark;
    this._shouldFitBounds = !this._shouldFitBounds;
    this._shouldKeepPopup = !this._shouldKeepPopup;
    if (this._mapStyleIsDark) this._map.setStyle('mapbox://styles/mapbox/dark-v10');
    else this._map.setStyle('mapbox://styles/mapbox/streets-v11');
  }

}

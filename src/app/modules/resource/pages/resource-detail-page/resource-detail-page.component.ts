import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CollectionsService} from "@shared/services/collections.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-resource-detail-page',
  templateUrl: './resource-detail-page.component.html',
  styleUrls: ['./resource-detail-page.component.css']
})
export class ResourceDetailPageComponent implements OnInit, OnDestroy {

  private _tipoCarousel: string;
  private _codigo_num: number;
  public _imgGeneric: string;
  private _resourceSub$: Subscription;
  public _resource: any;

  public _responsiveOptions: any[] = [
    {breakpoint: '1024px', numVisible: 5},
    {breakpoint: '768px', numVisible: 3},
    {breakpoint: '560px', numVisible: 1}
  ];

  constructor(private _route: ActivatedRoute, private _router: Router, private _collService: CollectionsService) {
  }

  ngOnInit(): void {
    this._tipoCarousel = this._route.snapshot.url[0].path;
    this._codigo_num = +this._route.snapshot.url[1].path;

    switch (this._tipoCarousel) {

      case 'accommodation':
        this._resourceSub$ = this._collService.getAccommodation(this._codigo_num, this.getLang()).subscribe({
          next: resource => {
            this._resource = resource;
            this._imgGeneric = "generic-accommodation.jpg";
          }, error: err => console.error(err)
        })
        break;

      case 'cave':
        this._resourceSub$ = this._collService.getCave(this._codigo_num, this.getLang()).subscribe({
          next: resource => {
            this._resource = resource;
            this._imgGeneric = "gereic-cave.jpg";
          }, error: err => console.error(err)
        })
        break;

      case 'cultural':
        this._resourceSub$ = this._collService.getCultural(this._codigo_num, this.getLang()).subscribe({
          next: resource => {
            this._resource = resource;
            this._imgGeneric = "generic-cultural.jpg";
          }, error: err => console.error(err)
        })
        break;

      case 'event':
        this._resourceSub$ = this._collService.getEvent(this._codigo_num, this.getLang()).subscribe({
          next: resource => {
            this._resource = resource;
            this._imgGeneric = "generic-event.jpg";
          }, error: err => console.error(err)
        })
        break;

      case 'fair':
        this._resourceSub$ = this._collService.getFair(this._codigo_num, this.getLang()).subscribe({
          next: resource => {
            this._resource = resource;
            this._imgGeneric = "generic-fair.jpg";
          }, error: err => console.error(err)
        })
        break;

      case 'locality':
        this._resourceSub$ = this._collService.getLocality(this._codigo_num, this.getLang()).subscribe({
          next: resource => {
            this._resource = resource;
            this._imgGeneric = "generic-locality.jpg";
          }, error: err => console.error(err)
        })
        break;

      case 'museum':
        this._resourceSub$ = this._collService.getMuseum(this._codigo_num, this.getLang()).subscribe({
          next: resource => {
            this._resource = resource;
            this._imgGeneric = "generic-museum.jpg";
          }, error: err => console.error(err)
        })
        break;

      case 'natural':
        this._resourceSub$ = this._collService.getNatural(this._codigo_num, this.getLang()).subscribe({
          next: resource => {
            this._resource = resource;
            this._imgGeneric = "generic-natural.jpg";
          }, error: err => console.error(err)
        })
        break;

      case 'restaurant':
        this._resourceSub$ = this._collService.getRestaurant(this._codigo_num, this.getLang()).subscribe({
          next: resource => {
            this._resource = resource;
            this._imgGeneric = "generic-restaurant.jpg";
          }, error: err => console.error(err)
        })
        break;
    }
  }

  ngOnDestroy(): void {
    this._resourceSub$?.unsubscribe();
  }

  public getLang(): string {
    return localStorage.getItem('lang') ?? 'es';
  }
}

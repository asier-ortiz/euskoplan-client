import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {CollectionsService} from "@shared/services/collections.service";
import {finalize, Observable, Subscription} from "rxjs";
import {LocalityNameModel} from "@core/models/locality.name.model";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Sidebar} from "primeng/sidebar";

@Component({
  selector: 'app-form-filter',
  templateUrl: './form-filter.component.html',
  styleUrls: ['./form-filter.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class FormFilterComponent implements OnInit, OnDestroy {

  @Input() _collection: string;
  @Output() formFilterCallback: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('sidebar') sidebar!: Sidebar;
  private _categoriesSub$: Subscription;
  private _localitiesSub$: Subscription;
  private _categoryObservable: Observable<any>;
  public _formFilter: FormGroup;
  public _displaySidebar: boolean = false;
  public _provinces: any[] = [];
  public _categories: any[];
  public _localities: any[] = [];
  public _selectedProvince: any;
  public _selectedLocality: any;
  public _selectedCategory: any;
  public _startDate: any;
  public _endDate: any;
  public _isLoadingLocalities: boolean = true;
  public _isLoadingCategories: boolean = true;

  constructor(private _collectionsService: CollectionsService, private _formBuilder: FormBuilder) {
    this._provinces = [{name: 'Araba/Álava'}, {name: 'Gipuzkoa'}, {name: 'Bizkaia'}];
  }

  ngOnInit(): void {

    this._formFilter = this._formBuilder.group({
      province: new FormControl(null, []),
      locality: new FormControl(null, []),
      category: new FormControl(null, []),
      startDate: new FormControl(null, []),
      endDate: new FormControl(null, []),
    });

    let query: Record<string, string> = {};
    query['idioma'] = 'es';
    this._localitiesSub$ = this._collectionsService.getLocalityNames(query)
      .pipe(
        finalize(() => this._isLoadingLocalities = false)
      )
      .subscribe({
        next: (localityNames: LocalityNameModel[]) => {
          this._localities.push(...localityNames.map(locality => {
            return {'name': locality.nombre}
          }))
        },
        error: err => console.error(err)
      });

    this.setCategoryObservable();
    if (!this._categoryObservable) {
      this._isLoadingCategories = false;
      return;
    }
    this._categories = [];
    this._categoriesSub$ = this._categoryObservable?.pipe(
      finalize(() => this._isLoadingCategories = false))
      .subscribe({
        next: categories => {
          if (this._collection == 'naturals') {
            this._categories.push(...categories['espacio_natural'].map(category => {
              return {
                'name': category.nombre_subtipo_recurso_espacio_natural,
                'subtype': 'nombre_subtipo_recurso_espacio_natural'
              };
            }));
            this._categories.push(...categories['playas_pantanos_rios'].map(category => {
              return {
                'name': category.nombre_subtipo_recurso_playas_pantanos_rios,
                'subtype': 'nombre_subtipo_recurso_playas_pantanos_rios'
              };
            }));
          } else {
            this._categories.push(...categories.map(category => {
              return {'name': category.nombre_subtipo_recurso, 'subtype': 'nombre_subtipo_recurso'};
            }));
          }
        },
        error: err => console.error(err)
      });
  }

  ngOnDestroy(): void {
    this._categoriesSub$?.unsubscribe();
    this._localitiesSub$?.unsubscribe();
  }

  private setCategoryObservable() {

    switch (this._collection) {
      case 'accommodations':
        this._categoryObservable = this._collectionsService.getAccommodationCategories('es');
        break
      case 'caves':
        this._categoryObservable = this._collectionsService.getCaveCategories('es');
        break
      case 'culturals':
        this._categoryObservable = this._collectionsService.getCulturalCategories('es');
        break
      case 'events':
        this._categoryObservable = this._collectionsService.getEventCategories('es');
        break
      case 'naturals':
        this._categoryObservable = this._collectionsService.getNaturalCategories('es');
        break
      case 'museums':
        this._categoryObservable = this._collectionsService.getMuseumCategories('es');
        break
      case 'restaurants':
        this._categoryObservable = this._collectionsService.getRestaurantCategories('es');
        break
    }
  }

  public _showHideModal() {
    this._displaySidebar = !this._displaySidebar;
  }

  public _clear(value: string) {
    if (value == 'all') {
      this._selectedProvince = null;
      this._selectedLocality = null;
      this._selectedCategory = null;
      this._startDate = null;
      this._endDate = null;
    }
    if (value == 'province') this._selectedProvince = null;
    if (value == 'locality') this._selectedLocality = null;
    if (value == 'category') this._selectedCategory = null;
    if (value == 'startDate') this._startDate = null;
    if (value == 'endDate') this._endDate = null;
  }

  public _resetForm() {
    this._clear('all');
    this._formFilter.reset();
    this._onFormFilterSubmit();
  }

  public _onFormFilterSubmit() {
    const {category, locality, province, startDate, endDate} = this._formFilter.getRawValue();

    const formData: any = {
      category: category ?? null,
      locality: locality ?? null,
      province: province ?? null,
      startDate: startDate ? startDate.toLocaleDateString('eu-ES') : null,
      endDate: endDate ? endDate.toLocaleDateString('eu-ES') : null
    }

    this._displaySidebar = false;
    this.formFilterCallback.emit(formData);
  }

  public _getFilterCount() {
    let count = 0;
    if (this._selectedProvince) count++;
    if (this._selectedLocality) count++;
    if (this._selectedCategory) count++;
    if (this._startDate) count++;
    if (this._endDate) count++;
    return count.toString()
  }

  public _getFromDateString() {
    return 'Desde ' + this._startDate.toLocaleDateString();
  }

  public _getToDateString() {
    return 'Hasta ' + this._endDate.toLocaleDateString();
  }

}

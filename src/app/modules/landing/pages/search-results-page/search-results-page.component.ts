import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {finalize, forkJoin, Observable, Subscription} from "rxjs";
import {PlansService} from "@shared/services/plans.service";
import {CollectionsService} from "@shared/services/collections.service";
import {MenuItem} from "primeng/api";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-search-results-page',
  templateUrl: './search-results-page.component.html',
  styleUrls: ['./search-results-page.component.css']
})
export class SearchResultsPageComponent implements OnInit, OnDestroy {

  private _searchSub$: Subscription;
  private _searchResultsSub$: Subscription;
  private _searchResults: Record<string, any[]> = {};
  public _formSearch: FormGroup;
  public _searchInput: string | null;
  public _isLoading: boolean = true;
  public _menuItems: MenuItem[] = [];
  public _activeItem: MenuItem;
  public _activeCollection: any[];

  constructor(private _collectionsService: CollectionsService,
              private _planService: PlansService,
              private _activatedRoute: ActivatedRoute,
              private _router: Router,
              private _formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this._router.routeReuseStrategy.shouldReuseRoute = () => false;

    this._formSearch = this._formBuilder.record({
      searchInput: new FormControl(null, [
        Validators.required,
        Validators.minLength(1)
      ])
    });

    this._searchSub$ = this._activatedRoute.queryParamMap.subscribe((params: ParamMap) => {
      this._searchInput = params.get('q');
      if (!this._searchInput) return;
      this._isLoading = true;

      this._searchResultsSub$ = this._fetchSearchResults('es')
        .pipe(
          finalize(() => this._isLoading = false)
        )
        .subscribe({
          next: ([r1, r2, r3, r4, r5, r6, r7, r8, r9, r10]) => {
            if (r1.length > 0) this._searchResults['Planes'] = r1;
            if (r2.length > 0) this._searchResults['Alojamientos'] = r2;
            if (r3.length > 0) this._searchResults['Restos arqueológicos'] = r3;
            if (r4.length > 0) this._searchResults['Recursos culturales'] = r4;
            if (r5.length > 0) this._searchResults['Eventos'] = r5;
            if (r6.length > 0) this._searchResults['Parques temáticos'] = r6;
            if (r7.length > 0) this._searchResults['Localidades'] = r7;
            if (r8.length > 0) this._searchResults['Museos'] = r8;
            if (r9.length > 0) this._searchResults['Espacios naturales'] = r9;
            if (r10.length > 0) this._searchResults['Restaurantes'] = r10;

            if (Object.keys(this._searchResults).length) {
              this._menuItems = Array.from(Object.keys(this._searchResults), (collectionName: string) => ({label: collectionName}));
              this._menuItems = this._menuItems.sort((a, b) => (a.label < b.label ? -1 : 1))
              const firstItem = this._menuItems[0].label;
              const index = this._menuItems.findIndex(value => value.label == firstItem);
              this._activeItem = this._menuItems[index];
              this._activeCollection = this._searchResults[this._activeItem.label];
            }
          },
          error: err => console.error(err)
        });
    });
  }

  ngOnDestroy(): void {
    this._searchSub$?.unsubscribe();
    this._searchResultsSub$?.unsubscribe();
  }

  public _onTabClick(tabName: string) {
    const index = this._menuItems.findIndex(value => value.label == tabName)
    this._activeItem = this._menuItems[index]
    this._activeCollection = this._searchResults[this._activeItem.label];
  }

  private _fetchSearchResults(language: string): Observable<any[]> {
    this._searchInput = this._searchInput.split('+').join(' ');
    let query: Record<string, string> = {};
    query['idioma'] = language;
    query['titulo'] = this._searchInput;
    query['indicaciones_pasos'] = this._searchInput;
    query['busqueda'] = this._searchInput;

    return forkJoin([
      this._planService.getPlansSearching(query),
      this._collectionsService.getAccommodationsSearching(query),
      this._collectionsService.getCavesSearching(query),
      this._collectionsService.getCulturalsSearching(query),
      this._collectionsService.getEventsSearching(query),
      this._collectionsService.getFairsSearching(query),
      this._collectionsService.getLocalitiesSearching(query),
      this._collectionsService.getMuseumsSearching(query),
      this._collectionsService.getNaturalsSearching(query),
      this._collectionsService.getRestaurantsSearching(query)
    ]);
  }

  public _onFormSearchSubmit() {
    let {searchInput} = this._formSearch.getRawValue();
    searchInput = searchInput.trim();
    if (searchInput) searchInput = searchInput.split(' ').join('+');
    this._router.navigate(
      ['/', 'search'],
      {queryParams: {q: searchInput}}
    );
  }
}

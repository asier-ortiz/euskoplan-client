import {Injectable} from '@angular/core';
import {environment} from "@environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FavouritesService {

  private readonly API_URL: string = environment.api_url;

  constructor(private _httpClient: HttpClient) {
  }

  //////////////////////// FAVOURITES ////////////////////////

  getFavourites(): Observable<any> {
    return this._httpClient.get<any>(`${this.API_URL}/favourite`);
  }

  saveFavourite(data): Observable<any> {
    return this._httpClient.post<any>(`${this.API_URL}/favourite`, data);
  }

  deleteFavourite(id: number): Observable<any> {
    return this._httpClient.delete<any>(`${this.API_URL}/favourite/${id}`);
  }

}

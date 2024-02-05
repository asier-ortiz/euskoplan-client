import {Injectable} from '@angular/core';
import {environment} from "@environments/environment";
import {HttpClient} from "@angular/common/http";
import {UserModel} from "@core/models/user.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly API_URL: string = environment.api_url;
  public user: UserModel = null;

  constructor(private _httpClient: HttpClient) {
  }

  //////////////////////// USER ////////////////////////

  public register(data): Observable<UserModel> {
    return this._httpClient.post<UserModel>(`${this.API_URL}/user/register`, data);
  }

  public login(data): Observable<any> {
    return this._httpClient.post(`${this.API_URL}/user/login`, data);
  }

  public logout(): Observable<void> {
    return this._httpClient.post<void>(`${this.API_URL}/user/logout`, {});
  }

  public getUser(): Observable<UserModel> {
    return this._httpClient.get<UserModel>(`${this.API_URL}/user/user`);
  }

  public updateUser(data): Observable<UserModel> {
    return this._httpClient.put<UserModel>(`${this.API_URL}/user/password`, data);
  }

  public deleteUser(data): Observable<void> {
    return this._httpClient.delete<void>(`${this.API_URL}/user/destroy`);
  }

  public findUserByUsername(username: string): Observable<any> {
    return this._httpClient.get<any>(`${this.API_URL}/user/find/username/` + username);
  }

  public findUserByEmail(email: string): Observable<any> {
    return this._httpClient.get<any>(`${this.API_URL}/user/find/email/` + email);
  }

  //////////////////////// ACCOUNT ////////////////////////

  public sendAccountRegistrationEmail(data) {
    return this._httpClient.post(`${this.API_URL}/account/sendEmail`, data);
  }

  public getAccountRegistrationUser(token: string): Observable<any> {
    return this._httpClient.get<any>(`${this.API_URL}/account/find/` + token);
  }

  public verifyAccount(data): Observable<any> {
    return this._httpClient.post<any>(`${this.API_URL}/account/verify`, data);
  }

  //////////////////////// PASSWORD ////////////////////////

  public sendPasswordResetEmail(data): Observable<any> {
    return this._httpClient.post<any>(`${this.API_URL}/password/sendEmail`, data);
  }

  public getPasswordResetUser(token: string): Observable<any> {
    return this._httpClient.get<any>(`${this.API_URL}/password/find/` + token);
  }

  public resetPassword(data): Observable<any> {
    return this._httpClient.post<any>(`${this.API_URL}/password/reset`, data);
  }

}

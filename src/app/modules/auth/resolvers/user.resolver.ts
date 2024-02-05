import {Injectable} from '@angular/core';
import {Resolve, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import {catchError, map, Observable, of} from 'rxjs';
import {AuthService} from "@shared/services/auth.service";
import {HttpErrorResponse} from "@angular/common/http";
import {UserModel} from "@core/models/user.model";

@Injectable({
  providedIn: 'root'
})
export class UserResolver implements Resolve<UserModel | Observable<UserModel> | Observable<unknown>> {

  constructor(private _authService: AuthService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): UserModel | Observable<UserModel> | Observable<unknown> {
    return this._authService.getUser().pipe(
      map(user => ({user})),
      catchError((_: HttpErrorResponse) => {
        return of(null);
      }));
  }
}

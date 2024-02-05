import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from "@shared/services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class SessionGuard implements CanActivate {

  constructor(private _authService: AuthService, private _router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return new Observable(subscriber => {
      this._authService.getUser().subscribe({
        next: user => {
          this._authService.user = user;
          return subscriber.next(true);
        },
        error: _ => {
          return subscriber.next(this._router.createUrlTree(['/', 'auth']));
        }
      });
    });
  }
}

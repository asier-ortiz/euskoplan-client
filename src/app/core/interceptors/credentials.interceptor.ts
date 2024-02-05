import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import {catchError, throwError, Observable} from 'rxjs';
import {Router} from "@angular/router";

@Injectable()
export class CredentialsInterceptor implements HttpInterceptor {

  constructor(private _router: Router) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const req = request.clone({
      withCredentials: true
    });

    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          this._router.createUrlTree(['/', 'auth']);
        }
        return throwError(err);
      })
    );

  }
}

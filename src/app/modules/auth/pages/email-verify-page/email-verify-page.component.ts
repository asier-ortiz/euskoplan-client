import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "@shared/services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-email-verify-page',
  templateUrl: './email-verify-page.component.html',
  styleUrls: ['./email-verify-page.component.css']
})
export class EmailVerifyPageComponent implements OnInit, OnDestroy {

  public _displayModal: boolean = false;
  private _token: string;
  private _email: string;
  private _userAccountSub$: Subscription;
  private _verifyAccountSub$: Subscription;

  constructor(private _authService: AuthService,
              private _router: Router,
              private _route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this._route.queryParams.subscribe(params => {
      const {token} = params
      if (!token) this._navigateToLogin();
      this._token = token;
      this._userAccountSub$ = this._authService.getAccountRegistrationUser(this._token).subscribe({
        next: res => {
          const {email, token} = res;
          this._email = email;
          this._token = token;
          this._verifyAccountSub$ = this._authService.verifyAccount({
            email: this._email,
            token: this._token
          }).subscribe({
            next: _ => this._displayModal = true,
            error: _ => this._router.navigate(['/auth/login'], {
              state: {
                data: {
                  email: email,
                  emailTokenExpiredError: 'El enlace ha expirado. Te hemos reenviado otro correo electrónico para que verifiques tu cuenta'
                }
              }
            })
          });
        },
        // Token no válido
        error: _ => this._router.navigate(['/auth/login'], {
          state: {
            data: {
              emailTokenInvalidError: 'El enlace no es válido. Vuelve a iniciar sesión para que te reenviemos el correo de verificación de cuenta'
            }
          }
        })
      });
    });
  }

  ngOnDestroy(): void {
    this._userAccountSub$?.unsubscribe();
    this._verifyAccountSub$?.unsubscribe();
  }

  public _navigateToLogin() {
    this._router.navigate(['/auth/login']);
  }

}

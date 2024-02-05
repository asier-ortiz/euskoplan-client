import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "@shared/services/auth.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {passwordMatchValidator} from "@modules/auth/helpers/auth.helpers";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-password-reset-page',
  templateUrl: './password-reset-page.component.html',
  styleUrls: ['./password-reset-page.component.css']
})
export class PasswordResetPageComponent implements OnInit, OnDestroy {

  public _formPasswordChange: FormGroup;
  public _formBeingSubmitted: boolean = false;
  public _passwordTextFieldType: boolean;
  public _passwordConfirmTextFieldType: boolean;
  public _displayModal: boolean = false;
  private email: string;
  private token: string;
  private _getPasswordSub$: Subscription;
  private _resetPasswordSub$: Subscription;

  constructor(private _authService: AuthService,
              private _formBuilder: FormBuilder,
              private _router: Router,
              private _route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this._formPasswordChange = this._formBuilder.group({
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6)
      ]),
      passwordConfirmation: new FormControl(null, [
        Validators.required
      ])
    }, {
      validators: passwordMatchValidator('password', 'passwordConfirmation')
    });

    this._route.queryParams.subscribe(params => {
      const {token} = params
      if (!token) this._navigateToLogin()
      this.token = token;
      this._getPasswordSub$ = this._authService.getPasswordResetUser(this.token).subscribe({
        next: res => {
          const {email, token} = res;
          this.email = email;
          this.token = token;
        },
        error: _ => this._router.navigate(['/auth/login'], {
          state: {
            data: {
              passwordTokenExpiredError: 'Vuelve a solicitar el reinicio de contraseña. El enlace ha expirado'
            }
          }
        })
      });
    });
  }

  ngOnDestroy(): void {
    this._getPasswordSub$?.unsubscribe();
    this._resetPasswordSub$?.unsubscribe();
  }

  public _onPasswordChangeFormSummit() {
    this._formBeingSubmitted = true;
    const {password, passwordConfirmation} = this._formPasswordChange.value;
    const data = {
      email: this.email,
      password: password,
      password_confirm: passwordConfirmation,
      token: this.token
    };
    this._resetPasswordSub$ = this._authService.resetPassword(data)
      .subscribe({
        next: _ => this._displayModal = true,
        error: _ => {
          this._formBeingSubmitted = false;
          this._router.navigate(['/auth/login'], {
            state: {
              data: {
                passwordTokenExpiredError: 'Vuelve a solicitar el reinicio de contraseña. El enlace ha expirado'
              }
            }
          })
        }
      });
  }

  public _navigateToLogin() {
    this._router.navigate(['/auth/login']);
  }

  public _togglePasswordTextFieldType() {
    this._passwordTextFieldType = !this._passwordTextFieldType;
  }

  public _togglePasswordConfirmTextFieldType() {
    this._passwordConfirmTextFieldType = !this._passwordConfirmTextFieldType;
  }

}

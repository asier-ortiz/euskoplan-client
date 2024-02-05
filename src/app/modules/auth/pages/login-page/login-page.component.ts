import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "@shared/services/auth.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {MessageService} from "primeng/api";
import {showToast} from "@shared/helpers/shared.helpers";
import {finalize, Subscription} from "rxjs";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit, OnDestroy, AfterViewInit {

  public _formLogin: FormGroup;
  public _formBeingSubmitted: boolean = false;
  public _passwordTextFieldType: boolean;
  public _displayModal: boolean = false;
  private _loginSub$: Subscription;
  private _userSub$: Subscription;
  private _emailSub$: Subscription;
  public _isLoading: boolean = true;

  constructor(private _authService: AuthService,
              private _formBuilder: FormBuilder,
              private _router: Router,
              private _activatedRoute: ActivatedRoute,
              private _messageService: MessageService) {
  }

  ngOnInit(): void {

    if (this._activatedRoute.snapshot.data['user']) this._router.navigate(['/']);
    else this._isLoading = !this._isLoading;

    this._formLogin = this._formBuilder.group({
      email: new FormControl(null, [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl(null, [
        Validators.required
      ])
    });
  }

  ngAfterViewInit(): void {
    const emailTokenExpiredError = history.state.data?.emailTokenExpiredError;
    const email = history.state.data?.email;
    setTimeout(() => {
      if (emailTokenExpiredError && email) {
        showToast(this._messageService, 'error', 'Error', emailTokenExpiredError);
        this._resendVerificationEmail(email);
      }
    }, 1_000);

    const emailTokenInvalidError = history.state.data?.emailTokenInvalidError;
    setTimeout(() => {
      if (emailTokenInvalidError)
        showToast(this._messageService, 'error', 'Error', emailTokenInvalidError);
    }, 1_000);

    const passwordTokenExpiredError = history.state.data?.passwordTokenExpiredError;
    setTimeout(() => {
      if (passwordTokenExpiredError)
        showToast(this._messageService, 'error', 'Error', passwordTokenExpiredError);
    }, 1_000);
  }

  ngOnDestroy(): void {
    this._loginSub$?.unsubscribe();
    this._userSub$?.unsubscribe();
    this._emailSub$?.unsubscribe();
  }

  public _onLoginFormSubmit() {
    this._formBeingSubmitted = true;
    this._loginSub$ = this._authService.login(this._formLogin.getRawValue())
      .subscribe({
        next: _ => this._router.navigate(['/']).then(() => this._formBeingSubmitted = false),
        error: err => {
          this._formBeingSubmitted = false;
          if (err.status === 403) {
            this._formBeingSubmitted = false;
            this._displayModal = true;
          } else {
            showToast(this._messageService, 'error', 'Error', 'Email o contraseña incorrectos');
          }
        }
      });
  }

  public _onClickResendVerificationEmailButton() {
    const {email} = this._formLogin.value;
    this._resendVerificationEmail(email);
  }

  private _resendVerificationEmail(email: string) {
    this._emailSub$ = this._authService.sendAccountRegistrationEmail({email: email})
      .pipe(finalize(() => this._displayModal = false))
      .subscribe({
        error: _ => {
          this._displayModal = false;
          showToast(this._messageService, 'error', 'Error',
            'No se ha podido reenviar el email de confirmación. Inténtalo de nuevo más tarde');
        }
      });
  }

  public _togglePasswordTextFieldType() {
    this._passwordTextFieldType = !this._passwordTextFieldType;
  }

}

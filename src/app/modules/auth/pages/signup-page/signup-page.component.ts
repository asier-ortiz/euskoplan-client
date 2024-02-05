import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "@shared/services/auth.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {BehaviorSubject, debounceTime, Subscription} from "rxjs";
import {MessageService} from "primeng/api";
import {passwordMatchValidator} from "@modules/auth/helpers/auth.helpers";
import {showToast} from "@shared/helpers/shared.helpers";

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.css']
})
export class SignupPageComponent implements OnInit, OnDestroy {

  public _formSignup: FormGroup;
  public _formBeingSubmitted: boolean = false;
  public _displayModal: boolean = false;
  public _passwordTextFieldType: boolean;
  public _passwordConfirmTextFieldType: boolean;
  public _emailIsAvailable$ = new BehaviorSubject<boolean>(true);
  public _emailHasBeenValidated$ = new BehaviorSubject<boolean>(false);
  public _usernameIsAvailable$ = new BehaviorSubject<boolean>(true);
  public _usernameHasBeenValidated$ = new BehaviorSubject<boolean>(false);
  private _usernameInputSub$: Subscription
  private _emailInputSub$: Subscription
  private _findUsernameSub$: Subscription
  private _findEmailSub$: Subscription

  constructor(private _authService: AuthService,
              private _formBuilder: FormBuilder,
              private _router: Router,
              private _messageService: MessageService) {
  }

  ngOnInit(): void {

    this._formSignup = this._formBuilder.group({
      username: new FormControl(null, [
        Validators.required,
        Validators.minLength(3)
      ]),
      email: new FormControl(null, [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6)
      ]),
      passwordConfirmation: new FormControl(null, [
        Validators.required,
      ])
    }, {
      validators: passwordMatchValidator('password', 'passwordConfirmation')
    });

    this._usernameInputSub$ = this._formSignup.get('username').valueChanges
      .pipe(debounceTime(500))
      .subscribe(value => {
        this._usernameIsAvailable$.next(true);
        this._usernameHasBeenValidated$.next(false);
        if (!this._formSignup.get('username').hasError('required')
          && !this._formSignup.get('username').hasError('minlength')
        ) {
          this._findUsernameSub$ = this._authService.findUserByUsername(value).subscribe({
            next: _ => {
              this._usernameIsAvailable$.next(true);
              this._usernameHasBeenValidated$.next(true);
            },
            error: _ => {
              this._usernameIsAvailable$.next(false);
              this._formSignup.get('username').setErrors({username: true})
            }
          });
        }
      });

    this._emailInputSub$ = this._formSignup.get('email').valueChanges
      .pipe(debounceTime(500))
      .subscribe(value => {
        this._emailIsAvailable$.next(true);
        this._emailHasBeenValidated$.next(false);
        if (!this._formSignup.get('email').hasError('required')
          && !this._formSignup.get('email').hasError('email')
        ) {
          this._findEmailSub$ = this._authService.findUserByEmail(value).subscribe({
            next: _ => {
              this._emailIsAvailable$.next(true);
              this._emailHasBeenValidated$.next(true);
            },
            error: _ => {
              this._emailIsAvailable$.next(false);
              this._formSignup.get('email').setErrors({email: true})
            }
          });
        }
      });
  }

  ngOnDestroy(): void {
    this._emailIsAvailable$.unsubscribe();
    this._emailHasBeenValidated$.unsubscribe();
    this._usernameIsAvailable$.unsubscribe();
    this._usernameHasBeenValidated$.unsubscribe();
    this._usernameInputSub$?.unsubscribe();
    this._emailInputSub$?.unsubscribe();
    this._findUsernameSub$?.unsubscribe();
    this._findEmailSub$?.unsubscribe();
  }

  public _onSignupFormSummit() {
    this._formBeingSubmitted = true;
    const {username, email, password, passwordConfirmation} = this._formSignup.value;
    const data = {
      username: username,
      email: email,
      password: password,
      password_confirm: passwordConfirmation,
    };
    this._authService.register(data)
      .subscribe({
        next: user => {
          this._authService.sendAccountRegistrationEmail({email: user.email})
            .subscribe({
              next: _ => {
                this._displayModal = true
              },
              error: _ => {
                this._formBeingSubmitted = false;
                showToast(this._messageService, 'error', 'Error',
                  'No se ha podido completar el registro. Inténtalo de nuevo más tarde');
              }
            });
        },
        error: _ => {
          this._formBeingSubmitted = false;
          showToast(this._messageService, 'error', 'Error',
            'No se ha podido completar el registro. Inténtalo de nuevo más tarde');
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

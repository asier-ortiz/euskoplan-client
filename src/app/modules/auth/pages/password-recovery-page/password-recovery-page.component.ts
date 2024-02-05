import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormRecord, Validators} from "@angular/forms";
import {AuthService} from "@shared/services/auth.service";
import {Router} from "@angular/router";
import {MessageService} from "primeng/api";
import {showToast} from "@shared/helpers/shared.helpers";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-password-recovery-page',
  templateUrl: './password-recovery-page.component.html',
  styleUrls: ['./password-recovery-page.component.css']
})
export class PasswordRecoveryPageComponent implements OnInit, OnDestroy {

  public _formPasswordReset: FormRecord;
  public _formBeingSubmitted: boolean = false;
  public _displayModal: boolean = false;
  private _sendEmailSub$: Subscription;

  constructor(private _authService: AuthService,
              private _formBuilder: FormBuilder,
              private _router: Router,
              private _messageService: MessageService) {
  }

  ngOnInit(): void {
    this._formPasswordReset = this._formBuilder.record({
      email: new FormControl(null, [
        Validators.required,
        Validators.email
      ])
    });
  }

  ngOnDestroy(): void {
    this._sendEmailSub$?.unsubscribe();
  }

  public _onPasswordResetFormSubmit() {
    this._formBeingSubmitted = true;
    this._sendEmailSub$ = this._authService.sendPasswordResetEmail(this._formPasswordReset.getRawValue())
      .subscribe({
        next: _ => this._displayModal = true,
        error: _ => {
          this._formBeingSubmitted = false
          showToast(this._messageService, 'error', 'Error',
            'Algo ha salido mal. Revisa el correo electrónico introducido y vuelve a intentarlo');
        }
      });
  }

  public _navigateToLogin() {
    this._router.navigate(['/auth/login']);
  }

}

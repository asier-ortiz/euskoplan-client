import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthRoutingModule} from './auth-routing.module';
import {LoginPageComponent} from './pages/login-page/login-page.component';
import {SignupPageComponent} from './pages/signup-page/signup-page.component';
import {ReactiveFormsModule} from "@angular/forms";
import {PasswordRecoveryPageComponent} from './pages/password-recovery-page/password-recovery-page.component';
import {DialogModule} from "primeng/dialog";
import {ToastModule} from "primeng/toast";
import {PasswordResetPageComponent} from './pages/password-reset-page/password-reset-page.component';
import {EmailVerifyPageComponent} from './pages/email-verify-page/email-verify-page.component';

@NgModule({
  declarations: [
    LoginPageComponent,
    SignupPageComponent,
    PasswordRecoveryPageComponent,
    PasswordResetPageComponent,
    EmailVerifyPageComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    DialogModule,
    ToastModule
  ]
})
export class AuthModule {
}

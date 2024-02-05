import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginPageComponent} from "@modules/auth/pages/login-page/login-page.component";
import {SignupPageComponent} from "@modules/auth/pages/signup-page/signup-page.component";
import {PasswordRecoveryPageComponent} from "@modules/auth/pages/password-recovery-page/password-recovery-page.component";
import {PasswordResetPageComponent} from "@modules/auth/pages/password-reset-page/password-reset-page.component";
import {EmailVerifyPageComponent} from "@modules/auth/pages/email-verify-page/email-verify-page.component";
import {UserResolver} from "@modules/auth/resolvers/user.resolver";

const routes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent,
    resolve: {user: UserResolver}
  },
  {
    path: 'signup',
    component: SignupPageComponent
  },
  {
    path: 'password-recovery',
    component: PasswordRecoveryPageComponent
  },
  {
    path: 'password-reset',
    component: PasswordResetPageComponent
  },
  {
    path: 'email-verify',
    component: EmailVerifyPageComponent
  },
  {
    path: '**',
    redirectTo: '/auth/login'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {
}

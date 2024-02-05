import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SessionGuard} from "@core/guards/session.guard";
import {HomePageComponent} from "@modules/home/pages/home-page/home-page.component";
import {TranslateModule} from '@ngx-translate/core';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: '',
    component: HomePageComponent,
    loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule),
    canActivate: [SessionGuard]
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    TranslateModule
  ],
  exports: [RouterModule, TranslateModule]
})
export class AppRoutingModule {
}

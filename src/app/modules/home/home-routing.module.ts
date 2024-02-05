import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: 'resource',
    loadChildren: () => import('@modules/resource/resource.module').then(m => m.ResourceModule)
  },
  {
    path: 'plan',
    loadChildren: () => import('@modules/plan/plan.module').then(m => m.PlanModule)
  },
  {
    path: 'user',
    loadChildren: () => import('@modules/user/user.module').then(m => m.UserModule)
  },
  {
    path: '',
    loadChildren: () => import('@modules/landing/landing.module').then(m => m.LandingModule)
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {
}

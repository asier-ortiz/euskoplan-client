import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserRoutingModule} from './user-routing.module';
import {SharedModule} from "@shared/shared.module";
import {AccountManagePageComponent} from './pages/account-manage-page/account-manage-page.component';
import {FavouritesPageComponent} from './pages/favourites-page/favourites-page.component';
import {PlansListPageComponent} from './pages/plans-list-page/plans-list-page.component';
import {PlanCreatePageComponent} from './pages/plan-create-page/plan-create-page.component';
import {PlanEditPageComponent} from './pages/plan-edit-page/plan-edit-page.component';

@NgModule({
  declarations: [
    AccountManagePageComponent,
    FavouritesPageComponent,
    PlansListPageComponent,
    PlanCreatePageComponent,
    PlanEditPageComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule
  ]
})
export class UserModule {
}

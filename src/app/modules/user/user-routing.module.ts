import {NgModule} from '@angular/core';
import {RouterModule, Routes, UrlSegment} from '@angular/router';
import {AccountManagePageComponent} from "@modules/user/pages/account-manage-page/account-manage-page.component";
import {FavouritesPageComponent} from "@modules/user/pages/favourites-page/favourites-page.component";
import {PlansListPageComponent} from "@modules/user/pages/plans-list-page/plans-list-page.component";
import {PlanCreatePageComponent} from "@modules/user/pages/plan-create-page/plan-create-page.component";
import {PlanEditPageComponent} from "@modules/user/pages/plan-edit-page/plan-edit-page.component";

const numberRegex = '^[0-9]*$';
const planEditMatcher = (url: UrlSegment[]) => {
  return url.length === 3 && url[2].path.match(numberRegex)
    ? {
      consumed: url,
      posParams: {
        id: new UrlSegment(url[2].path, {})
      }
    }
    : null;
};

const routes: Routes = [
  {
    path: 'my-account',
    component: AccountManagePageComponent
  },
  {
    path: 'my-favourites',
    component: FavouritesPageComponent
  },
  {
    path: 'my-plans',
    component: PlansListPageComponent,
  },
  {
    path: 'my-plans/create',
    component: PlanCreatePageComponent
  },
  {
    // path: 'my-plans/edit/:id',
    component: PlanEditPageComponent,
    matcher: planEditMatcher
  },
  {
    path: '**',
    redirectTo: '/',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {
}

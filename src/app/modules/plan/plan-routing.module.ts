import {NgModule} from '@angular/core';
import {RouterModule, Routes, UrlSegment} from '@angular/router';
import {PlanDetailPageComponent} from "@modules/plan/pages/plan-detail-page/plan-detail-page.component";
import {PlanListPageComponent} from "@modules/plan/pages/plan-list-page/plan-list-page.component";

const planListMatcher = (url: UrlSegment[]) => {
  return url.length === 1 && url[0].path === 'list'
    ? ({consumed: url}) : null;
};

const numberRegex = '^[0-9]*$';
const planDetailMatcher = (url: UrlSegment[]) => {
  return url.length === 1 && url[0].path.match(numberRegex)
    ? {
      consumed: url,
      posParams: {
        id: new UrlSegment(url[0].path, {})
      }
    }
    : null;
};

const routes: Routes = [
  {
    component: PlanListPageComponent,
    matcher: planListMatcher
  },
  {
    component: PlanDetailPageComponent,
    matcher: planDetailMatcher
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
export class PlanRoutingModule {
}

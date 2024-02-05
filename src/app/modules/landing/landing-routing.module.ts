import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LandingPageComponent} from "@modules/landing/pages/landing-page/landing-page.component";
import {SearchResultsPageComponent} from "@modules/landing/pages/search-results-page/search-results-page.component";
import { ResourceDetailPageComponent } from '@modules/resource/pages/resource-detail-page/resource-detail-page.component';
const routes: Routes = [
  {
    path: 'search',
    component: SearchResultsPageComponent,
  },
  {
    path: 'detail',
    component: ResourceDetailPageComponent,
  },
  {
    path: 'detail/:tipoCarousel/:id/:codigo',
    component: ResourceDetailPageComponent,
  },
  {
    path: '',
    component: LandingPageComponent,
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
export class LandingRoutingModule {
}

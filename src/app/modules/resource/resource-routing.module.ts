import {NgModule} from '@angular/core';
import {RouterModule, Routes, UrlSegment} from '@angular/router';
import {ResourceListPageComponent} from "@modules/resource/pages/resource-list-page/resource-list-page.component";
import {ResourceDetailPageComponent} from "@modules/resource/pages/resource-detail-page/resource-detail-page.component";

const resourceListMatcher = (url: UrlSegment[]) => {
  return url.length === 1
  && url[0].path === 'accommodations'
  || url[0].path === 'caves'
  || url[0].path === 'culturals'
  || url[0].path === 'events'
  || url[0].path === 'fairs'
  || url[0].path === 'localities'
  || url[0].path === 'museums'
  || url[0].path === 'naturals'
  || url[0].path === 'restaurants'
    ? ({consumed: url}) : null;
};

const numberRegex = '^[0-9]*$';
const resourceDetailMatcher = (url: UrlSegment[]) => {
  return url.length === 2
  && url[0].path === 'accommodation'
  || url[0].path === 'cave'
  || url[0].path === 'cultural'
  || url[0].path === 'event'
  || url[0].path === 'fair'
  || url[0].path === 'locality'
  || url[0].path === 'museum'
  || url[0].path === 'natural'
  || url[0].path === 'restaurant'
  && url[1].path.match(numberRegex)
    ? {
      consumed: url,
      posParams: {
        id: new UrlSegment(url[1].path, {})
      }
    }
    : null;
};

const routes: Routes = [
  {
    component: ResourceListPageComponent,
    matcher: resourceListMatcher
  },
  {
    component: ResourceDetailPageComponent,
    matcher: resourceDetailMatcher
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
export class ResourceRoutingModule {
}

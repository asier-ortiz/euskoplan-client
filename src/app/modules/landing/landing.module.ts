import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LandingRoutingModule} from './landing-routing.module';
import {LandingPageComponent} from "@modules/landing/pages/landing-page/landing-page.component";
import {SearchResultsPageComponent} from './pages/search-results-page/search-results-page.component';
import {SharedModule} from "@shared/shared.module";
import {LandingPageHeaderComponent} from './components/landing-page-header/landing-page-header.component';
import {CarouselComponent} from './components/carousel/carousel.component';
import {CardModule} from 'primeng/card';
import {CarouselModule} from "primeng/carousel";
import {ReactiveFormsModule} from "@angular/forms";
import {TabMenuModule} from "primeng/tabmenu";
import {DataViewModule} from "primeng/dataview";
import {ButtonModule} from 'primeng/button';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {HttpClient, HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';

@NgModule({
  declarations: [
    LandingPageComponent,
    SearchResultsPageComponent,
    LandingPageHeaderComponent,
    CarouselComponent
  ],
  imports: [
    CommonModule,
    LandingRoutingModule,
    SharedModule,
    CarouselModule,
    CardModule,
    ReactiveFormsModule,
    TabMenuModule,
    DataViewModule,
    ButtonModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    })
  ]
})
export class LandingModule {
}
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
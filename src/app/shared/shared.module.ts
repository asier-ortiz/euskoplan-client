import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavBarComponent} from './components/nav-bar/nav-bar.component';
import {RouterLinkWithHref} from "@angular/router";
import {FooterComponent} from './components/footer/footer.component';
import {TranslateModule} from '@ngx-translate/core';
import {ErrorImageDirective} from './directives/error-image.directive';
import {OrderByPipe} from './pipes/order-by.pipe';

@NgModule({
  declarations: [
    NavBarComponent,
    FooterComponent,
    ErrorImageDirective,
    OrderByPipe
  ],
  imports: [
    CommonModule,
    TranslateModule,
    RouterLinkWithHref
  ],
  exports: [
    NavBarComponent,
    FooterComponent,
    ErrorImageDirective,
    OrderByPipe
  ]
})
export class SharedModule {
}

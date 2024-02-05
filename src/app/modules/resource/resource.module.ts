import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ResourceRoutingModule} from './resource-routing.module';
import {ResourceListPageComponent} from './pages/resource-list-page/resource-list-page.component';
import {MapComponent} from './components/map/map.component';
import {TabViewModule} from "primeng/tabview";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {ResourceDetailPageComponent} from './pages/resource-detail-page/resource-detail-page.component';
import {SharedModule} from "@shared/shared.module";
import {FormFilterComponent} from './components/form-filter/form-filter.component'
import {GalleriaModule} from "primeng/galleria";
import { ButtonAddToPlanComponent } from './components/button-add-to-plan/button-add-to-plan.component';
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {TooltipModule} from "primeng/tooltip";
import {MenuModule} from "primeng/menu";
import {DialogModule} from "primeng/dialog";
import {ToastModule} from "primeng/toast";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {InputSwitchModule} from "primeng/inputswitch";
import { ButtonAddToFavouritesComponent } from './components/button-add-to-favourites/button-add-to-favourites.component';
import {DataViewModule} from 'primeng/dataview';
import {DropdownModule} from "primeng/dropdown";
import {ScrollPanelModule} from "primeng/scrollpanel";
import {SidebarModule} from "primeng/sidebar";
import {ListboxModule} from "primeng/listbox";
import {AccordionModule} from "primeng/accordion";
import {ChipsModule} from "primeng/chips";
import {ChipModule} from "primeng/chip";
import {DividerModule} from "primeng/divider";
import {BadgeModule} from "primeng/badge";
import {CalendarModule} from "primeng/calendar";

@NgModule({
  declarations: [
    ResourceListPageComponent,
    MapComponent,
    ResourceDetailPageComponent,
    FormFilterComponent,
    ButtonAddToPlanComponent,
    ButtonAddToFavouritesComponent
  ],
  imports: [
    DataViewModule,
    CommonModule,
    ResourceRoutingModule,
    TabViewModule,
    ProgressSpinnerModule,
    SharedModule,
    GalleriaModule,
    ButtonModule,
    RippleModule,
    TooltipModule,
    MenuModule,
    DialogModule,
    ToastModule,
    ReactiveFormsModule,
    InputSwitchModule,
    DropdownModule,
    FormsModule,
    ScrollPanelModule,
    SidebarModule,
    ListboxModule,
    AccordionModule,
    ChipsModule,
    ChipModule,
    DividerModule,
    BadgeModule,
    CalendarModule
  ]
})
export class ResourceModule {
}

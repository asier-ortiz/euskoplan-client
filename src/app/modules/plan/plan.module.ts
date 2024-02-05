import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PlanRoutingModule} from './plan-routing.module';
import {PlanDetailPageComponent} from './pages/plan-detail-page/plan-detail-page.component';
import {PlanListPageComponent} from './pages/plan-list-page/plan-list-page.component';
import {SharedModule} from "@shared/shared.module";
import { PlanMapComponent } from './components/plan-map/plan-map.component';
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {SpeedDialModule} from "primeng/speeddial";
import {DragDropModule} from '@angular/cdk/drag-drop';
@NgModule({
  declarations: [
    PlanDetailPageComponent,
    PlanListPageComponent,
    PlanMapComponent
  ],
  imports: [
    DragDropModule,
    CommonModule,
    PlanRoutingModule,
    SharedModule,
    ProgressSpinnerModule,
    SpeedDialModule,
  ]
})
export class PlanModule {
}

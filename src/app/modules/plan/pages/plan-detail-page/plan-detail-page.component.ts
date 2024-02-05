import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, finalize, Subscription} from "rxjs";
import {PlanModel} from "@core/models/plan.model";
import {PlansService} from "@shared/services/plans.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-plan-detail-page',
  templateUrl: './plan-detail-page.component.html',
  styleUrls: ['./plan-detail-page.component.css']
})
export class PlanDetailPageComponent implements OnInit {

  private _planSub$: Subscription;
  private planID: number;
  public _plan$ = new BehaviorSubject<PlanModel>(null);
  public _loading$ = new BehaviorSubject<boolean>(true);

  constructor(
    private _planService: PlansService,
    private _router: Router,
    private _route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.planID = Number(this._route.snapshot.url[0].path);

    this._planSub$ = this._planService.getPlan(this.planID)
      .pipe(
        finalize(() => this._loading$.next(false))
      )
      .subscribe({
        next: (plan: PlanModel) => this._plan$.next(plan),
        error: err => {
          console.error(err);
          // 404
          // Redirigir a alguna parte del universo ...
        }
      });
  }

  ngOnDestroy(): void {
    this._planSub$?.unsubscribe();
  }

}

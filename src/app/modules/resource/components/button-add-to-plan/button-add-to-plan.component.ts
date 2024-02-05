import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PlansService} from "@shared/services/plans.service";
import {finalize, Subscription} from "rxjs";
import {PlanModel} from "@core/models/plan.model";
import {MenuItem, MessageService} from "primeng/api";
import {AccommodationModel} from "@core/models/accommodation.model";
import {CaveModel} from "@core/models/cave.model";
import {CulturalModel} from "@core/models/cultural.model";
import {EventModel} from "@core/models/event.model";
import {FairModel} from "@core/models/fair.model";
import {LocalityModel} from "@core/models/locality.model";
import {MuseumModel} from "@core/models/museum.model";
import {NaturalModel} from "@core/models/natural.model";
import {RestaurantModel} from "@core/models/restaurant.model";
import {Menu} from "primeng/menu";
import {showToast} from "@shared/helpers/shared.helpers";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-button-add-to-plan',
  templateUrl: './button-add-to-plan.component.html',
  styleUrls: ['./button-add-to-plan.component.css']
})
export class ButtonAddToPlanComponent implements OnInit, OnDestroy {

  @Input() _resource: AccommodationModel | CaveModel | CulturalModel | EventModel | FairModel | LocalityModel | MuseumModel | NaturalModel | RestaurantModel;
  @ViewChild('menu') menu!: Menu;

  private _plansSub$: Subscription;
  private _planCreateSub$: Subscription;
  private _addStepSub$: Subscription;
  public _plans: PlanModel[] = [];
  public _menuItems: MenuItem[] = [];
  public _displayModal: boolean = false;
  public _formCreatePlan: FormGroup;
  public _formBeingSubmitted: boolean = false;

  constructor(private _planService: PlansService, private _messageService: MessageService, private _formBuilder: FormBuilder) {
  }

  ngOnInit(): void {

    this._formCreatePlan = this._formBuilder.group({
      title: new FormControl(null, [
        Validators.required
      ]),
      description: new FormControl(null, [
        Validators.required
      ]),
      public: new FormControl(null, [])
    });

    this._plansSub$ = this._planService.getUserPlans()
      .pipe(finalize(() => {
        this._menuItems.splice(0, 0, {
          label: 'Crear nuevo Plan',
          icon: 'pi pi-plus',
          styleClass: "new-plan-menu-item",
          command: () => this._displayModal = true
        });
      }))
      .subscribe({
        next: (plans: PlanModel[]) => {
          this._plans = plans;
          this._menuItems = this._plans.map((plan) => {
            return {label: plan.titulo, command: () => this._addToPlan(plan)}
          });
        },
        error: err => console.error(err)
      });
  }

  ngOnDestroy(): void {
    this._plansSub$?.unsubscribe();
    this._addStepSub$?.unsubscribe();
    this._planCreateSub$?.unsubscribe();
  }

  private _addToPlan(plan: PlanModel) {
    if (!this._resource) return;

    this._addStepSub$ = this._planService.createPlanStep(plan.id, {
      'indice': plan.pasos?.length > 0 ? plan.pasos.length + 1 : 0,
      'id_recurso': this._resource.id,
      'indicaciones': null,
      'tipo_recurso': this._resource.coleccion
    })
      .subscribe({
        next: (plan) => {
          showToast(this._messageService, 'success', `${this._resource.nombre}`, `Añadido al plan '${plan.titulo}'`)
        },
        error: err => {
          console.error(err);
          showToast(this._messageService, 'error', 'Error', 'No se ha podido añadir la actividad')
        }
      });
  }

  public _toggleMenu(event: Event) {
    this.menu.toggle(event);
  }

  public _onCreatePlanFormSubmit() {
    this._formBeingSubmitted = true;

    let title: string = this._formCreatePlan.get('title').value;
    title = title.trim();

    let description: string = this._formCreatePlan.get('description').value;
    description = description.trim();

    const isPublic: boolean = this._formCreatePlan.get('public').value;

    this._planCreateSub$ = this._planService.createPlan({
      'idioma': localStorage.getItem('lang') ?? 'es',
      'titulo': title,
      'descripcion': description,
      'publico': isPublic,
      'pasos': []
    })
      .pipe(finalize(() => {
        this._formBeingSubmitted = false;
        this._displayModal = false;
      }))
      .subscribe({
        next: (plan: PlanModel) => {
          console.log(plan);
          this._plans.push(plan);
          this._menuItems.push({label: plan.titulo, command: () => this._addToPlan(plan)});
          this._formCreatePlan.reset();
          showToast(this._messageService, 'success', 'Éxito', 'Nuevo plan creado');
        },
        error: err => {
          console.error(err);
          showToast(this._messageService, 'error', 'Error', 'No se ha podido crear el plan');
        }
      });
  }

}

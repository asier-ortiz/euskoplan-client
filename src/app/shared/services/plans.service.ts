import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "@environments/environment";
import {Observable} from "rxjs";
import {PlanModel} from "@core/models/plan.model";

@Injectable({
  providedIn: 'root'
})
export class PlansService {

  private readonly API_URL: string = environment.api_url;

  constructor(private _httpClient: HttpClient) {
  }

  //////////////////////// PLANS ////////////////////////

  // Plan
  public getPlansFiltering(query: Record<string, string>): Observable<PlanModel[]> {
    let params = new HttpParams();
    if (query['idioma']) params = params.append('idioma', query['idioma']);
    if (query['titulo']) params = params.append('titulo', query['titulo']);
    if (query['descripcion']) params = params.append('descripcion', query['descripcion']);
    if (query['id_usuario']) params = params.append('id_usuario', query['id_usuario']);
    if (query['limite']) params = params.append('idioma', query['limite']);
    // Vienen desde la BB DD ordenados descendentemente por número de votos
    return this._httpClient.get<PlanModel[]>(`${this.API_URL}/plan`, {params: params});
  }

  public getPlansSearching(query: Record<string, string>): Observable<PlanModel[]> {
    let params = new HttpParams();
    if (query['idioma']) params = params.append('idioma', query['idioma']);
    if (query['busqueda']) params = params.append('busqueda', query['busqueda']);
    return this._httpClient.get<PlanModel[]>(`${this.API_URL}/plan/results/search`, {params: params});
  }

  public getUserPlans(): Observable<PlanModel[]> {
    return this._httpClient.get<PlanModel[]>(`${this.API_URL}/plan/results/user`);
  }

  public getPlan(id: number): Observable<PlanModel> {
    return this._httpClient.get<PlanModel>(`${this.API_URL}/plan/${id}`);
  }

  public createPlan(data): Observable<PlanModel> {
    return this._httpClient.post<PlanModel>(`${this.API_URL}/plan`, data);
  }

  public updatePlan(data): Observable<PlanModel> {
    return this._httpClient.put<PlanModel>(`${this.API_URL}/plan`, data);
  }

  public deletePlan(id: number): Observable<void> {
    return this._httpClient.delete<void>(`${this.API_URL}/plan/${id}`);
  }

  public upvotePlan(id: number): Observable<void> {
    return this._httpClient.put<void>(`${this.API_URL}/plan/upvote/${id}`, {});
  }

  public downvotePlan(id: number): Observable<void> {
    return this._httpClient.put<void>(`${this.API_URL}/plan/downvote/${id}`, {});
  }

  // Step
  public createPlanStep(planId: number, data): Observable<PlanModel> {
    return this._httpClient.post<PlanModel>(`${this.API_URL}/step/${planId}`, data);
  }

  public updatePlanStep(planId: number, data): Observable<PlanModel> {
    return this._httpClient.put<PlanModel>(`${this.API_URL}/step/${planId}`, data);
  }

  public deletePlanStep(stepId: number): Observable<PlanModel> {
    return this._httpClient.delete<PlanModel>(`${this.API_URL}/step/${stepId}`);
  }

  // Route
  public getPlanRoute(id: number, profile: string): Observable<any> {
    return this._httpClient.get<any>(`${this.API_URL}/plan/${id}/route/${profile}`);
  }

}

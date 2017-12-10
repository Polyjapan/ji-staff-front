import {Component, OnInit} from '@angular/core';
import {AbstractEditionComponent} from "../../abstract-edition-component";
import {FormService} from "../../services/form.service";
import {BackendService} from "../../services/backend.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {ApplicationsService} from "./applications.service";
import {getState, getStateFancy, getStateLabel} from "../../utils/statelabels";

@Component({
  selector: 'app-admin-applications-detail',
  template: `
    <div *ngIf="error">
      <div class="alert alert-danger" role="alert">
        <b>Une erreur s'est produite : </b>
        <p [innerHtml]="error"></p>
      </div>
    </div>

    <div class="well" *ngIf="application">
      <p>Cette candidature est actuellement <b class="label {{stateLabel}}">{{stateContent}}</b></p>
      <p *ngIf="application.validationDate">Validée le <b>{{date}}</b></p>
      <p *ngIf="application.mail">Mail : <code>{{application.mail}}</code></p>
      <p *ngIf="application.statusChangedBy">Dernier changement d'état par <b>{{application.statusChangedBy[1]}}</b>
        (<code>{{application.statusChangedBy[0]}}</code>)</p>
      <p>
        <button (click)="accept()" class="btn btn-success">Accepter cette candidature</button>
        <button (click)="refuse()" class="btn btn-danger">Refuser cette candidature</button>
      </p>
    </div>

    <app-application-content *ngIf="edition && application" [edition]="edition" [editable]="true"
                             [application]="application"></app-application-content>

    <div *ngIf="!error && loading">
      <div class="well">
        <h2>Chargement des données en cours...</h2><br/>
      </div>
    </div>
  `
})
export class AdminApplicationDetailComponent extends AbstractEditionComponent implements OnInit {

  selected: string;

  constructor(forms: FormService, backend: BackendService, public applicationsService: ApplicationsService, route: ActivatedRoute, public router: Router) {
    super(forms, backend, route, true, false);
  }

  accept() {
    const currentState = getState(this.application);
    this.applicationsService.accept(this.year, this.application)
      .then(succ => this.router.navigate(["admin", this.year, "applications", currentState]))
      .catch(err => this.catchError(err));
  }

  refuse() {
    const currentState = getState(this.application);
    this.applicationsService.refuse(this.year, this.application)
      .then(succ => this.router.navigate(["admin", this.year, "applications", currentState]))
      .catch(err => this.catchError(err));
  }

  completeInit(params: ParamMap): Promise<void> {
    return this.backend.getApplication(this.year, this.selected).then(rep => {
      this.application = rep;
    });
  }

  ngOnInit(): void {
    this.route.parent.paramMap.subscribe(p => super.onUriChange(p));
    this.route.paramMap.subscribe(p => super.onUriChange(this.route.parent.snapshot.paramMap));
  }

  preInit(params: ParamMap): Promise<void> {
    this.selected = this.route.snapshot.paramMap.get('userid');
    if (!this.selected) {
      return Promise.reject("Aucun utilisateur demandé.");
    }
    return super.preInit(params);
  }

  get stateLabel(): string {
    return getStateLabel(this.application);
  }

  get stateContent(): string {
    return getStateFancy(this.application);
  }

  get date(): string {
    const date = new Date(this.application.validationDate);
    return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " à " +
      date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
  }
}

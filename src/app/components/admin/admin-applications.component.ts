import {Component, OnInit} from '@angular/core';
import {AbstractEditionComponent} from "../../abstract-edition-component";
import {FormService} from "../../services/form.service";
import {Application, BackendService} from "../../services/backend.service";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {ApplicationsService, SortedArray} from "./applications.service";
import {isMinor} from "../../utils/dateutils";

@Component({
  selector: 'app-admin-applications-template',
  template: `
    <div *ngIf="error">
      <div class="alert alert-danger" role="alert">
        <b>Une erreur s'est produite : </b>
        <p [innerHtml]="error"></p>
      </div>
    </div>

    <div class="well" *ngIf="edition && applications">
      <h2>Candidatures {{title}}
        <button class="btn btn-primary" (click)="forceRefresh()"><b class="glyphicon glyphicon-refresh"></b></button>
      </h2>
      <table class="table table-bordered">
        <thead>
        <tr>
          <th>Nom</th>
          <th>Prénom</th>
          <th>EMail</th>
          <th>Date de naissance</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr *ngFor="let application of applications">
          <td>{{application.content['lastname']}}</td>
          <td>{{application.content['firstname']}}</td>
          <td>{{application.mail}}</td>
          <td>{{application.content['birthdate'] + minorTag(application)}}</td>
          <td><a routerLink="/admin/{{year}}/application/view/{{application.userId}}">Voir</a></td>
        </tr>
        </tbody>
      </table>
    </div>

    <div *ngIf="!error && loading">
      <div class="well">
        <h2>Chargement des données en cours...</h2><br/>
      </div>
    </div>
  `
})
export class AdminApplicationsComponent extends AbstractEditionComponent implements OnInit {

  selected: string;
  applications: SortedArray<Application>;

  constructor(forms: FormService, backend: BackendService, public applicationsService: ApplicationsService, route: ActivatedRoute) {
    super(forms, backend, route, true, false);
  }

  minorTag(app: Application) {
    return isMinor(app.content['birthdate'], this.edition.edition) ? " (Mineur)" : "";
  }

  completeInit(params: ParamMap): Promise<void> {
    return this.reloadApplications();
  }

  forceRefresh() {
    this.applications = null;
    this.loading = true;
    this.reloadApplications(true).then(v => this.loading = false);
  }

  reloadApplications(force: boolean = false): Promise<void> {
    return this.applicationsService.getByState(this.year, this.selected, force).then(rep => {
      this.applications = rep;
    });
  }

  ngOnInit(): void {
    this.route.parent.paramMap.subscribe(p => super.onUriChange(p));
    this.route.paramMap.subscribe(p => super.onUriChange(this.route.parent.snapshot.paramMap));
  }

  preInit(params: ParamMap): Promise<void> {
    this.applications = null;
    this.selected = this.route.snapshot.paramMap.get('state');
    if (!this.selected) {
      return Promise.reject("Aucun état demandé.");
    }
    return super.preInit(params);
  }

  get title() {
    switch (this.selected) {
      case "accepted":
        return "acceptées";
      case "refused":
        return "refusées";
      default:
        return "en attente";
    }
  }
}
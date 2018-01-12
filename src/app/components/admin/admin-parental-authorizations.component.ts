import {Component, Input, OnInit} from '@angular/core';
import {AbstractEditionComponent} from "../../abstract-edition-component";
import {FormService} from "../../services/form.service";
import {Application, BackendService} from "../../services/backend.service";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {ApplicationsService, SortedArray} from "./applications.service";
import {isMinor} from "../../utils/dateutils";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";


@Component({
  selector: 'app-admin-applications-authorizations-template',
  template: `
    <div class="well">
      <h2>Vérification des autorisations parentales
        <button class="btn btn-primary" (click)="forceRefresh()"><b class="glyphicon glyphicon-refresh"></b></button>
      </h2>

      <h3 *ngIf="loading">Chargement des données en cours...</h3><br/>

      <div *ngIf="applications">
          <div class="form-group">
            <label>Voir :</label>
            <select [(ngModel)]="selected" class="form-control" style="width: 20%;">
              <option value="waiting">En attente de vérification</option>
              <option value="accepted">Validées</option>
              <option value="refused">Refusées</option>
              <option value="unsent">Non envoyées</option>
              <option value="all">Toutes</option>
            </select>
        </div>

        <table class="table table-bordered">
          <thead>
          <tr>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Autorisation</th>
            <th *ngIf="selected === 'waiting' || selected === 'all' || selected == 'refused'">Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr *ngFor="let application of applications">
            <td>{{application.content['lastname']}}</td>
            <td>{{application.content['firstname']}}</td>
            <td>
              <a *ngIf="application.parentalAllowance" [href]="formUrl(application)">{{formUrl(application)}}</a>
              <em *ngIf="!application.parentalAllowance">Aucun document reçu</em>
            </td>
            <td *ngIf="selected === 'waiting' || selected === 'all' || selected == 'refused'">
              <button (click)="accept(application)" *ngIf="application.parentalAllowanceAccepted !== true && application.parentalAllowance"
                      class="btn btn-success">Valider</button>
              <button (click)="refuse(application)" *ngIf="application.parentalAllowanceAccepted !== true && application.parentalAllowance"
                      class="btn btn-danger">Refuser</button></td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class AdminParentalAuthorizationsComponent implements OnInit {
  selected: string = "waiting";
  loading: boolean = true;
  @Input() year: string;
  edition: Edition;
  private _applications: SortedArray<Application>;

  constructor(public backend: BackendService, public applicationsService: ApplicationsService, public route: ActivatedRoute) {
  }

  get applications() {
    return this._applications ? this._applications.filter(app => {
      switch (this.selected) {
        case "waiting":
          return app.parentalAllowanceAccepted === undefined && app.parentalAllowance !== undefined;
        case "accepted":
          return app.parentalAllowanceAccepted === true;
        case "refused":
          return app.parentalAllowanceAccepted === false;
        case "all":
          return true;
        default:
          return app.parentalAllowance === undefined;
      }
    }) : [];
  }

  forceRefresh() {
    this._applications = null;
    this.loading = true;
    this.reloadApplications(true).then(v => this.loading = false);
  }

  reloadApplications(force: boolean = false): Promise<void> {
    const ed = this.edition;
    console.log(ed)
    return this.applicationsService.getByState(this.year, "accepted", force).then(rep => {
      this._applications = rep.filter(app => {
        const birthdate = app.content["birthdate"] as string;
        return isMinor(birthdate, ed);
      });
    });
  }

  ngOnInit(): void {
    // This edition system stinks a lot.
    // We have to rethink it deeply
    // Hopefully it's the next big commit :')
    this.backend.getEdition(this.year).then(ed => {
      this.edition = ed;
      this.forceRefresh();
    });
  }

  accept(application: Application) {
    this.backend.acceptAuthorisation(this.year, application.userId, true).then(u => {
      this._applications.remove(application);
    });
  }

  refuse(application: Application) {
    const reason = prompt("Donnez un motif de refus :");
    this.backend.acceptAuthorisation(this.year, application.userId, false, reason).then(u => {
      this._applications.remove(application);
    });
  }

  formUrl(app: Application): string {
    return AbstractEditionComponent.formUrl(app);
  }
}

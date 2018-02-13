import {Component, Input, OnInit} from '@angular/core';
import {Application, BackendService} from "../../services/backend.service";
import {ActivatedRoute} from "@angular/router";
import {ApplicationsService, SortedArray} from "./applications.service";
import {isNullOrUndefined} from "util";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";


@Component({
  selector: 'app-admin-photos',
  template: `
    <div class="well">
      <h2>Photos manquantes
        <button class="btn btn-primary" (click)="forceRefresh()"><b class="glyphicon glyphicon-refresh"></b></button>
        <a class="btn btn-primary" [href]="csvUrl" download="no-photos.csv"><b class="glyphicon glyphicon-download-alt"></b></a>

      </h2>

      <h3 *ngIf="loading">Chargement des données en cours...</h3><br/>

      <div *ngIf="applications">
        <table class="table table-bordered">
          <thead>
          <tr>
            <th>Nom</th>
            <th>Mail</th>
            <th>Fiche staff</th>
          </tr>
          </thead>
          <tbody>
          <tr *ngFor="let application of applications">
            <td>{{application.content['lastname']}} {{application.content['firstname']}}</td>
            <td>{{application.mail}}</td>
            <td>
              <a routerLink="/admin/{{year}}/application/view/{{application.userId}}" class="btn btn-primary">Voir la
                candidature</a>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class AdminPhotosComponent implements OnInit {
  loading: boolean = true;
  @Input() year: string;
  edition: Edition;
  private _applications: SortedArray<Application>;

  csvUrl: SafeUrl;

  constructor(public backend: BackendService, public applicationsService: ApplicationsService, public route: ActivatedRoute, private sanitizer: DomSanitizer) {
  }



  get applications() {
    return this._applications ? this._applications.filter(app => isNullOrUndefined(app.picture)) : [];
  }

  forceRefresh() {
    this._applications = null;
    this.loading = true;
    this.reloadApplications(true).then(v => this.loading = false);
  }

  reloadApplications(force: boolean = false): Promise<void> {
    const ed = this.edition;
    console.log(ed);
    return this.applicationsService.getByState(this.year, "accepted", force).then(rep => {
      this._applications = rep;
      this._applications.onChange(apps => {
        let csv = "Nom,Prenom,Mail\n";

        for (let i = 0; i < this.applications.length; ++i) {
          const application = this.applications[i];
          csv += application.content["lastname"] + "," + application.content["firstname"] + "," + application.mail + "\n";
        }

        const blob = new Blob([ csv ], { type : 'text/csv' });
        console.log(blob);
        this.csvUrl = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(blob));
      });
    });
  }

  ngOnInit(): void {
    // This edition system stinks a lot.
    // We have to rethink it deeply
    // Hopefully it's the next big commit :')
    // (well it is not)
    this.backend.getEdition(this.year).then(ed => {
      this.edition = ed;
      this.forceRefresh();
    });
  }
}

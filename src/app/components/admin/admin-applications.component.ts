import {Component, OnInit} from '@angular/core';
import {AbstractEditionComponent} from "../../abstract-edition-component";
import {FormService} from "../../services/form.service";
import {Application, BackendService} from "../../services/backend.service";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {ApplicationsService, SortedArray} from "./applications.service";
import {isMinor} from "../../utils/dateutils";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";


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
      <h2>Candidatures {{title}} ({{amount}})
        <button class="btn btn-primary" (click)="forceRefresh()"><b class="glyphicon glyphicon-refresh"></b></button>
        <a class="btn btn-primary" [href]="csvUrl" [download]="fileName"><b class="glyphicon glyphicon-download-alt"></b></a>
      </h2>

      <button (click)="createAccepted()" [disabled]="creating" *ngIf="selected === 'accepted'"
              class="btn btn-success">Créer une candidature acceptée</button>
      <br/><br/>
            
      <pre class="code" *ngIf="selected === 'accepted' && createdLinks.length > 0"><ng-container *ngFor="let crea of createdLinks.reverse()">{{crea}}
</ng-container></pre>

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
          <td>
            <a routerLink="/admin/{{year}}/application/view/{{application.userId}}" class="btn btn-primary">Voir</a>

            <button (click)="accept(application)" class="btn btn-success">Accepter</button>
            <button (click)="refuse(application)" class="btn btn-danger">Refuser</button></td>
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
  csvUrl: SafeUrl;
  createdLinks: string[] = [];
  creating: boolean = false;

  constructor(forms: FormService, backend: BackendService, public applicationsService: ApplicationsService,
              route: ActivatedRoute, private sanitizer: DomSanitizer) {
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
      this.applications.onChange(apps => {
        let csv = "\"Mail\"";
        for (let i = 0; i < this.edition.totalPages(); ++i) {
          for (const field of this.edition.getFields(i)) {
            csv += ",\"" + field.label + "\"";
          }
        }
        csv += ",\"Commentaires\"\n";

        for (let i = 0; i < this.applications.length; ++i) {
          csv += this.toCSV(this.applications.get(i)) + "\n";
        }

        const blob = new Blob([ csv ], { type : 'text/csv' });
        console.log(blob);
        this.csvUrl = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(blob));
      });
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

  get amount() {
    if (this.applications) {
      return this.applications.length + "";
    } else {
      return "...";
    }
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

  get fileName() {
    return this.selected + ".csv";
  }

  private toCSV(application: Application): string {
    let csv = "\"" + application.mail + "\"";

    for (let i = 0; i < this.edition.totalPages(); ++i) {
      for (const field of this.edition.getFields(i)) {
        if (application.content[field.key]) {
          csv += ",\"" + application.content[field.key] + "\"";
        } else {
          csv += ",\"\"";
        }
      }
    }
    csv += ",\"";
    if (application.comments) {
      for (const comment of application.comments) {
        csv += comment.authorName + ": " + comment.comment + "\n";
      }
    }
    csv += "\"";

    return csv;
  }

  accept(application: Application) {
    this.applicationsService.accept(this.year, application)
      .then(succ => {
        if (this.selected !== "accepted") {
          this.applications.remove(application);
        }
      })
      .catch(err => this.catchError(err));
  }

  refuse(application: Application) {
    this.applicationsService.refuse(this.year, application)
      .then(succ => {
        if (this.selected !== "refused") {
          this.applications.remove(application);
        }})
      .catch(err => this.catchError(err));
  }

  createAccepted() {
    if (this.creating === true) {
      return;
    }

    this.creating = true;
    this.backend.adminCreateEmptyApplicationGetUrl(this.year).then(name => {
      const url = "https://staff.japan-impact.ch/apply/" + this.year + "/claim/" + name;
      this.createdLinks.push(url);
      this.creating = false;
    }).catch(err => {
      this.createdLinks.push("Erreur lors de la génération !");
      this.creating = false;
    });
  }
}

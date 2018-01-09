import {Component, OnInit} from '@angular/core';
import {AbstractEditionComponent} from "../../abstract-edition-component";
import {FormService} from "../../services/form.service";
import {BackendService} from "../../services/backend.service";
import {ActivatedRoute, ParamMap} from "@angular/router";

@Component({
  selector: 'app-admin-year-template',
  template: `
    <div *ngIf="error">
      <div class="alert alert-danger" role="alert">
        <b>Une erreur s'est produite : </b>
        <p [innerHtml]="error"></p>
      </div>
    </div>
    <div class="well" *ngIf="edition">
      <h2>Edition {{year}}</h2>
      <ul class="nav nav-pills">
        <li role="presentation" [class.active]="selected === 'waiting'"><a routerLink="applications/waiting">En
          attente</a></li>
        <li role="presentation" [class.active]="selected === 'refused'"><a
          routerLink="applications/refused">Refusées</a></li>
        <li role="presentation" [class.active]="selected === 'accepted'"><a
          routerLink="applications/accepted">Acceptées</a></li>
      </ul>
      <!--<p>Refresh les droits d'accès à l'espace staff : <button (click)="refreshAccessRights()" class="btn">Refresh</button></p>-->
      <!-- This button is commented out as it is normally not needed and its computation takes a long time. -->
    </div>
    <router-outlet *ngIf="edition"></router-outlet>

    <div *ngIf="!error && loading">
      <div class="well">
        <h2>Chargement des données en cours...</h2><br/>
      </div>
    </div>
  `
})
export class AdminYearTemplateComponent extends AbstractEditionComponent implements OnInit {

  selected: string;

  constructor(forms: FormService, backend: BackendService, route: ActivatedRoute) {
    super(forms, backend, route, true, false);
  }

  ngOnInit() {
    super.ngOnInit();

    this.route.paramMap.subscribe((params: ParamMap) => {
      // (+) before `params.get()` turns the string into a number
      this.selected = params.get('state');
    });
  }

  refreshAccessRights() {
    this.backend.refreshAccessRights(this.year);
  }

}

import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {BackendService} from "../services/backend.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {FormService, LoadedForm} from "../services/form.service";
import {Response} from "@angular/http";

@Component({
  selector: 'app-view-application',
  templateUrl: './view-application.component.html'
})
export class ViewApplicationComponent implements OnInit {
  edition: LoadedForm = null;
  application: Application = null;
  loading: boolean = true;
  error: string = null;

  constructor(public forms: FormService, public backend: BackendService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.url.subscribe(url => {
        this.forms.getEdition().then(edition => {
          this.edition = edition;
        }, err => {
          if (err instanceof Response) {
            this.error = (err as Response).json()["messages"].join("<br/>");
          } else {
            console.log(err);
            this.error = "Erreur inconnue";
          }
        })
          .then(u => this.backend.getOwnApplication(this.edition.edition.year))
          .then(app => {
            this.application = app;
          }, err => {
              if (err instanceof Response) {
                this.error = (err as Response).json()["messages"].join("<br/>");
              } else {
                console.log(err);
                this.error = "Erreur inconnue";
              }
            }
          )
          .then(u => {
            this.loading = false;
          });

      });
  }

  get stateLabel(): string {
    if (this.application.isAccepted) {
      return "label-success";
    } else if (this.application.isValidated) {
      return "label-warning";
    }
    return "label-danger";
  }

  get stateContent(): string {
    if (this.application.isAccepted) {
      return "Acceptée";
    } else if (this.application.isValidated) {
      return "En attente";
    }
    return "Non envoyée";
  }


}

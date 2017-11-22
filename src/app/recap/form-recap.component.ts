import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {BackendService} from "../services/backend.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {FormService, LoadedForm} from "../services/form.service";
import {Response} from "@angular/http";

@Component({
  selector: 'app-form-recap',
  templateUrl: './form-recap.component.html'
})
export class FormRecapComponent implements OnInit {
  edition: LoadedForm = null;
  application: Application = null;
  loading: boolean = true;
  error: string = null;
  form: FormGroup;

  constructor(public forms: FormService, public backend: BackendService, private route: ActivatedRoute, public router: Router) {
    this.form = new FormGroup({"conditions": new FormControl('', Validators.required)});
  }

  ngOnInit(): void {
    this.route.url.subscribe(url => {
        this.forms.getEdition().then(edition => {
          this.edition = edition;

          if (edition === null) {
            this.error = "Aucun recrutement ouvert pour le moment.";
          }
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
            if (this.application.isValidated) {
              this.router.navigate(["/view/"]);
            }
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

  onSubmit() {
    this.error = null;
    this.loading = true;

    this.backend.validateApplication(this.edition.edition.year)
      .then(success => {
        this.router.navigate(["/view/"]);
      })
      .catch(err => {
        console.log(err);
        if (err instanceof Response) {
          this.error = (err as Response).json()["messages"].join("<br/>");
        } else {
          this.error = "Erreur inconnue";
        }
        this.loading = false;
      });
  }

  onGoBack() {
    this.router.navigate(["/apply/"]);
  }
}

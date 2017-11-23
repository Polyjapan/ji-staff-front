import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {BackendService} from "../../services/backend.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {FormService, LoadedForm} from "../../services/form.service";
import {Response} from "@angular/http";
import {AbstractEditionComponent} from "../../abstract-edition-component";

@Component({
  selector: 'app-apply-confirm',
  templateUrl: './apply-confirm.component.html'
})
export class ApplyConfirmComponent extends AbstractEditionComponent {
  form: FormGroup;

  constructor(forms: FormService, backend: BackendService, route: ActivatedRoute, public router: Router) {
    super(forms, backend, route);
    this.form = new FormGroup({"conditions": new FormControl('', Validators.required)});
  }

  completeInit(params: ParamMap): Promise<void> {
    if (this.application === null) {
      return Promise.reject("Aucune candidature en cours pour cette édition.");
    } else if (this.application.isValidated) {
      this.router.navigate(["/view", this.edition.edition.year]);
      return Promise.reject("Candidature déjà envoyée, redirection...");
    }

    return Promise.resolve(null);
  }

  onSubmit() {
    this.error = null;
    this.loading = true;

    this.backend.validateApplication(this.edition.edition.year)
      .then(success => {
        this.router.navigate(["/view", this.year]);
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
    this.router.navigate(["/apply/", this.year]);
  }
}

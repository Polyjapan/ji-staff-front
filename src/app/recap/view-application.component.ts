import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {BackendService} from "../services/backend.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {FormService, LoadedForm} from "../services/form.service";
import {Response} from "@angular/http";
import {AbstractEditionComponent} from "../form/abstract-edition-component";

@Component({
  selector: 'app-view-application',
  templateUrl: './view-application.component.html'
})
export class ViewApplicationComponent extends AbstractEditionComponent {
  constructor(forms: FormService, backend: BackendService, route: ActivatedRoute) {
    super(forms, backend, route, true);
  }

  completeInit(params: ParamMap): Promise<null> {
    if (this.application === null) {
      return Promise.reject("Aucune candidature en cours pour cette édition.");
    }

    return Promise.resolve(null);
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

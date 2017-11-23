import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {BackendService} from "../../services/backend.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {FormService, LoadedForm} from "../../services/form.service";
import {Response} from "@angular/http";
import {AbstractEditionComponent} from "../../abstract-edition-component";
import {getStateFancy, getStateLabel} from "../../utils/statelabels";

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
    return getStateLabel(this.application);
  }

  get stateContent(): string {
    return getStateFancy(this.application);
  }
}

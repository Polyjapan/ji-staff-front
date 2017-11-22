import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {BackendService} from "../services/backend.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {FormService, LoadedForm} from "../services/form.service";
import {Response} from "@angular/http";
import {isMinor} from "../utils/isminor";

@Component({
  selector: 'app-application-content',
  templateUrl: './application-content.component.html'
})
export class ApplicationContentComponent {
  @Input() edition: LoadedForm = null;
  @Input() application: Application = null;

  getValue(key: string) {
    return this.application.content[key];
  }

  get pages(): FormPage[] {
    return this.edition.edition.formData.filter(page => !page.minorOnly || this.isMinor());
  }

  isMinor(): boolean {
    const birthdate = this.application.content["birthdate"] as string;
    return isMinor(birthdate, this.edition.edition);
  }

}

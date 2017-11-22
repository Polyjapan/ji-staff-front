import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {BackendService} from "../services/backend.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {FormService, LoadedForm} from "../services/form.service";
import {Response} from "@angular/http";

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
    const regex = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;
    const data = regex.exec(birthdate);

    if (data === null) {
      return false;
    }

    const day = +data[1];
    const month = +data[2];
    const year = +data[3] + 18;

    const majority = new Date(year, month, day, 0, 0, 0);
    console.log(majority.getDate());
    return majority.getDate() > this.edition.edition.conventionStart;
  }

}

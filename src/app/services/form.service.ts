import {Injectable} from "@angular/core";
import {BackendService} from "./backend.service";
import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {isDateValid} from "../utils/dateutils";

@Injectable()
export class FormService {
  private _editions: Map<string, LoadedForm> = new Map<string, LoadedForm>();

  constructor(private backend: BackendService) {
  }

  /**
   * Get the current edition as a promise
   * @returns {Promise<Edition>} the current edition (or null if it doesn't exist)
   */
  getEdition(year: string): Promise<LoadedForm> {
    if (this._editions[year]) {
      return Promise.resolve(this._editions[year]);
    } else {
      return this.backend.getEdition(year).then(e => {
        this._editions[year] = new LoadedForm(e);
        return this._editions[year];
      }).catch(err => null);
    }
  }
}

export class LoadedForm {
  constructor(public edition: Edition) {
  }

  getPage(page: number): FormPage {
    if (this.edition.formData[page].pageNumber === page) {
      return this.edition.formData[page];
    } else {
      return this.edition.formData.filter((val, u, u2) => val.pageNumber === page)[0];
    }
  }

  isActive(): boolean {
    const current = Date.now();

    return current > this.edition.applicationsStart && current < this.edition.applicationsEnd;
  }


  buildValidator(field: FormField): ValidatorFn {
    let validatorFn: ValidatorFn = null;
    if (field.required) {
      validatorFn = Validators.compose([validatorFn, Validators.required]);
    }

    field.validators.forEach(val => {
      switch (val.type) {
        case "intbounds":
          validatorFn = Validators.compose([validatorFn, Validators.min(val["min"]), Validators.max(val["max"])]);
          break;
        case "date":
          const fn: ValidatorFn = (c: AbstractControl) => isDateValid(c.value as string) ? null : { key: "date" };
          validatorFn = Validators.compose([validatorFn, fn]);
      }
    });

    return validatorFn;
  }


  totalPages(): number {
    return this.edition.formData.length;
  }

  getFields(page: number): FormField[] {
    return this.getPage(page).fields.sort((a, b) => a.order - b.order);
  }

  buildFormGroup(page: number, values?: Map<string, object>): FormGroup {
    values = values === null ? new Map() : values; // no empty map please

    const group: any = {};
    this.getFields(page).forEach(field => {
      const value = values[field.key];
      group[field.key] = new FormControl(value || '', this.buildValidator(field));
    });
    return new FormGroup(group);
  }
}

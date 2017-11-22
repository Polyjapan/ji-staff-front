import {Injectable} from "@angular/core";
import {BackendService} from "./backend.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";

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
      group[field.key] = field.required ? new FormControl(value || '', Validators.required)
        : new FormControl(value || '');
    });
    return new FormGroup(group);
  }
}

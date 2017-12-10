import {Component, Input} from "@angular/core";
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-form-field',
  templateUrl: './form-field.component.html'
})
export class FormFieldComponent {
  @Input() field: FormField;
  @Input() form: FormGroup;
  get isValid() { return this.form.controls[this.field.key].valid; }
  get errors() { return this.form.controls[this.field.key].errors; }
  get fancyError() {
    if (this.errors === null) {
      return null;
    }

    switch (this.errors.key) {
      case "date":
        return "Format de date invalide. Requis: JJ/MM/AAAA";
      default:
        return null;
    }
  }
  get groupClass() { return "form-group" +
     (this.isValid ? "" : " has-error"); }
}

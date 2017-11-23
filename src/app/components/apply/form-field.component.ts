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
}

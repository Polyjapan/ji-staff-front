import {Component, Input, OnInit, Output} from '@angular/core';
import {LoadedForm} from "../../services/form.service";
import {isMinor} from "../../utils/dateutils";
import {Application, BackendService} from "../../services/backend.service";
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-application-single-field-form',
  templateUrl: './single-field-form.component.html'
})
export class SingleFieldFormComponent implements OnInit {
  @Input() edition: LoadedForm;
  @Input() page: number;
  @Input() field: FormField = null;
  @Input() editable: boolean = false;
  @Input() application: Application = null;
  editing: boolean = false;

  form: FormGroup;
  error: string;
  sending: boolean = false;

  constructor(private backend: BackendService) {}

  loadForm() {
    this.form = this.edition.buildFormGroupForField(this.field, this.getValue(this.field.key));
  }

  ngOnInit(): void {
    this.loadForm();
  }

  getValue(key: string) {
    return this.application.content[key];
  }

  onSubmit() {
    const toSend = {};
    const fields: string[] = this.edition.getFields(this.page).map((field) => field.key);
    for (const i in this.application.content) {
      if (fields.indexOf(i) !== -1) {
        toSend[i] = this.application.content[i];
      }
    }

    toSend[this.field.key] = this.form.getRawValue()[this.field.key];

    // Remove empty fields
    Object.keys(toSend).forEach(key => {
      if (typeof toSend[key] === "string" && (toSend[key] as string).length === 0) {
        delete toSend[key];
      }
    });

    // Reset component
    this.error = null;
    this.sending = true;

    // Update application
    this.backend.adminUpdateApplication(this.edition.edition.year, this.page, this.application.userId, toSend)
      .then(success => {
        this.sending = false;
        if (success) {
          this.editing = false;
          this.application.content[this.field.key] = toSend[this.field.key];
        } else {
          this.error = "Erreur inconnue";
        }
      })
      .catch(err => {
        console.log(err);
        this.sending = false;
        if (err instanceof Response) {
          this.error = (err as Response).json()["messages"].join("<br/>");
        } else {
          this.error = "Erreur inconnue";
        }
      });
  }

  openEdit() {
    this.editing = true;
  }
}

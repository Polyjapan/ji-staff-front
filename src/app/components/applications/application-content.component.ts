import {Component, Input} from '@angular/core';
import {LoadedForm} from "../../services/form.service";
import {isMinor} from "../../utils/dateutils";
import {Application} from "../../services/backend.service";

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

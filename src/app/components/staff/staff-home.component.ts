import { Component } from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {AbstractEditionComponent} from "../../abstract-edition-component";
import {BackendService} from "../../services/backend.service";
import {FormService} from "../../services/form.service";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {environment} from "../../../environments/environment";
import {FileUploader, ParsedResponseHeaders} from "ng2-file-upload";
import {FileItem} from "ng2-file-upload/file-upload/file-item.class";
import {isMinor} from "../../utils/dateutils";

@Component({
  selector: 'app-staff-home',
  templateUrl: './staff-home.component.html'
})
export class StaffHomeComponent extends AbstractEditionComponent {
  public pictureUploader: FileUploader;
  public allowanceUploader: FileUploader;

  constructor(public forms: FormService, public backend: BackendService, public route: ActivatedRoute, public auth: AuthService) {
    super(forms, backend, route, true);
  }

  private setupUploader() {
    this.pictureUploader = this.backend.uploadPicture(this.year);
    const self = this;
    this.pictureUploader.onCompleteItem = function (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) {
      return self.backend.getOwnApplication(self.edition.edition.year)
      // Here we do a promise inside the promise as we want to handle application load errors separately
        .then(application => self.application = application, ignored => null);
    };
  }

  private setupAllowanceUploader() {
    this.allowanceUploader = this.backend.uploadAllowance(this.year);
    const self = this;
    this.allowanceUploader.onCompleteItem = function (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) {
      return self.backend.getOwnApplication(self.edition.edition.year)
      // Here we do a promise inside the promise as we want to handle application load errors separately
        .then(application => self.application = application, ignored => null);
    };
  }

  completeInit(params: ParamMap): Promise<void> {
    return super.completeInit(params).then(v => {
      this.setupUploader();
      this.setupAllowanceUploader();
    });
  }

  get pictureUrl(): string {
    return environment.uploads + this.application.picture;
  }

  get formUrl(): string {
    return environment.uploads + this.application.parentalAllowance;
  }

  get emptyFormUrl(): string {
    return environment.uploads + "formulaire-autorisation-" + this.year + ".pdf";
  }

  isMinor(): boolean {
    const birthdate = this.application.content["birthdate"] as string;
    return isMinor(birthdate, this.edition.edition);
  }
}

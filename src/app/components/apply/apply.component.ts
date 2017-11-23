import {Component} from '@angular/core';
import {BackendService} from "../../services/backend.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {FormGroup} from "@angular/forms";
import {FormService} from "../../services/form.service";
import {Response} from "@angular/http";
import {isMinor} from "../../utils/isminor";
import {AbstractEditionComponent} from "../../abstract-edition-component";

@Component({
  selector: 'app-apply',
  templateUrl: './apply.component.html'
})
export class ApplyComponent extends AbstractEditionComponent {
  page: number = 0;
  form: FormGroup;

  constructor(forms: FormService, backend: BackendService, route: ActivatedRoute, public router: Router) {
    super(forms, backend, route);
  }

  loadPage(page: number) {
    this.form = this.edition.buildFormGroup(page, (this.application !== null) ? this.application.content : null);
  }

  preInit(params: ParamMap): Promise<void> {
    this.form = null;

    if (params.has("page")) {
      this.page = +params.get("page");
    } else {
      this.page = 0;
    }

    return Promise.resolve(null);
  }

  completeInit(params: ParamMap): Promise<void> {
    if (this.application != null && this.application.isValidated) {
      this.router.navigate(["/view", this.edition.edition.year]);
      return Promise.reject("Candidature déjà envoyée, redirection...");
    }

    if (this.page >= this.edition.totalPages()) {
      this.edition = null;
      return Promise.reject("Cette page n'existe pas");
    }

    this.loadPage(this.page);
    return Promise.resolve(null);
  }

  onSubmit() {
    const toSend = this.form.getRawValue();

    // Remove empty fields
    Object.keys(toSend).forEach(key => {
      if (typeof toSend[key] === "string" && (toSend[key] as string).length === 0) {
        delete toSend[key];
      }
    });

    // Reset component
    this.error = null;
    this.loading = true;

    // Update application
    this.backend.updateApplication(this.edition.edition.year, this.page, toSend)
      .then(success => {
        if (this.hasNextPage) {
          // Continue the form
          this.router.navigate(["/apply", this.year, this.nextPage]);
        } else {
          // Go to the confirmation
          this.router.navigate(["/apply", this.year, "confirm"]);
        }
      })
      .catch(err => {
        console.log(err);
        if (err instanceof Response) {
          this.error = (err as Response).json()["messages"].join("<br/>");
        } else {
          this.error = "Erreur inconnue";
        }
        this.loading = false;
      });
  }

  get currentPage(): FormPage {
    return this.edition.getPage(this.page);
  }

  get hasNextPage(): boolean {
    return this.page < this.edition.totalPages() - 1;
  }

  get nextPage(): number {
    return this.edition.edition.formData.filter(page => {
      return page.pageNumber > this.page && (!page.minorOnly || this.isMinor());
    }).sort((p1, p2) => p1.pageNumber - p2.pageNumber)[0].pageNumber;
  }

  get fields(): FormField[] {
    return this.edition.getFields(this.page);
  }

  isMinor(): boolean {
    let birthdate = null;
    if (this.form !== null && this.form.contains("birthdate")) {
      birthdate = this.form.get("birthdate").value as string;
    } else {
      if (this.application === null || !this.application.content["birthdate"]) {
        return false;
      }
      birthdate = this.application.content["birthdate"] as string;
    }

    return isMinor(birthdate, this.edition.edition);
  }

}

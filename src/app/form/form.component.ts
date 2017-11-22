import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {BackendService} from "../services/backend.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {FormGroup} from "@angular/forms";
import {FormService, LoadedForm} from "../services/form.service";
import {Response} from "@angular/http";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {
  edition: LoadedForm = null;
  application: Application = null;
  loading: boolean = true;
  error: string = null;
  page: number = 0;
  form: FormGroup;

  constructor(public forms: FormService, public backend: BackendService, private route: ActivatedRoute, public router: Router) {
  }

  loadPage(page: number) {
    this.form = this.edition.buildFormGroup(page, (this.application !== null) ? this.application.content : null);
  }

  ngOnInit(): void {
    this.route.paramMap
      .subscribe((params: ParamMap) => {
        this.form = null;

        if (params.has("page")) {
          this.page = +params.get("page");
        } else {
          this.page = 0;
        }

        let future = null;

        if (this.edition != null) {
          future = Promise.resolve(this.edition);
        } else {
          future = this.forms.getEdition();
        }

        future.then(edition => {
          if (edition === null) {
            this.error = "Aucun recrutement ouvert pour le moment.";
          }
          this.edition = edition;
        }, err => {
          if (err instanceof Response) {
            this.error = (err as Response).json()["messages"].join("<br/>");
          } else {
            console.log(err);
            this.error = "Erreur inconnue";
          }
        }).then(u => this.backend.getOwnApplication(this.edition.edition.year))
          .then(app => {
              this.application = app;
              if (this.application.isValidated) {
                this.router.navigate(["/view/"]);
              }
            }, err => {
              console.log(err);
              return;
            }
          ).then(u => this.loadPage(this.page))
          .then(u => {
            this.loading = false;
          });

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
      return page.pageNumber > this.page && (!page.minorOnly || this.isMinor())
    }).sort((p1, p2) => p1.pageNumber - p2.pageNumber)[0].pageNumber;
  }

  get fields(): FormField[] {
    return this.edition.getFields(this.page);
  }

  onSubmit() {
    const toSend = this.form.getRawValue();

    Object.keys(toSend).forEach(key => {
      if (typeof toSend[key] === "string" && (toSend[key] as string).length === 0) {
        delete toSend[key];
      }
    });

    this.error = null;
    this.loading = true;

    this.backend.updateApplication(this.edition.edition.year, this.page, toSend)
      .then(success => {
        if (this.hasNextPage) {
          this.router.navigate(["/apply/", this.nextPage]);
        } else {
          this.router.navigate(["/apply/", "confirm"])
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

    const regex = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;
    const data = regex.exec(birthdate);

    if (data === null) {
      return false;
    }

    const day = +data[1];
    const month = +data[2];
    const year = +data[3] + 18;

    const majority = new Date(year, month - 1, day, 0, 0, 0);
    return majority.getTime() > this.edition.edition.conventionStart;
  }

}

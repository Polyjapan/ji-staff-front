import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {BackendService} from "./services/backend.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {FormGroup} from "@angular/forms";
import {FormService, LoadedForm} from "./services/form.service";
import {Response} from "@angular/http";
import {isMinor} from "./utils/isminor";
import {reject} from "q";

export abstract class AbstractEditionComponent implements OnInit {
  edition: LoadedForm = null;
  application: Application = null;
  loading: boolean = true;
  error: string = null;
  year: string = null;

  constructor(public forms: FormService, public backend: BackendService, private route: ActivatedRoute,
              public allowClosed: boolean = false) {
  }

  /**
   * Do some operations after the initialization of edition and application. This method is called by the init.
   * When it's called, `edition`and `application` are loaded
   * @param {ParamMap} params the url params
   */
  completeInit(params: ParamMap): Promise<void> {
    return Promise.resolve(null);
  }

  preInit(params: ParamMap): Promise<void> {
    return Promise.resolve(null);
  }

  private loadYear(params: ParamMap): Promise<string> {
    if (!params.has("year")) {
      return Promise.reject("URL incorrecte (année manquante)");
    }
    this.year = params.get("year");
    return Promise.resolve(this.year);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.preInit(params);
      // Get the year in the URL


      // Load the edition from the year
      this.loadYear(params)
        .then(year => this.preInit(params))
        .then(u => this.forms.getEdition(this.year))
        .then(edition => {
          if (edition === null) {
            return reject("Cette édition n'existe pas");
          } else if (!edition.isActive() && !this.allowClosed) {
            return reject("Cette édition n'accepte plus de candidatures");
          } else {
            this.edition = edition;
          }
        })
        .then(
          // Here we do a promise inside the promise as we want to handle application load errors separately
          u => this.backend.getOwnApplication(this.edition.edition.year)
            .then(application => this.application = application, ignored => null))
        .then(ignored => this.completeInit(params))
        .then(u => { this.loading = false; })
        .catch(err => {
        this.loading = false;
        if (typeof err === "string") {
          this.error = err;
        } else if (err instanceof Response) {
          this.error = (err as Response).json()["messages"].join("<br/>");
        } else {
          this.error = "Erreur inconnue, " + err;
          console.log(err);
        }
      });

    });
  }
}

import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Application, BackendService} from "./services/backend.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {FormGroup} from "@angular/forms";
import {FormService, LoadedForm} from "./services/form.service";
import {Response} from "@angular/http";
import {isMinor} from "./utils/dateutils";
import {reject} from "q";
import {environment} from "../environments/environment";

export abstract class AbstractEditionComponent implements OnInit {
  edition: LoadedForm = null;
  application: Application = null;
  loading: boolean = true;
  error: string = null;
  year: string = null;

  constructor(public forms: FormService, public backend: BackendService, public route: ActivatedRoute,
              public allowClosed: boolean = false, public requestApplication: boolean = true) {
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
    this.route.paramMap.subscribe(p => this.onUriChange(p));
  }

  catchError(err) {
    this.loading = false;
    if (typeof err === "string") {
      this.error = err;
    } else if (err instanceof Response) {
      this.error = (err as Response).json()["messages"].join("<br/>");
    } else {
      this.error = "Erreur inconnue, " + err;
      console.log(err);
    }
  }

  protected onUriChange(params: ParamMap): void {
    this.loading = true;
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
        u => {
          if (this.requestApplication) {
            return this.loadApplication();
          }
          return null;
        })
      .then(ignored => this.completeInit(params))
      .then(u => {
        this.loading = false;
      })
      .catch(err => this.catchError(err));
  }

  loadApplication(): Promise<Application> {
    return this.backend.getOwnApplication(this.edition.edition.year)
    // Here we do a promise inside the promise as we want to handle application load errors separately
      .then(application => this.application = application, ignored => null);
  }

  get parentalAllowanceClasses(): string {
    if (this.application.parentalAllowanceAccepted === true) {
      return "label label-success";
    } else if (this.application.parentalAllowanceAccepted === false) {
      return "label label-danger";
    } else {
      return "label label-warning";
    }
  }

  get parentalAllowanceLabel(): string {
    if (this.application.parentalAllowanceAccepted === true) {
      return "Vérifiée et acceptée";
    } else if (this.application.parentalAllowanceAccepted === false) {
      return "Refusée";
    } else {
      return "En attente de vérification";
    }
  }

  get pictureUrl(): string {
    return environment.uploads + this.application.picture;
  }

  get formUrl(): string {
    return AbstractEditionComponent.formUrl(this.application);
  }

  static formUrl(application: Application): string {
    return environment.uploads + application.parentalAllowance;
  }

  isMinor(): boolean {
    const birthdate = this.application.content["birthdate"] as string;
    return isMinor(birthdate, this.edition.edition);
  }

}

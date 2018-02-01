import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {BackendService} from "../../services/backend.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {FormService, LoadedForm} from "../../services/form.service";
import {Response} from "@angular/http";
import {AbstractEditionComponent} from "../../abstract-edition-component";

@Component({
  selector: 'app-apply-claim',
  templateUrl: './apply-claim.component.html'
})
export class ApplyClaimComponent implements OnInit {
  loading: boolean = true;
  error: string;

  constructor(public backend: BackendService, public route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(p => {
      const code = p.get("code");
      const year = p.get("year");

      if (!code || !year) {
        this.loading = false;
        this.error = "Données manquantes dans l'URL !";
        return;
      }

      this.backend.claimEmptyApplication(year, code).then(rep =>
        this.loading = false
      ).catch(err => {
        if (typeof err === "string") {
          this.error = err;
        } else if (err instanceof Response) {
          this.error = (err as Response).json()["messages"].join("<br/>");
        } else {
          this.error = "Erreur inconnue, " + err;
          console.log(err);
        }
        this.loading = false;
      });
    });
  }
}

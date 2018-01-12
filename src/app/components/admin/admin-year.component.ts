import {Component, OnInit} from '@angular/core';
import {environment} from "../../../environments/environment";
import {BackendService} from "../../services/backend.service";
import {ActivatedRoute} from "@angular/router";
import {ApplicationsService} from "./applications.service";
import {FileItem} from "ng2-file-upload/file-upload/file-item.class";
import {FileUploader, ParsedResponseHeaders} from "ng2-file-upload";

@Component({
  selector: 'app-admin-year',
  template: `
    <div class="well">
      <h3>Formulaire d'autorisation parentale</h3>
      <p>Version actuelle (<b>peut ne pas exister !</b>) : <a href="{{emptyFormUrl}}">{{emptyFormUrl}}</a></p>
      
      <h4>Mettre à jour le formulaire</h4>
      <p *ngIf="updated">Formulaire mis à jour !</p>
      <input *ngIf="uploader" type="file" ng2FileSelect [uploader]="uploader">
      <div class="progress" *ngIf="uploader && uploader.queue[0]">
        <div class="progress-bar progress-bar-striped" role="progressbar" [ngStyle]="{ 'width': uploader.queue[0].progress + '%' }"></div>
      </div>
    </div>
    
    <app-admin-applications-authorizations-template [year]="year"></app-admin-applications-authorizations-template>
  `
})
export class AdminYearComponent implements OnInit {
  public year: string;
  public updated: boolean = false;
  public uploader: FileUploader;

  constructor(private backend: BackendService, private route: ActivatedRoute) {}

  get emptyFormUrl(): string {
    return environment.uploads + "formulaire-autorisation-" + this.year + ".pdf";
  }

  private setupUploader() {
    this.uploader = this.backend.uploadEmptyForm(this.year);
    const self = this;
    this.uploader.onCompleteItem = function (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) {
      if (status < 400) {
        self.updated = true;
      }
    };
  }

  ngOnInit(): void {
    this.route.parent.paramMap.subscribe(p => {
      this.year = p.get("year");
      this.setupUploader();
    });
  }
}

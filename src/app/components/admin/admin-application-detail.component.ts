import {Component, OnInit} from '@angular/core';
import {AbstractEditionComponent} from "../../abstract-edition-component";
import {FormService} from "../../services/form.service";
import {BackendService, Application, Comment} from "../../services/backend.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {ApplicationsService} from "./applications.service";
import {getState, getStateFancy, getStateLabel} from "../../utils/statelabels";
import {environment} from "../../../environments/environment";
import {FileItem} from "ng2-file-upload/file-upload/file-item.class";
import {FileUploader, ParsedResponseHeaders} from "ng2-file-upload";

@Component({
  selector: 'app-admin-applications-detail',
  template: `
    <div *ngIf="error">
      <div class="alert alert-danger" role="alert">
        <b>Une erreur s'est produite : </b>
        <p [innerHtml]="error"></p>
      </div>
    </div>

    <div class="well" *ngIf="application">
      <p>Cette candidature est actuellement <b class="label {{stateLabel}}">{{stateContent}}</b></p>
      <p *ngIf="application.validationDate">Validée le <b>{{date}}</b></p>
      <app-application-single-field-form
        [edition] = "edition"
        [editable] = "true"
        [application] = "application"
        [page] = "mail"
        [field] = "emailFormField"
      ></app-application-single-field-form>
      <p *ngIf="application.statusChangedBy">Dernier changement d'état par <b>{{application.statusChangedBy[1]}}</b>
        (<code>{{application.statusChangedBy[0]}}</code>)</p>
      <p>
        <button (click)="accept()" class="btn btn-success">Accepter cette candidature</button>
        <button (click)="refuse()" class="btn btn-danger">Refuser cette candidature</button>
      </p>
    </div>

    <div class="well" *ngIf="application">

      <h3>Commentaires :</h3>
      <div class="form-horizontal">
        <div class="form-group">
          <label for="newComment" class="col-sm-2 control-label">Nouveau commentaire</label>
          <div class="col-sm-10">
            <textarea class="form-control" #newComment id="newComment" name="newComment"></textarea>
          </div>
        </div>

        <div class="form-group">
          <div class="col-sm-offset-2 col-sm-10">
            <button class="btn btn-primary" #newCommentBtn (click)="addComment(newComment, newCommentBtn)">Envoyer</button>
          </div>
        </div>
      </div>
      <ul>
        <li *ngFor="let comment of application.comments">
          <b>{{comment.authorName}} le {{dateOfComment(comment)}} : </b>{{comment.comment}}
        </li>
      </ul>
    </div>

    <div class="well" *ngIf="application">
      <h2 *ngIf="application.picture">Image utilisateur :</h2>
      <img *ngIf="application.picture" src="{{pictureUrl}}" width="100%">
      <a *ngIf="application.picture" href="{{pictureUrl}}">Lien direct : {{pictureUrl}}</a>

      <h4>Uploader une image</h4>
      <input type="file" ng2FileSelect [uploader]="pictureUploader">
      <div class="progress" *ngIf="pictureUploader.queue[0]">
        <div class="progress-bar progress-bar-striped" role="progressbar" [ngStyle]="{ 'width': pictureUploader.queue[0].progress + '%' }"></div>
      </div>
      
      <h2 *ngIf="application.parentalAllowance">Autorisation parentale :
        <span [class]="parentalAllowanceClasses">{{parentalAllowanceLabel}}</span></h2>

      <p *ngIf="application.parentalAllowance" >Lien : <a href="{{formUrl}}">{{formUrl}}</a></p>
      <p *ngIf="application.parentalAllowance && !application.parentalAllowanceAccepted">
        <a class="btn btn-success" (click)="acceptAllowance()">Accepter</a>
        <a class="btn btn-danger" (click)="refuseAllowance()">Refuser</a>
      </p>
      <p *ngIf="application.parentalAllowanceAccepted === false">Refusée pour le motif : {{application.parentalAllowanceRefused}}</p>
    </div>

    <app-application-content *ngIf="edition && application" [edition]="edition" [editable]="true"
                             [application]="application"></app-application-content>

    <div *ngIf="!error && loading">
      <div class="well">
        <h2>Chargement des données en cours...</h2><br/>
      </div>
    </div>
  `
})
export class AdminApplicationDetailComponent extends AbstractEditionComponent implements OnInit {
  pictureUploader: FileUploader;
  selected: string;

  constructor(forms: FormService, backend: BackendService, public applicationsService: ApplicationsService, route: ActivatedRoute, public router: Router) {
    super(forms, backend, route, true, false);
  }

  private setupUploader() {
    this.pictureUploader = this.backend.uploadPicture(this.year, this.selected);
    const self = this;
    this.pictureUploader.onCompleteItem = function (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) {
      return self.completeInit(null);
    };
  }

  accept() {
    const currentState = getState(this.application);
    this.applicationsService.accept(this.year, this.application)
      .then(succ => this.router.navigate(["admin", this.year, "applications", currentState]))
      .catch(err => this.catchError(err));
  }

  refuse() {
    const currentState = getState(this.application);
    this.applicationsService.refuse(this.year, this.application)
      .then(succ => this.router.navigate(["admin", this.year, "applications", currentState]))
      .catch(err => this.catchError(err));
  }

  completeInit(params: ParamMap): Promise<void> {
    return this.backend.getApplication(this.year, this.selected).then(rep => {
      this.application = rep;
      this.setupUploader();
    });
  }

  ngOnInit(): void {
    this.route.parent.paramMap.subscribe(p => super.onUriChange(p));
    this.route.paramMap.subscribe(p => super.onUriChange(this.route.parent.snapshot.paramMap));
  }

  preInit(params: ParamMap): Promise<void> {
    this.selected = this.route.snapshot.paramMap.get('userid');
    if (!this.selected) {
      return Promise.reject("Aucun utilisateur demandé.");
    }
    return super.preInit(params);
  }

  get stateLabel(): string {
    return getStateLabel(this.application);
  }

  get stateContent(): string {
    return getStateFancy(this.application);
  }

  get date(): string {
    const date = new Date(this.application.validationDate);
    return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " à " +
      date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
  }

  dateOfComment(comment: Comment): string {
    const date = new Date(comment.date);
    return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " à " +
      date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
  }

  addComment(field: HTMLTextAreaElement, btn: HTMLButtonElement) {
    const val = field.value;
    btn.disabled = true;
    this.backend.addComment(this.year, this.selected, val)
      .then(success => {
        console.log(success);
        this.application.comments.unshift(success.json()["comment"]);
        field.value = "";
        btn.disabled = false;
      })
      .catch(err => {
        console.log(err);
        btn.disabled = false;
        if (err instanceof Response) {
          this.error = (err as Response).json()["messages"].join("<br/>");
        } else {
          this.error = "Erreur inconnue";
        }
      });
  }

  acceptAllowance() {
    this.backend.acceptAuthorisation(this.year, this.application.userId, true).then(u => this.loadApplication());
  }

  refuseAllowance() {
    const reason = prompt("Donnez un motif de refus :");
    this.backend.acceptAuthorisation(this.year, this.application.userId, false, reason).then(u => this.loadApplication());
  }

  get emailFormField(): FormField {
    return {
      key: "mail",
      label: "EMail",
      helpText: "Email du staff",
      required: true,
      order: 0,
      additionalData: {},
      validators: [],
      topLevel: true,
      controlType: "email"
    };
  }
}

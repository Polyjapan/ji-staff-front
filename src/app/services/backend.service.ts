import {Injectable} from '@angular/core';
import {Headers, Http, Response} from "@angular/http";
import 'rxjs/add/operator/toPromise';
import {AuthHttp} from "angular2-jwt";
import {environment} from '../../environments/environment';
import {AuthService} from "../components/auth/auth.service";
import {FileUploader} from "ng2-file-upload";
import {FileLikeObject} from "ng2-file-upload/file-upload/file-like-object.class";


@Injectable()
/**
 * Provides mapping to the magic keeper forms
 */
export class BackendService {
  private _baseApiUrl = environment.apiurl;
  private _editionsUrl = this._baseApiUrl + "/editions";
  private _applicationsUrl = this._baseApiUrl + "/applications";

  constructor(private http: Http, private authHttp: AuthHttp, private authService: AuthService) {
  }

  getEditions(): Promise<Edition[]> {
    return this.http
      .get(this._editionsUrl)
      .toPromise()
      .then(result => result.json() as Edition[]);
  }

  getActiveEdition(): Promise<Edition> {
    return this.http
      .get(this._editionsUrl + "/active")
      .toPromise()
      .then(result => result.json() as Edition[])
      .then(result => result.length > 0 ? result[0] : null);
  }

  getEdition(year: string): Promise<Edition> {
    return this.http
    .get(this._editionsUrl + "/" + year)
    .toPromise()
    .then(result => result.json() as Edition);
  }

  getOwnApplication(year: string): Promise<Application> {
    return this.authHttp
      .get(this._applicationsUrl + "/" + year)
      .toPromise()
      .then(result => result.json() as Application);
  }

  getApplications(year: string, state: string): Promise<Application[]> {
    return this.authHttp
      .get(this._applicationsUrl + "/" + year + "/" + state)
      .toPromise()
      .then(result => result.json() as Application[]);
  }

  getApplication(year: string, userId: string): Promise<Application> {
    return this.authHttp
      .get(this._applicationsUrl + "/" + year + "/" + userId)
      .toPromise()
      .then(result => result.json() as Application);
  }

  validateApplication(year: string): Promise<Response> {
    return this.authHttp
      .put(this._applicationsUrl + "/" + year, {})
      .toPromise();
  }

  setApplicationStatus(year: string, userId: string, state: string): Promise<Response> {
    return this.authHttp
      .put(this._applicationsUrl + "/" + year + "/" + state, {'userId': userId})
      .toPromise();
  }

  updateApplication(year: string, page: number, content: object): Promise<Response> {
    return this.authHttp
      .put(this._applicationsUrl + "/" + year + "/" + page, content,
        {
          headers: new Headers({'Content-Type': 'application/json'})
        }).toPromise();
  }

  addComment(year: string, userId: string, comment: string): Promise<Response> {
    return this.authHttp
      .post(this._applicationsUrl + "/" + year + "/" + "comments", {'userId': userId, 'comment': comment},
        {
          headers: new Headers({'Content-Type': 'application/json'})
        }).toPromise();
  }

  adminUpdateApplication(year: string, page: number, userId: string, content: object): Promise<Response> {
    return this.authHttp
      .put(this._applicationsUrl + "/" + year + "/" + userId + "/" + page, content,
        {
          headers: new Headers({'Content-Type': 'application/json'})
        }).toPromise();
  }

  refreshAccessRights(year: string) {
    this.authHttp.post(this._applicationsUrl + "/" + year + "/grants", {}).toPromise();
  }

  acceptAuthorisation(year: string, userId: string, accepted: boolean, reason?: string): Promise<Response> {
    return this.authHttp.put(this._applicationsUrl + "/" + year + "/parentalAuthorization/accepted", {
      userId: userId, status: accepted, reason: reason
    }).toPromise();
  }

  uploadPicture(year: string): FileUploader {
    return new FileUploader({
      autoUpload: true,
      removeAfterUpload: true,
      queueLimit: 1,
      url: this._applicationsUrl + "/" + year + "/picture",
      method: 'PUT',
      authToken: "Bearer " + this.authService.getRawToken(),
      disableMultipart: true,
      allowedMimeType: [
        "image/jpeg",
        "image/bmp",
        "image/png",
        "image/tiff"
      ]
    });
  }

  uploadAllowance(year: string): FileUploader {
    return new FileUploader({
      autoUpload: true,
      removeAfterUpload: true,
      queueLimit: 1,
      url: this._applicationsUrl + "/" + year + "/parentalAuthorization",
      method: 'PUT',
      authToken: "Bearer " + this.authService.getRawToken(),
      disableMultipart: true,
      allowedMimeType: [
        "image/jpeg",
        "image/bmp",
        "image/png",
        "image/tiff",
        "application/pdf"
      ]
    });
  }

  uploadEmptyForm(year: string): FileUploader {
    return this.errorItem(new FileUploader({
      autoUpload: true,
      removeAfterUpload: true,
      queueLimit: 1,
      url: this._editionsUrl + "/" + year + "/parentalForm",
      method: 'PUT',
      authToken: "Bearer " + this.authService.getRawToken(),
      disableMultipart: true,
      allowedMimeType: [
        "application/pdf"
      ]
    }));
  }

  private errorItem(uploader: FileUploader): FileUploader {
    uploader.onWhenAddingFileFailed = function (item: FileLikeObject, filter: any, options: any) {
      alert("Erreur d'envoi : format de fichier invalide.");
    };
    return uploader;
  }
}

export class Application {
  userId: string;
  mail: string;
  year: string;
  isValidated: string;
  isAccepted: boolean;
  isRefused?: boolean;
  validationDate?: number;
  statusChangedBy?: string[];
  comments?: Comment[];
  content: Map<string, object>;
  picture?: string;
  parentalAllowance?: string;
  parentalAllowanceAccepted?: boolean;
  parentalAllowanceRefused?: string;
}

export class Comment {
  authorName: string;
  authorId: string;
  date: number;
  comment: string;
}

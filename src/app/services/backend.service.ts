import {Injectable} from '@angular/core';
import {Headers, Http, Response} from "@angular/http";
import 'rxjs/add/operator/toPromise';
import {AuthHttp} from "angular2-jwt";
import {environment} from '../../environments/environment';


@Injectable()
/**
 * Provides mapping to the magic keeper forms
 */
export class BackendService {
  private _baseApiUrl = environment.apiurl;
  private _editionsUrl = this._baseApiUrl + "/editions";
  private _applicationsUrl = this._baseApiUrl + "/applications";

  constructor(private http: Http, private authHttp: AuthHttp) {
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
}

export class Comment {
  authorName: string;
  authorId: string;
  date: number;
  comment: string;
}

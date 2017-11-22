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

  validateApplication(year: string): Promise<Response> {
    return this.authHttp
      .put(this._applicationsUrl + "/" + year, {})
      .toPromise();
  }

  updateApplication(year: string, page: number, content: object): Promise<Response> {
    return this.authHttp
      .put(this._applicationsUrl + "/" + year + "/" + page, content,
        {
          headers: new Headers({'Content-Type': 'application/json'})
        }).toPromise();
  }
}

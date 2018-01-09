import { Injectable } from '@angular/core';
import { AUTH_CONFIG } from './auth0-variables';
import {ActivatedRoute, Router, RouterState} from '@angular/router';
import * as auth0 from 'auth0-js';
import 'rxjs/add/operator/toPromise';
import {JwtHelper} from "angular2-jwt";


// https://staff-japan-impact.auth0.com/login?client=5AoVH0Qx1cIJNndHwlCCX1CGVHtU9XIo
// &protocol=oauth2
// &response_type=id_token
// &scope=openid profile email


@Injectable()
export class AuthService {
  auth0 = new auth0.WebAuth({
    clientID: AUTH_CONFIG.clientID,
    domain: AUTH_CONFIG.domain,
    responseType: 'id_token',
    redirectUri: AUTH_CONFIG.callbackURL,
    scope: 'openid profile email'
  });
  jwtHelper: JwtHelper = new JwtHelper();

  constructor(public router: Router) {}

  public login(): void {
    // Get router state
    const url = this.router.routerState.snapshot.url;
    sessionStorage.setItem("loginRedirect", url);

    this.auth0.authorize();
  }

  public handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      console.log(authResult);

      if (authResult && authResult.idToken) {
        window.location.hash = '';
        this.setSession(authResult);
        const target = sessionStorage.getItem("loginRedirect");
        this.router.navigateByUrl(target == null ? "/" : target);
        sessionStorage.removeItem("loginRedirect");
      } else if (err) {
        console.log(err);
        alert(`Authentication error: ${err.error}`);
        this.router.navigate(['/']);
      }
    });
  }

  private setSession(authResult): void {
    // Set the time that the access token will expire at
    localStorage.setItem('id_token', authResult.idToken);
  }

  public logout(): void {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('id_token');
    // Go back to the home route
    this.router.navigate(['/']);
  }

  public getToken() {
    const token = localStorage.getItem("id_token");
    return this.jwtHelper.decodeToken(token);
  }

  public isAdmin(): boolean {
    const token = this.getToken();
    return token ? token["https://staff.japan-impact.ch/admin"] as boolean : false;
  }

  public isStaff(year: string): boolean {
    const token = this.getToken();
    return token && token["https://staff.japan-impact.ch/isStaff"] ?
       (token["https://staff.japan-impact.ch/isStaff"] as string[]).indexOf(year) !== -1 : false;
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem("id_token");
    if (token === null) {
      return false;
    }

    try {
      return !this.jwtHelper.isTokenExpired(token);
    } catch (e) {
      return false;
    }
  }
}

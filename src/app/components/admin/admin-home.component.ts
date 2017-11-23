import { Component } from '@angular/core';
import {AuthService} from "../auth/auth.service";

@Component({
  selector: 'app-admin-home',
  template: `
    <div class="well">

      <h1>Bienvenue sur l'espace administration, {{auth.getToken().given_name}}</h1>
      <ul>
        <li><a routerLink="2018">Edition 2018</a></li>
      </ul>
    </div>
  `
})
export class AdminHomeComponent {
  constructor(public auth: AuthService) {}
}

import { Component } from '@angular/core';
import {AuthService} from "./components/auth/auth.service";

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html'
})
export class WelcomeComponent {
  constructor(public auth: AuthService) {
  }
}

import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
import {AuthService} from "../auth/auth.service";
import {ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router/src/router_state";

@Injectable()
export class StaffGuardService implements CanActivate {
  constructor(private auth: AuthService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.auth.isStaff(route.paramMap.get("year"));
  }
}

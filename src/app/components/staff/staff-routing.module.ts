import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {StaffGuardService} from "./staff-guard.service";
import {StaffHomeComponent} from "./staff-home.component";


const routes: Routes = [
  {
    path: 'staff/:year',
    component: StaffHomeComponent,
    canActivate: [StaffGuardService],
  }
  // { path: 'apply', redirectTo: 'apply/2018'},
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class StaffRoutingModule {}

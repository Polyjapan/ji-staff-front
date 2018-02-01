import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ApplyConfirmComponent} from "./apply-confirm.component";
import {ApplyComponent} from "./apply.component";
import {ApplyClaimComponent} from "./apply-claim.component";


const routes: Routes = [
  { path: 'apply/:year/confirm', component: ApplyConfirmComponent },
  { path: 'apply/:year/claim/:code', component: ApplyClaimComponent },
  { path: 'apply/:year/:page', component: ApplyComponent },
  { path: 'apply/:year', component: ApplyComponent },
  { path: 'apply', redirectTo: 'apply/2018'},
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class ApplyRoutingModule {}

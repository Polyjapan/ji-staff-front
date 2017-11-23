import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ViewApplicationComponent} from "./view-application.component";


const routes: Routes = [
  { path: 'view/:year', component: ViewApplicationComponent },
  { path: 'view/', redirectTo: "view/2018" },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class ViewRoutingModule {}

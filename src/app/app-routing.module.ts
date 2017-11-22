import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PageNotFoundComponent} from "./page-not-found.component";
import {WelcomeComponent} from "./welcome.component";
import {FormComponent} from "./form/form.component";
import {FormRecapComponent} from "./recap/form-recap.component";
import {ViewApplicationComponent} from "./recap/view-application.component";

const routes: Routes = [
  { path: '', component: WelcomeComponent },
  // In a near future we might want to create a page to list all the past and future editions, when no edition is open
  // { path: 'editions/', component: EditionsComponent },
  { path: 'view/:year', component: ViewApplicationComponent },
  { path: 'apply/:year/confirm', component: FormRecapComponent },
  { path: 'apply/:year/:page', component: FormComponent },
  { path: 'apply/:year', component: FormComponent },
  { path: 'apply', redirectTo: 'apply/2018'},
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}

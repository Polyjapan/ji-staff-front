import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PageNotFoundComponent} from "./page-not-found.component";
import {WelcomeComponent} from "./welcome.component";
import {FormComponent} from "./form/form.component";
import {FormRecapComponent} from "./recap/form-recap.component";
import {ViewApplicationComponent} from "./recap/view-application.component";

const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'view', component: ViewApplicationComponent },
  { path: 'apply', component: FormComponent },
  { path: 'apply/confirm', component: FormRecapComponent },
  { path: 'apply/:page', component: FormComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}

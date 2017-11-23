import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PageNotFoundComponent} from "./page-not-found.component";
import {WelcomeComponent} from "./welcome.component";
import {ApplyComponent} from "./components/apply/apply.component";
import {ApplyConfirmComponent} from "./components/apply/apply-confirm.component";
import {ViewApplicationComponent} from "./components/view/view-application.component";

const routes: Routes = [
  { path: '', component: WelcomeComponent },
  // In a near future we might want to create a page to list all the past and future editions, when no edition is open
  // { path: 'editions/', component: EditionsComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}

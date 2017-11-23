import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AdminGuardService} from "./admin-guard.service";
import {AdminHomeComponent} from "./admin-home.component";
import {AdminTemplateComponent} from "./admin-template.component";
import {AdminYearTemplateComponent} from "./admin-year-template.component";
import {AdminApplicationsComponent} from "./admin-applications.component";
import {AdminYearComponent} from "./admin-year.component";
import {AdminApplicationDetailComponent} from "./admin-application-detail.component";


const routes: Routes = [
  {
    path: 'admin',
    component: AdminTemplateComponent,
    canActivate: [AdminGuardService],

    children: [
      {
        path: ':year',
        component: AdminYearTemplateComponent,
        children: [
          {
            path: 'application/view/:userid',
            component: AdminApplicationDetailComponent
          },
          {
            path: 'applications/:state',
            component: AdminApplicationsComponent
          },
          {
            path: '',
            component: AdminYearComponent
          },
        ]
      },
      {
        path: '',
        component: AdminHomeComponent,
      }
    ]
  }

  // { path: 'apply', redirectTo: 'apply/2018'},
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AdminRoutingModule {}

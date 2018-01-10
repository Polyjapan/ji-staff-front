import {NgModule} from '@angular/core';
import {AdminRoutingModule} from "./admin-routing.module";
import {BrowserModule} from "@angular/platform-browser";
import {ReactiveFormsModule} from "@angular/forms";
import {ApplicationContentModule} from "../applications/application-content.module";
import {PipesModule} from "../../pipes/pipes.module";
import {AdminHomeComponent} from "./admin-home.component";
import {AdminTemplateComponent} from "./admin-template.component";
import {AdminYearTemplateComponent} from "./admin-year-template.component";
import {AdminApplicationsComponent} from "./admin-applications.component";
import {AdminYearComponent} from "./admin-year.component";
import {AdminApplicationDetailComponent} from "./admin-application-detail.component";
import {ApplicationsService} from "./applications.service";
import {AdminGuardService} from "./admin-guard.service";
import {FileUploadModule} from "ng2-file-upload";

@NgModule({
  declarations: [
    AdminHomeComponent,
    AdminTemplateComponent,
    AdminYearTemplateComponent,
    AdminApplicationsComponent,
    AdminYearComponent,
    AdminApplicationDetailComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    ApplicationContentModule,
    AdminRoutingModule,
    PipesModule,
    FileUploadModule
  ],
  providers: [
    ApplicationsService,
    AdminGuardService
  ]
})
export class AdminModule {}

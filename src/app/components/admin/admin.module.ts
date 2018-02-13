import {NgModule} from '@angular/core';
import {AdminRoutingModule} from "./admin-routing.module";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
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
import {AdminParentalAuthorizationsComponent} from "./admin-parental-authorizations.component";
import {AdminPhotosComponent} from "./admin-photos.component";

@NgModule({
  declarations: [
    AdminHomeComponent,
    AdminTemplateComponent,
    AdminYearTemplateComponent,
    AdminApplicationsComponent,
    AdminYearComponent,
    AdminApplicationDetailComponent,
    AdminParentalAuthorizationsComponent,
    AdminPhotosComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    ApplicationContentModule,
    AdminRoutingModule,
    PipesModule,
    FileUploadModule,
    FormsModule
  ],
  providers: [
    ApplicationsService,
    AdminGuardService
  ]
})
export class AdminModule {}

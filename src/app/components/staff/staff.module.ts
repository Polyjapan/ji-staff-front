import {NgModule} from '@angular/core';
import {BrowserModule} from "@angular/platform-browser";
import {ReactiveFormsModule} from "@angular/forms";
import {ApplicationContentModule} from "../applications/application-content.module";
import {PipesModule} from "../../pipes/pipes.module";
import {StaffRoutingModule} from "./staff-routing.module";
import {StaffGuardService} from "./staff-guard.service";
import {StaffHomeComponent} from "./staff-home.component";
import {FileUploadModule} from "ng2-file-upload";


@NgModule({
  declarations: [
    StaffHomeComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    ApplicationContentModule,
    StaffRoutingModule,
    PipesModule,
    FileUploadModule
  ],
  providers: [
    StaffGuardService
  ]
})
export class StaffModule {}

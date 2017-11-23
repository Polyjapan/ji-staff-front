import {NgModule} from '@angular/core';
import {ViewApplicationComponent} from "./view-application.component";
import {ApplicationContentModule} from "../applications/application-content.module";
import {ViewRoutingModule} from "./view-routing.module";
import {BrowserModule} from "@angular/platform-browser";

@NgModule({
  declarations: [
    ViewApplicationComponent
  ],
  imports: [
    ApplicationContentModule,
    ViewRoutingModule,
    BrowserModule
  ]
})
export class ViewModule {
}

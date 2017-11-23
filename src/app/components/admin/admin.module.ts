import {NgModule} from '@angular/core';
import {AdminRoutingModule} from "./admin-routing.module";
import {BrowserModule} from "@angular/platform-browser";
import {ReactiveFormsModule} from "@angular/forms";
import {ApplicationContentModule} from "../applications/application-content.module";
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
  declarations: [

  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    ApplicationContentModule,
    AdminRoutingModule,
    PipesModule
  ]
})
export class ApplyModule {
}

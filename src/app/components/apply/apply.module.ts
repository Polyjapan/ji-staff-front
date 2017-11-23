import {NgModule} from '@angular/core';
import {ApplyRoutingModule} from "./apply-routing.module";
import {BrowserModule} from "@angular/platform-browser";
import {ReactiveFormsModule} from "@angular/forms";
import {ApplyComponent} from "./apply.component";
import {ApplyConfirmComponent} from "./apply-confirm.component";
import {FormFieldComponent} from "./form-field.component";
import {ApplicationContentModule} from "../applications/application-content.module";
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    ApplyComponent,
    ApplyConfirmComponent,
    FormFieldComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    ApplicationContentModule,
    ApplyRoutingModule,
    PipesModule
  ]
})
export class ApplyModule {
}

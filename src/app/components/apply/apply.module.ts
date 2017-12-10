import {NgModule} from '@angular/core';
import {ApplyRoutingModule} from "./apply-routing.module";
import {BrowserModule} from "@angular/platform-browser";
import {ApplyComponent} from "./apply.component";
import {ApplyConfirmComponent} from "./apply-confirm.component";
import {ApplicationContentModule} from "../applications/application-content.module";
import {FormsModule} from "../forms/forms.module";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    ApplyComponent,
    ApplyConfirmComponent
  ],
  imports: [
    BrowserModule,
    ApplicationContentModule,
    ApplyRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class ApplyModule {
}

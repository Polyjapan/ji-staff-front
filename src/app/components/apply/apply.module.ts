import {NgModule} from '@angular/core';
import {ApplyRoutingModule} from "./apply-routing.module";
import {BrowserModule} from "@angular/platform-browser";
import {ApplyComponent} from "./apply.component";
import {ApplyConfirmComponent} from "./apply-confirm.component";
import {ApplicationContentModule} from "../applications/application-content.module";
import {FormsModule} from "../forms/forms.module";
import {ReactiveFormsModule} from "@angular/forms";
import {ApplyClaimComponent} from "./apply-claim.component";

@NgModule({
  declarations: [
    ApplyComponent,
    ApplyConfirmComponent,
    ApplyClaimComponent
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

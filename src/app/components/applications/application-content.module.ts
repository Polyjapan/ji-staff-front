import {NgModule} from '@angular/core';
import {ApplicationContentComponent} from "./application-content.component";
import {BrowserModule} from "@angular/platform-browser";
import {SingleFieldFormComponent} from "./single-field-form.component";
import {FormsModule} from "../forms/forms.module";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    ApplicationContentComponent,
    SingleFieldFormComponent
  ],
  exports: [
    ApplicationContentComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule
  ]
})
export class ApplicationContentModule {
}

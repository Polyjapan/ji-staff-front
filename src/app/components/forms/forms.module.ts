import {NgModule} from '@angular/core';
import {BrowserModule} from "@angular/platform-browser";
import {ReactiveFormsModule} from "@angular/forms";
import {PipesModule} from "../../pipes/pipes.module";
import {FormFieldComponent} from "./form-field.component";

@NgModule({
  declarations: [
    FormFieldComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    PipesModule
  ],
  exports: [
    FormFieldComponent
  ]
})
export class FormsModule {
}

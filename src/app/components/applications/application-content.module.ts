import {NgModule} from '@angular/core';
import {ApplicationContentComponent} from "./application-content.component";
import {BrowserModule} from "@angular/platform-browser";

@NgModule({
  declarations: [
    ApplicationContentComponent
  ],
  exports: [
    ApplicationContentComponent
  ],
  imports: [
    BrowserModule
  ]
})
export class ApplicationContentModule {
}

import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {HttpModule} from '@angular/http';
import {PageNotFoundComponent} from "./page-not-found.component";
import {AppRoutingModule} from "./app-routing.module";
import {WelcomeComponent} from "./welcome.component";
import {FormComponent} from "./form/form.component";
import {FormFieldComponent} from "./form/form-field.component";
import {ReactiveFormsModule} from "@angular/forms";
import {BackendService} from "./services/backend.service";
import {AuthModule} from "./auth/auth.module";
import {AuthService} from "./auth/auth.service";
import {FormService} from "./services/form.service";
import {ReplaceNl} from "./form/replacenl.pipe";
import {FormRecapComponent} from "./recap/form-recap.component";
import {ViewApplicationComponent} from "./recap/view-application.component";
import {ApplicationContentComponent} from "./recap/application-content.component";

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    WelcomeComponent,
    FormComponent,
    FormFieldComponent,
    ReplaceNl,
    FormRecapComponent,
    ViewApplicationComponent,
    ApplicationContentComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AuthModule
  ],
  providers: [
    BackendService,
    AuthService,
    FormService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

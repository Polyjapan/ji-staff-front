import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {HttpModule} from '@angular/http';
import {PageNotFoundComponent} from "./page-not-found.component";
import {AppRoutingModule} from "./app-routing.module";
import {WelcomeComponent} from "./welcome.component";
import {BackendService} from "./services/backend.service";
import {AuthModule} from "./components/auth/auth.module";
import {FormService} from "./services/form.service";
import {ApplicationContentModule} from "./components/applications/application-content.module";
import {ApplyModule} from "./components/apply/apply.module";
import {ViewModule} from "./components/view/view.module";

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    WelcomeComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AuthModule,

    ApplicationContentModule,
    ApplyModule,
    ViewModule,

    AppRoutingModule
  ],
  providers: [
    BackendService,
    FormService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

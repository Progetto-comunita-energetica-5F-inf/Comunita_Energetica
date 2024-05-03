import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { ButtonComponent } from './resumable/button/button.component';
import { MagneticComponent } from './resumable/magnetic/magnetic.component';
import { InViewportDirective } from './directive/in-viewport.directive';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    LandingPageComponent,
    ButtonComponent,
    MagneticComponent,
    InViewportDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }

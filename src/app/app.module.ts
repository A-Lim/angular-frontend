import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { NxWelcomeComponent } from './nx-welcome.component';
import { RouterModule, provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { CommonModule, registerLocaleData } from '@angular/common';
import { appRoutes } from './app.routes';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { IconsProviderModule } from './icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';

registerLocaleData(en);

@NgModule({
  imports: [BrowserModule, NxWelcomeComponent, FormsModule, HttpClientModule, BrowserAnimationsModule, AppRoutingModule, IconsProviderModule, NzLayoutModule, NzMenuModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [
    // provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    { provide: NZ_I18N, useValue: en_US }
  ],
})
export class AppModule {}

import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// import { AngularSvgIconModule } from 'angular-svg-icon';
import { ServiceLocator } from './shared/services/servicelocator';
import { AppRoutingModule } from 'app/app-routing.module';
import { AppComponent } from 'app/app.component';
// interceptor
import { AuthInterceptor } from 'app/core/interceptors/auth.interceptor';
import { HttpErrorInterceptor } from 'app/core/interceptors/httperror.interceptor';
// modules
import { SharedModule } from 'app/shared/shared.module';

import { AbilityModule } from '@casl/angular';
import { Ability, PureAbility } from '@casl/ability';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    AbilityModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor(private injector: Injector) {
    ServiceLocator.injector = this.injector;
  }
}

import { registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import en from '@angular/common/locales/en';
import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TitleStrategy } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
import { AuthInterceptor } from '@core/interceptors/auth.interceptor';
import { ErrorInterceptor } from '@core/interceptors/error.interceptor';
import { AppPrefixTitleStrategy } from '@core/services/app-prefix.titlestrategy';
import { AuthEffects } from '@core/states/auth/auth.effects';
import { AUTH_FEATURE_KEY, AUTH_REDUCER } from '@core/states/auth/auth.reducer';
import { SessionEffects } from '@core/states/session/session.effects';
import { SESSION_REDUCER } from '@core/states/session/session.reducer';
import { SESSION_FEATURE_KEY } from '@core/states/session/session.state';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TranslocoRootModule } from './transloco-root.module';

registerLocaleData(en);

const reducers = {
  [AUTH_FEATURE_KEY]: AUTH_REDUCER,
  [SESSION_FEATURE_KEY]: SESSION_REDUCER,
};

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,

    StoreModule.forRoot(reducers, {
      metaReducers: [],
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictStateSerializability: true,
        strictActionWithinNgZone: true,
        strictActionTypeUniqueness: true,
      },
    }),
    EffectsModule.forRoot([AuthEffects, SessionEffects]),
    StoreDevtoolsModule.instrument({ logOnly: !isDevMode() }),
    TranslocoRootModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    { provide: TitleStrategy, useClass: AppPrefixTitleStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
})
export class AppModule {}

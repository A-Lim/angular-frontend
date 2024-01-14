import { NgModule, isDevMode } from '@angular/core';
import { TranslocoModule, provideTransloco } from '@ngneat/transloco';
import { provideTranslocoPersistTranslations } from '@ngneat/transloco-persist-translations';
import { TranslocoHttpLoader } from './transloco-loader';

@NgModule({
  exports: [TranslocoModule],
  providers: [
    provideTransloco({
      config: {
        availableLangs: ['en'],
        defaultLang: 'en',
        // Remove this option if your application doesn't support changing language in runtime.
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
    provideTranslocoPersistTranslations({
      loader: TranslocoHttpLoader,
      storage: { useValue: localStorage },
    }),
  ],
})
export class TranslocoRootModule {}

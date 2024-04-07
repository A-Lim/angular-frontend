import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, take } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';

@Injectable({ providedIn: 'any' })
export class UtilTranslocoService {
  private _translocoService = inject(TranslocoService);

  translate(keys: string[]) {
    const streams: Observable<string>[] = [];

    keys.forEach((key) => {
      const translation = this._translocoService.selectTranslate<string>(key).pipe(take(1));
      streams.push(translation);
    });

    return forkJoin(streams);
  }
}

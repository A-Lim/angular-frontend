import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, of, switchMap, take, tap } from 'rxjs';
import { ComponentStore } from '@ngrx/component-store';
import { TranslocoService } from '@ngneat/transloco';
import { NzModalService } from 'ng-zorro-antd/modal';
import { FormCreatePackagesComponent } from '@modules/packages/components/form-create-packages/form-create-packages.component';

@Injectable()
export class PagePackagesComponentStore extends ComponentStore<object> {
  private _modalService = inject(NzModalService);
  private _translocoService = inject(TranslocoService);

  constructor() {
    super({});
  }

  // #region SELECTORS
  // #endRegion

  // #region REDUCERS
  // #endRegion

  // #region EFFECTS
  readonly createPackagesModal = this.effect((onOk$: Observable<() => void>) =>
    onOk$.pipe(
      switchMap((onOk) =>
        forkJoin([
          this._translocoService.selectTranslate<string>('package-module.create').pipe(take(1)),
          of(onOk),
        ])
      ),
      tap(([nzTitle, onOk]) => {
        this._modalService.create({
          nzTitle,
          nzWidth: 1024,
          nzContent: FormCreatePackagesComponent,
          nzOnOk: onOk,
        });
      })
    )
  );
  // #endregion
}

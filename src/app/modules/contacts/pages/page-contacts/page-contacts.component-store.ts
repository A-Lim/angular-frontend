import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, of, switchMap, take, tap } from 'rxjs';
import { ComponentStore } from '@ngrx/component-store';
import { TranslocoService } from '@ngneat/transloco';
import { NzModalService } from 'ng-zorro-antd/modal';
import { FormCreateContactsComponent } from '@modules/contacts/components/form-create-contacts/form-create-contacts.component';

@Injectable()
export class PageContactsComponentStore extends ComponentStore<object> {
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
  readonly createContactsModal = this.effect((onOk$: Observable<() => void>) =>
    onOk$.pipe(
      switchMap((onOk) =>
        forkJoin([
          this._translocoService.selectTranslate<string>('create-contacts').pipe(take(1)),
          of(onOk),
        ])
      ),
      tap(([nzTitle, onOk]) => {
        this._modalService.create({
          nzTitle,
          nzWidth: 800,
          nzContent: FormCreateContactsComponent,
          nzOnOk: onOk,
        });
      })
    )
  );
  // #endregion
}

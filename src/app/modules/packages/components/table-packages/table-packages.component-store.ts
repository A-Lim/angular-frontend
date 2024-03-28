import { Injectable, TemplateRef, inject } from '@angular/core';
import { Observable, forkJoin, of, switchMap, take, tap } from 'rxjs';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { TranslocoService } from '@ngneat/transloco';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UtilAggridService } from '@shared/services/util-aggrid.service';
import { UtilModalService } from '@shared/services/util-modal.service';
import { Package } from '@modules/packages/models/package.model';
import { PackagesApiService } from '@modules/packages/packages.api-service';
import { FormEditPackageComponent } from '../form-edit-package/form-edit-package.component';

interface TablePackagesState {
  actionCell?: TemplateRef<any>;
}

const TablePackagesInitialState: TablePackagesState = {};

@Injectable()
export class TablePackagesComponentStore extends ComponentStore<TablePackagesState> {
  private _messageService = inject(NzMessageService);
  private _modalService = inject(NzModalService);
  private _utilModalService = inject(UtilModalService);
  private _packagesApiService = inject(PackagesApiService);
  private _utilAggridService = inject(UtilAggridService);
  private _translocoService = inject(TranslocoService);

  constructor() {
    super(TablePackagesInitialState);
  }

  // #region SELECTORS

  readonly dataSource$ = of((qParams: any) => this._packagesApiService.getPackages(qParams));

  readonly columnDefs$ = this.select(
    this.select((state) => state.actionCell),
    (actionCell) => {
      const colDefs = [
        this._utilAggridService.getIndexColDef(),
        this._utilAggridService.getColDef('Name', 'name', true, true),
        this._utilAggridService.getNumberColDef('Default Count', 'default_count', false),
        this._utilAggridService.getNumberColDef('Default Price', 'default_price', false),
        this._utilAggridService.getColDef('Description', 'description', false),
      ];

      if (actionCell) {
        colDefs.push(this._utilAggridService.getActionColDef('Action', '', 90, actionCell));
      }

      return colDefs;
    }
  );
  // #endRegion

  // #region REDUCERS
  readonly setActionCell = this.updater((state, actionCell: TemplateRef<any>) => ({
    ...state,
    actionCell,
  }));
  // #endRegion

  // #region EFFECTS
  readonly editPackageModal = this.effect(
    (
      data$: Observable<{
        pckage: Package;
        onOk: () => void;
      }>
    ) =>
      data$.pipe(
        switchMap(({ pckage, onOk }) =>
          forkJoin([
            of(pckage),
            this._translocoService.selectTranslate<string>('package.edit').pipe(take(1)),
            of(onOk),
          ])
        ),
        tap(([pckage, nzTitle, onOk]) => {
          this._modalService.create({
            nzTitle,
            nzWidth: 1024,
            nzContent: FormEditPackageComponent,
            nzOnOk: onOk,
            nzData: pckage,
          });
        })
      )
  );

  readonly deletePackage = this.effect(
    (
      data$: Observable<{
        id: number;
        onComplete: () => void;
      }>
    ) =>
      data$.pipe(
        switchMap((data) =>
          this._utilModalService.confirm$<{
            id: number;
            onComplete: () => void;
          }>(
            this._translocoService.selectTranslate('package.delete'),
            this._translocoService.selectTranslate('package.delete-message'),
            data
          )
        ),
        switchMap(({ id, onComplete }) =>
          this._packagesApiService.deletePackage(id).pipe(
            tapResponse(
              (response) => {
                if (response.message) {
                  this._messageService.success(response.message);
                }
                onComplete();
              },
              () => undefined
            )
          )
        )
      )
  );
  // #endregion
}

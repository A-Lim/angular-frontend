import { Injectable, TemplateRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, filter, forkJoin, map, of, switchMap, take, tap } from 'rxjs';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { TranslocoService } from '@ngneat/transloco';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UtilAggridService } from '@shared/services/util-aggrid.service';
import { UtilModalService } from '@shared/services/util-modal.service';
import { ContactsApiService } from '@modules/contacts/contacts.api-service';
import { FormEditContactComponent } from '../form-edit-contact/form-edit-contact.component';

interface TableContactsState {
  actionCell?: TemplateRef<any>;
}

const TableContactsInitialState: TableContactsState = {};

@Injectable()
export class TableContactsComponentStore extends ComponentStore<TableContactsState> {
  private _messageService = inject(NzMessageService);
  private _modalService = inject(NzModalService);
  private _utilModalService = inject(UtilModalService);
  private _contactsApiService = inject(ContactsApiService);
  private _utilAggridService = inject(UtilAggridService);
  private _translocoService = inject(TranslocoService);

  constructor() {
    super(TableContactsInitialState);
  }

  // #region SELECTORS

  readonly dataSource$ = of((qParams: any) => this._contactsApiService.getContacts(qParams));

  readonly columnDefs$ = this.select(
    this.select((state) => state.actionCell),
    (actionCell) => {
      const colDefs = [
        this._utilAggridService.getIndexColDef(),
        this._utilAggridService.getColDef('Name', 'name', true, true),
        this._utilAggridService.getLinkColDef('Email', 'email', 'email', true, true),
        this._utilAggridService.getLinkColDef('Phone', 'phone', 'phone', true, true),
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
  readonly editContactModal = this.effect(
    (
      data$: Observable<{
        id: number;
        onOk: () => void;
      }>
    ) =>
      data$.pipe(
        switchMap(({ id, onOk }) =>
          forkJoin([
            this._contactsApiService.getContact(id),
            this._translocoService.selectTranslate<string>('edit-contacts').pipe(take(1)),
            of(onOk),
          ])
        ),
        tap(([contact, nzTitle, onOk]) => {
          this._modalService.create({
            nzTitle,
            nzWidth: 800,
            nzContent: FormEditContactComponent,
            nzOnOk: onOk,
            nzData: {
              contact,
            },
          });
        })
      )
  );

  readonly deleteContact = this.effect(
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
            this._translocoService.selectTranslate('contact.delete'),
            this._translocoService.selectTranslate('contact.delete-message'),
            data
          )
        ),
        switchMap(({ id, onComplete }) =>
          this._contactsApiService.deleteContact(id).pipe(
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

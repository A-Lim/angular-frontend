import { Injectable, TemplateRef, inject } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { EMPTY, Observable, forkJoin, of, switchMap, take, tap } from 'rxjs';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Dictionary } from '@ngrx/entity';
import { TranslocoService } from '@ngneat/transloco';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UtilAggridService } from '@shared/services/util-aggrid.service';
import { UtilModalService } from '@shared/services/util-modal.service';
import { AppointmentPackage } from '@modules/customers/models/appontment-package.model';
import { Appointment } from '@modules/customers/models/appontment.model';
import { AppointmentsApiService } from '@modules/customers/services/appointments.api-service';
import { CustomersApiService } from '@modules/customers/services/customers.api-service';

interface TableCustomerAppointmentsState {
  customerId?: number;
  customerPackageId?: number;
  actionCell?: TemplateRef<any>;
}

const TableCustomerAppointmentsInitialState: TableCustomerAppointmentsState = {};

@Injectable()
export class TableCustomerAppointmentsComponentStore extends ComponentStore<TableCustomerAppointmentsState> {
  private _messageService = inject(NzMessageService);
  private _modalService = inject(NzModalService);
  private _translocoService = inject(TranslocoService);
  private _utilModalService = inject(UtilModalService);
  private _utilAggridService = inject(UtilAggridService);
  private _appointmentsApiService = inject(AppointmentsApiService);

  constructor() {
    super(TableCustomerAppointmentsInitialState);
  }

  // #region SELECTORS
  private readonly _customerId$ = this.select((state) => state.customerId);

  readonly dataSource$ = of((qParams: Dictionary<any>) =>
    this.select((state) => state.customerId).pipe(
      switchMap((customerId) => {
        if (customerId) {
          qParams['customer_id'] = customerId;
        }

        return this._appointmentsApiService.getAppointments(qParams);
      })
    )
  );

  readonly columnDefs$ = this.select(
    this.select((state) => state.actionCell),
    (actionCell) => {
      const packageNameFn = (params: any) => {
        return params.data?.packages.map((p: AppointmentPackage) => p.name).join(', ');
      };

      const colDefs: ColDef[] = [
        this._utilAggridService.getIndexColDef(),
        this._utilAggridService.getDateColDef('Date', 'created_at', 100),
        this._utilAggridService.getColDef('Package(s)', '', false, false, undefined, packageNameFn),
        this._utilAggridService.getColDef('Remarks', 'remarks', false),
      ];

      // hide action cell when customer package id is provided
      if (actionCell) {
        colDefs.push(this._utilAggridService.getActionColDef('Action', '', 90, actionCell));
      }

      return colDefs;
    }
  );
  // #endRegion

  // #region REDUCERS
  readonly setCustomerId = this.updater((state, customerId: number) => ({
    ...state,
    customerId,
  }));

  readonly setActionCell = this.updater((state, actionCell: TemplateRef<any>) => ({
    ...state,
    actionCell,
  }));
  // #endRegion

  // #region EFFECTS
  readonly editCustomerAppointmentModal = this.effect(
    (
      data$: Observable<{
        appointment: Appointment;
        onOk: () => void;
      }>
    ) =>
      data$.pipe(
        switchMap(({ appointment, onOk }) =>
          forkJoin([
            of(appointment),
            this._translocoService
              .selectTranslate<string>('customer-module.edit-appointment')
              .pipe(take(1)),
            of(onOk),
          ])
        ),
        tap(([appointment, nzTitle, onOk]) => {
          // this._modalService.create({
          //   nzTitle,
          //   nzWidth: 1024,
          //   nzContent: FormCustomerEditAppointmentComponent,
          //   nzOnOk: onOk,
          //   nzData: appointment,
          // });
        })
      )
  );

  readonly deleteCustomerAppointment = this.effect(
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
            this._translocoService.selectTranslate('customer-module.delete-appointment'),
            this._translocoService.selectTranslate('customer-module.delete-appointment-message'),
            data
          )
        ),
        switchMap(({ id, onComplete }) =>
          this._appointmentsApiService.deleteAppointment(id).pipe(
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

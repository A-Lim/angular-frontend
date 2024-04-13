import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, of, switchMap, tap } from 'rxjs';
import { ComponentStore } from '@ngrx/component-store';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UtilTranslocoService } from '@shared/services/util-transloco.service';
import { Customer } from '@modules/customers/models/customer.model';
import { FormCustomerAddTransactionComponent } from '../form-customer-add-transaction/form-customer-add-transaction.component';

@Injectable()
export class TabCustomerAppointmentsComponentStore extends ComponentStore<object> {
  private _modalService = inject(NzModalService);
  private _utilTranslocoService = inject(UtilTranslocoService);

  constructor() {
    super({});
  }

  readonly openAddTransactionModal = this.effect(
    (
      data$: Observable<{
        customer: Customer;
        onOk: () => void;
      }>
    ) =>
      data$.pipe(
        switchMap((data) =>
          forkJoin([this._utilTranslocoService.translate(['add-appointment']), of(data)])
        ),
        tap(([[nzTitle], data]) => {
          // this._modalService.create({
          //   nzTitle,
          //   nzWidth: 1024,
          //   nzContent: FormCustomerAddTransactionComponent,
          //   nzOnOk: data.onOk,
          //   nzData: data.customer,
          // });
        })
      )
  );
}

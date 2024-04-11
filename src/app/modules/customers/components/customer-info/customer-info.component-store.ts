import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, of, switchMap, tap } from 'rxjs';
import { ComponentStore } from '@ngrx/component-store';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UtilTranslocoService } from '@shared/services/util-transloco.service';
import { Customer } from '@modules/customers/models/customer.model';
import { FormEditCustomerComponent } from '../form-edit-customer/form-edit-customer.component';

@Injectable()
export class CustomerInfoComponentStore extends ComponentStore<object> {
  private _modalService = inject(NzModalService);
  private _utilTranslocoService = inject(UtilTranslocoService);

  constructor() {
    super({});
  }

  // #region SELECTORS
  // #endregion

  // #region UPDATERS
  // #endregion

  // #region EFFECTS
  readonly openEditCustomerModal = this.effect(
    (
      data$: Observable<{
        customer: Customer;
        onOk: (customer: any) => void;
      }>
    ) =>
      data$.pipe(
        switchMap((data) =>
          forkJoin([this._utilTranslocoService.translate(['customer-module.edit']), of(data)])
        ),
        tap(([[nzTitle], data]) => {
          this._modalService
            .create({
              nzTitle,
              nzWidth: 1024,
              nzContent: FormEditCustomerComponent,
              nzData: data.customer,
            })
            .afterClose.subscribe((customer) => {
              if (customer) data.onOk(customer);
            });
        })
      )
  );
  // #endregion
}

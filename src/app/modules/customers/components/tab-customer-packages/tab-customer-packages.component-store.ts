import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, of, switchMap, take, tap } from 'rxjs';
import { ComponentStore } from '@ngrx/component-store';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UtilTranslocoService } from '@shared/services/util-transloco.service';
import { Customer } from '@modules/customers/models/customer.model';
import { FormCustomerAddPackageComponent } from '../form-customer-add-package/form-customer-add-package.component';

@Injectable()
export class TabCustomerPackagesComponentStore extends ComponentStore<object> {
  private _modalService = inject(NzModalService);
  private _utilTranslocoService = inject(UtilTranslocoService);

  constructor() {
    super({});
  }

  readonly openAddPackageModal = this.effect(
    (
      data$: Observable<{
        customer: Customer;
        onOk: () => void;
      }>
    ) =>
      data$.pipe(
        switchMap((data) =>
          forkJoin([this._utilTranslocoService.translate(['add-package']), of(data)])
        ),
        tap(([[nzTitle], data]) => {
          this._modalService.create({
            nzTitle,
            nzWidth: 1024,
            nzContent: FormCustomerAddPackageComponent,
            nzOnOk: data.onOk,
            nzData: data.customer,
          });
        })
      )
  );
}

import { Injectable, inject } from '@angular/core';
import { of } from 'rxjs';
import { ComponentStore } from '@ngrx/component-store';
import { NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { CustomerPackage } from '@modules/customers/models/customer-package.model';

@Injectable()
export class CustomerPackageInfoComponentStore extends ComponentStore<object> {
  private readonly _customerPackage: CustomerPackage = inject(NZ_MODAL_DATA);

  constructor() {
    super({});
  }

  // #region SELECTORS
  readonly customerPackage$ = of(this._customerPackage);
  // #endregion

  // #region UPDATERS
  // #endregion

  // #region EFFECTS
  // readonly openEditCustomerModal = this.effect(
  //   (
  //     data$: Observable<{
  //       customer: Customer;
  //       onOk: (customer: any) => void;
  //     }>
  //   ) =>
  //     data$.pipe(
  //       switchMap((data) =>
  //         forkJoin([this._utilTranslocoService.translate(['customer-module.edit']), of(data)])
  //       ),
  //       tap(([[nzTitle], data]) => {
  //         this._modalService
  //           .create({
  //             nzTitle,
  //             nzWidth: 1024,
  //             nzContent: FormEditCustomerComponent,
  //             nzData: data.customer,
  //           })
  //           .afterClose.subscribe((customer) => {
  //             if (customer) data.onOk(customer);
  //           });
  //       })
  //     )
  // );
  // #endregion
}

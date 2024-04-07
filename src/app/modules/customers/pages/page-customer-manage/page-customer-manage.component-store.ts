import { Injectable, inject } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Customer } from '@modules/customers/models/customer.model';
import { CustomersApiService } from '@modules/customers/services/customers.api-service';

interface PageCustomerManageState {
  customer?: Customer;
}

const PageCustomerManageInitialState: PageCustomerManageState = {};

@Injectable()
export class PageCustomerManageComponentStore extends ComponentStore<PageCustomerManageState> {
  private _customerApiService = inject(CustomersApiService);

  constructor() {
    super(PageCustomerManageInitialState);
  }

  // #region SELECTORS
  readonly customer$ = this.select((state) => state.customer);
  // #endRegion

  // #region REDUCERS
  readonly setCustomer = this.updater((state, customer: Customer) => ({
    ...state,
    customer,
  }));
  // #endRegion

  // #region EFFECTS
  readonly getCustomer = this.effect((id$: Observable<number>) =>
    id$.pipe(
      switchMap((id) =>
        this._customerApiService.getCustomer(id).pipe(
          tapResponse(
            (response) => this.setCustomer(response.data),
            () => undefined
          )
        )
      )
    )
  );
  // #endregion
}

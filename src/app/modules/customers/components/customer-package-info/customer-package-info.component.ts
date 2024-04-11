import { AsyncPipe, NgIf, NgSwitch, NgSwitchCase, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { FormCustomerEditPackageComponent } from '../form-customer-edit-package/form-customer-edit-package.component';
import { TableCustomerTransactionsComponent } from '../table-customer-transactions/table-customer-transactions.component';
import { CustomerPackageInfoComponentStore } from './customer-package-info.component-store';

@Component({
  selector: 'app-customer-package-info',
  standalone: true,
  imports: [
    AsyncPipe,
    TitleCasePipe,
    NgIf,
    NgSwitch,
    NgSwitchCase,
    NzButtonModule,
    NzTagModule,
    NzModalModule,
    TranslocoModule,
    FormCustomerEditPackageComponent,
    TableCustomerTransactionsComponent,
  ],
  templateUrl: './customer-package-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CustomerPackageInfoComponentStore],
})
export class CustomerPackageInfoComponent {
  private _componentStore = inject(CustomerPackageInfoComponentStore);

  readonly customerPackage$ = this._componentStore.customerPackage$;
}

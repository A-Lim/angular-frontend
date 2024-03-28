import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { UiFormControlErrorsComponent } from '@shared/components/ui-form-control-errors/ui-form-control-errors.component';
import { FormArrayCastPipe } from '@shared/pipes/form-array-cast.pipe';
import { FormGroupCastPipe } from '@shared/pipes/form-group-cast.pipe';
import { FormCreateCustomersComponentStore } from './form-create-customers.component-store';

@Component({
  selector: 'app-form-create-customers',
  standalone: true,
  imports: [
    AsyncPipe,
    FormArrayCastPipe,
    FormGroupCastPipe,
    NgClass,
    NgIf,
    NgFor,
    ReactiveFormsModule,
    NzButtonModule,
    NzFormModule,
    NzInputModule,
    NzToolTipModule,
    NzIconModule,
    NzModalModule,
    UiFormControlErrorsComponent,
    TranslocoModule,
  ],
  templateUrl: './form-create-customers.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FormCreateCustomersComponentStore],
})
export class FormCreateCustomersComponent implements OnInit {
  private _formCreateCustomersComponentStore = inject(FormCreateCustomersComponentStore);

  readonly formGroup$ = this._formCreateCustomersComponentStore.formGroup$;
  readonly loading$ = this._formCreateCustomersComponentStore.loading$;

  ngOnInit() {
    this._formCreateCustomersComponentStore.createForm();
  }

  addRows() {
    this._formCreateCustomersComponentStore.addRows();
  }

  deleteRow(index: number) {
    this._formCreateCustomersComponentStore.deleteRow(index);
  }

  submit() {
    this._formCreateCustomersComponentStore.submit();
  }
}

import { AsyncPipe, NgFor, NgIf } from '@angular/common';
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
import { FormCreateContactsComponentStore } from './form-create-contacts.component-store';

@Component({
  selector: 'app-form-create-contacts',
  standalone: true,
  imports: [
    AsyncPipe,
    FormArrayCastPipe,
    FormGroupCastPipe,
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
  templateUrl: './form-create-contacts.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FormCreateContactsComponentStore],
})
export class FormCreateContactsComponent implements OnInit {
  private _formCreateContactsComponentStore = inject(FormCreateContactsComponentStore);

  readonly formGroup$ = this._formCreateContactsComponentStore.formGroup$;
  readonly loading$ = this._formCreateContactsComponentStore.loading$;

  ngOnInit() {
    this._formCreateContactsComponentStore.createForm();
  }

  addRows() {
    this._formCreateContactsComponentStore.addRows();
  }

  deleteRow(index: number) {
    this._formCreateContactsComponentStore.deleteRow(index);
  }

  submit() {
    this._formCreateContactsComponentStore.submit();
  }
}

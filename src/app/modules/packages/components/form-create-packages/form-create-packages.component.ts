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
import { FormCreatePackagesComponentStore } from './form-create-packages.component-store';

@Component({
  selector: 'app-form-create-packages',
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
  templateUrl: './form-create-packages.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FormCreatePackagesComponentStore],
})
export class FormCreatePackagesComponent implements OnInit {
  private _formCreatePackagesComponentStore = inject(FormCreatePackagesComponentStore);

  readonly formGroup$ = this._formCreatePackagesComponentStore.formGroup$;
  readonly loading$ = this._formCreatePackagesComponentStore.loading$;

  ngOnInit() {
    this._formCreatePackagesComponentStore.createForm();
  }

  addRows() {
    this._formCreatePackagesComponentStore.addRows();
  }

  deleteRow(index: number) {
    this._formCreatePackagesComponentStore.deleteRow(index);
  }

  submit() {
    this._formCreatePackagesComponentStore.submit();
  }
}

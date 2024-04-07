import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { UiFormControlErrorsComponent } from '@shared/components/ui-form-control-errors/ui-form-control-errors.component';
import { FormEditPackageComponentStore } from './form-edit-package.component-store';

@Component({
  selector: 'app-form-edit-package',
  standalone: true,
  imports: [
    AsyncPipe,
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
  templateUrl: './form-edit-package.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FormEditPackageComponentStore],
})
export class FormEditPackageComponent {
  private _formEditPackageComponentStore = inject(FormEditPackageComponentStore);

  readonly formGroup$ = this._formEditPackageComponentStore.formGroup$;
  readonly loading$ = this._formEditPackageComponentStore.loading$;

  submit() {
    this._formEditPackageComponentStore.submit();
  }
}

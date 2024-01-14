import { AsyncPipe, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { UiFormControlErrorsComponent } from '@shared/components/ui-form-control-errors/ui-form-control-errors.component';
import { FormLoginComponentStore } from './form-login.component-store';

@Component({
  selector: 'app-form-login',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    UiFormControlErrorsComponent,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    TranslocoModule,
  ],
  templateUrl: './form-login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FormLoginComponentStore],
})
export class FormLoginComponent implements OnInit {
  private _formLoginComponentStore = inject(FormLoginComponentStore);

  readonly loading$ = this._formLoginComponentStore.loading$;
  readonly formGroup$ = this._formLoginComponentStore.formGroup$;

  ngOnInit() {
    this._formLoginComponentStore.createForm();
  }

  submit() {
    this._formLoginComponentStore.submit();
  }
}

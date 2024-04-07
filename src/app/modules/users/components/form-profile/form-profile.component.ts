import { AsyncPipe, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { environment } from '@environments/environment';
import { TranslocoModule } from '@ngneat/transloco';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { User } from '@core/models/user.model';
import { UiFormControlErrorsComponent } from '@shared/components/ui-form-control-errors/ui-form-control-errors.component';
import { FormProfileComponentStore } from './form-profile.component-store';

@Component({
  selector: 'app-form-profile',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    NgFor,
    TitleCasePipe,
    ReactiveFormsModule,
    NzAvatarModule,
    NzButtonModule,
    NzDatePickerModule,
    NzFormModule,
    NzSpaceModule,
    NzInputModule,
    NzSelectModule,
    NzTagModule,
    UiFormControlErrorsComponent,
    TranslocoModule,
  ],
  templateUrl: './form-profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FormProfileComponentStore],
})
export class FormProfileComponent implements OnInit {
  private _formProfileComponentStore = inject(FormProfileComponentStore);

  @Input() set user(value: User | null | undefined) {
    this._formProfileComponentStore.setUser(value);
  }

  readonly loading$ = this._formProfileComponentStore.loading$;
  readonly genders$ = this._formProfileComponentStore.genders$;
  readonly formGroup$ = this._formProfileComponentStore.formGroup$;
  readonly DATE_FORMAT = environment.dateFormat;

  ngOnInit() {
    this._formProfileComponentStore.createForm();
  }

  submit() {
    this._formProfileComponentStore.submit();
  }
}

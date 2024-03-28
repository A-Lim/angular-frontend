import { AsyncPipe, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';
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
import { FormUserComponentStore } from './form-user.component-store';

@Component({
  selector: 'app-form-user',
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
  templateUrl: './form-user.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FormUserComponentStore],
})
export class FormUserComponent implements OnChanges {
  @Input() user?: User | null;

  private _formUserComponentStore = inject(FormUserComponentStore);

  readonly loading$ = this._formUserComponentStore.loading$;
  readonly user$ = this._formUserComponentStore.user$;
  readonly statuses$ = this._formUserComponentStore.statuses$;
  readonly formGroup$ = this._formUserComponentStore.formGroup$;
  readonly DATE_FORMAT = environment.dateFormat;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['user']) {
      this._formUserComponentStore.setUser(this.user);
      this._formUserComponentStore.createForm();
    }
  }

  submit() {
    this._formUserComponentStore.submit();
  }
}

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ExtendedFormGroup } from 'src/app/modules/shared/extended/form-group.extended';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'app-form-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NzCheckboxModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
  ],
  templateUrl: './form-login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormLoginComponent {
  formGroup = new FormGroup({});
  submit() {}
}

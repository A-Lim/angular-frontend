import { AsyncPipe, CommonModule, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { UiFormControlErrorsComponent } from '@shared/components/ui-form-control-errors/ui-form-control-errors.component';
import { Contact } from '@modules/contacts/models/contact.model';
import { FormEditContactComponentStore } from './form-edit-contact.component-store';

@Component({
  selector: 'app-form-edit-contact',
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
  templateUrl: './form-edit-contact.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FormEditContactComponentStore],
})
export class FormEditContactComponent implements OnInit {
  @Input() contact?: Contact;

  private _formEditContactComponentStore = inject(FormEditContactComponentStore);

  readonly formGroup$ = this._formEditContactComponentStore.formGroup$;
  readonly loading$ = this._formEditContactComponentStore.loading$;

  ngOnInit() {
    this._formEditContactComponentStore.createForm();
  }

  submit() {
    this._formEditContactComponentStore.submit();
  }
}

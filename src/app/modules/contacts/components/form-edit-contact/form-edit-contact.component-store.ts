import { EventEmitter, Injectable, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import cloneDeep from 'lodash-es/cloneDeep';
import { EMPTY, Observable, finalize, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/component-store';
import { concatLatestFrom } from '@ngrx/effects';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { FormComponentStore } from '@shared/component-stores/form.component-store';
import { ContactsApiService } from '@modules/contacts/contacts.api-service';
import { Contact } from '@modules/contacts/models/contact.model';

export interface FormEditContactState {
  contact?: Contact;
  loading: boolean;
  formGroup?: FormGroup;
}

export const FormEditContactInitialState: FormEditContactState = {
  loading: false,
};

@Injectable()
export class FormEditContactComponentStore extends FormComponentStore<FormEditContactState> {
  private _contact = inject(NZ_MODAL_DATA);
  private _contactsApiService = inject(ContactsApiService);
  private _messageSvc = inject(NzMessageService);
  private _modalRef = inject(NzModalRef, { optional: true });

  constructor() {
    super(FormEditContactInitialState);
  }

  // #region SELECTORS
  readonly contact = this.select((state) => state.contact);
  // #endregion

  // #region UPDATERS
  readonly createForm = this.updater((state): FormEditContactState => {
    console.log(this._contact);
    const formGroup = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.email]),
      phone: new FormControl(null),
    });
    return {
      ...state,
      formGroup,
    };
  });
  // #endregion

  // #region EFFECTS
  readonly submit = this.effect((void$: Observable<void>) =>
    void$.pipe(
      concatLatestFrom(() => [this.contact, this.formGroup$]),
      switchMap(([, contact, formGroup]) => {
        this._markAllDirty(formGroup);

        if (formGroup && formGroup.valid) {
          this.setLoading(true);

          return this._contactsApiService.updateContact(contact!.id, formGroup.value.contacts).pipe(
            tapResponse(
              (response) => {
                this._messageSvc.success(response.message ?? '');
                this._modalRef?.triggerOk();
              },
              () => undefined
            ),
            finalize(() => this.setLoading(false))
          );
        }
        return EMPTY;
      })
    )
  );
  // #endregion
}

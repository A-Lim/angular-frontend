import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { Observable, map } from 'rxjs';
import { Response } from '@core/models/response.model';

export class FormControlValidators {
  static resourceExists<T, R>(
    checkResourceApi: (
      value: T | null,
      resourceRef?: R | null
    ) => Observable<Response<boolean>>,
    resourceRef?: R
  ): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> =>
      checkResourceApi(control.value, resourceRef).pipe(
        map((result) => (result ? { exists: true } : null))
      );
  }
}

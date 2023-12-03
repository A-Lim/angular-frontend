import {
  AbstractControlOptions,
  AsyncValidatorFn,
  FormGroup,
  ValidatorFn,
} from '@angular/forms';

export class ExtendedFormGroup<TControl> extends FormGroup {
  constructor(
    controls: TControl,
    validatorOrOpts?:
      | ValidatorFn
      | ValidatorFn[]
      | AbstractControlOptions
      | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
  ) {
    super(controls, validatorOrOpts, asyncValidator);
  }
}

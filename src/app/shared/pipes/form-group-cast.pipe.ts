import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';

@Pipe({
  name: 'toFormGroup',
  standalone: true,
})
export class FormGroupCastPipe implements PipeTransform {
  transform(control: AbstractControl): FormGroup {
    return control as FormGroup;
  }
}

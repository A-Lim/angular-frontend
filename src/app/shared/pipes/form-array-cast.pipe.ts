import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';

@Pipe({
  name: 'toFormArray',
  standalone: true,
})
export class FormArrayCastPipe implements PipeTransform {
  transform(formGroup: FormGroup, key: string): FormArray {
    return formGroup.controls[key] as FormArray;
  }
}

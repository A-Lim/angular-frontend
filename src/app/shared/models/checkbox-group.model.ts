import { Checkbox } from './checkbox.model';

export interface CheckboxGroup<T, R> {
  label: string;
  value: T;
  checked: boolean;
  indeterminate: boolean;
  checkboxes: Checkbox<R>[];
}

import { KeyValuePipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'app-ui-form-control-errors',
  standalone: true,
  imports: [NgIf, NgFor, KeyValuePipe, TranslocoModule],
  templateUrl: './ui-form-control-errors.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class UiFormControlErrorsComponent {
  @Input({ required: true }) name!: string;
  @Input({ required: true }) control!: AbstractControl;
}

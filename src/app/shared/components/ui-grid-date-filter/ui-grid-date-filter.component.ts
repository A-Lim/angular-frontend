import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '@environments/environment';
import { IFloatingFilterParams } from 'ag-grid-community';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';

@Component({
  selector: 'app-ui-grid-date-filter',
  standalone: true,
  imports: [FormsModule, NzDatePickerModule],
  template: `<nz-date-picker
    class="block"
    nz-input
    [(ngModel)]="date"
    [nzAllowClear]="true"
    [nzInputReadOnly]="true"
    [nzFormat]="dateFormat"
    (ngModelChange)="onChange()"
  >
  </nz-date-picker>`,
  styles: [
    `
      :host {
        width: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiGridDateFilterComponent {
  readonly dateFormat = environment.dateFormat;

  private _params?: IFloatingFilterParams;
  date?: Date;

  agInit(params: IFloatingFilterParams): void {
    this._params = params;
  }

  onChange() {
    this._params?.parentFilterInstance((instance: any) => {
      if (this.date)
        instance.onFloatingFilterChanged('equals', this.date.toISOString());
      else instance.onFloatingFilterChanged(null, null);
    });
  }
}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-ui-grid-link-cell',
  standalone: true,
  template: `<a href="{{ params.type ? params.type + ':' : '' }}{{ params.value }}">{{
    params.value
  }}</a>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiGridLinkCellComponent implements ICellRendererAngularComp {
  params!: any;

  agInit(params: ICellRendererParams<any, any, any>) {
    this.params = params;
  }

  refresh(params: ICellRendererParams) {
    this.params = params;
    return true;
  }
}

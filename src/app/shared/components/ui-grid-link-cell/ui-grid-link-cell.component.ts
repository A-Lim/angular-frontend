import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { LinkType } from '@shared/types/link.type';

@Component({
  selector: 'app-ui-grid-link-cell',
  standalone: true,
  imports: [],
  template: `<a [href]="link">{{ params.value }}</a>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiGridLinkCellComponent implements ICellRendererAngularComp {
  params!: any;
  link: string = '';

  agInit(params: ICellRendererParams<any, any, any>) {
    this.params = params;

    switch (this.params.type as LinkType) {
      case 'email':
        this.link = `tel:${this.params.value}`;
        break;

      case 'phone':
        this.link = `mailto:${this.params.value}`;
        break;

      case 'whatsapp':
        this.link = `https://wa.me/${this.params.value}`;
        break;
    }
  }

  refresh(params: ICellRendererParams) {
    this.params = params;
    return true;
  }
}

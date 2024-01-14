import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-ui-template-renderer',
  standalone: true,
  imports: [NgTemplateOutlet],
  template: `<ng-container
    *ngTemplateOutlet="template; context: templateContext"
  ></ng-container>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiTemplateRendererComponent {
  template!: TemplateRef<any> | null;
  templateContext!: { $implicit: any; params: any };

  refresh(params: any): boolean {
    this.templateContext = {
      $implicit: params.data,
      params,
    };
    return true;
  }

  agInit(params: any) {
    this.template = params['ngTemplate'];
    this.refresh(params);
  }
}

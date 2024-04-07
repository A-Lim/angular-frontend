import { AfterViewInit, Directive, ViewContainerRef, inject } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';

@Directive({
  selector: '[resizeGridInView]',
  standalone: true,
})
export class ResizeGridInViewDirective implements AfterViewInit {
  private _vcr = inject(ViewContainerRef);
  private _agGrid = inject(AgGridAngular);

  ngAfterViewInit() {
    const observedElement = this._vcr.element.nativeElement.parentElement;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        this._agGrid.api.sizeColumnsToFit();
      }
    });
    observer.observe(observedElement);
  }
}

import { Component, OnInit, ViewChild, ElementRef, Renderer2, EmbeddedViewRef, TemplateRef, ViewContainerRef, NgZone, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { fromEvent } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { createPopper, Instance, Placement } from '@popperjs/core';

@Component({
  selector: 'shared-formcontrol-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css']
})
export class SelectComponent implements OnInit {
  @ViewChild('select')
  selectControl: ElementRef<any>;

  @Output() 
  closed = new EventEmitter();

  view: EmbeddedViewRef<any>;

  placement: Placement;
  isFocused: boolean;
  popperRef: Instance;

  constructor(private _renderer: Renderer2, private _vcr: ViewContainerRef, private zone: NgZone, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
  }

  onFocus() {
    this.isFocused = true;
  }

  onBlur() {
    if (this.view != null)
      return;
    // keep focus when dropdown is still opened
    this.isFocused = false;
  }

  open(dropdownTpl: TemplateRef<any>, origin: HTMLElement) {
    if (this.view != null)
      return;
    
    this.view = this._vcr.createEmbeddedView(dropdownTpl);
    const dropdown = this.view.rootNodes[0];

    document.body.appendChild(dropdown);
    dropdown.style.width = `${origin.getBoundingClientRect().width}px`;

    this.zone.runOutsideAngular(() => {
      this.popperRef = createPopper(origin, dropdown, {
        modifiers: [
          {
            name: 'offset',
            options: { offset: [0, 0] },
            
          },
        ],
      });
    });
    
    this.placement = this.popperRef.state.placement;
    this.handleClickOutside();
  }

  close() {
    this.closed.emit();
    this.popperRef.destroy();
    this.view.destroy();
    this.view = null;
    this.popperRef = null;
  }

  private handleClickOutside() {
    fromEvent(document, 'click')
      .pipe(
        filter(event => {
          // origin of dropdownlist
          const ddlOrigin = this.popperRef.state.elements.popper as HTMLElement;
          // origin of reference
          const refOrigin = this.popperRef.state.elements.reference as HTMLElement;
          // clicked target
          const target = event.target as HTMLElement;
          return !ddlOrigin.contains(target) && !refOrigin.contains(target);
        }),
        takeUntil(this.closed)
      )
      .subscribe(_ => {
        this.close();
        this.onBlur();
        this.cdr.detectChanges();
      });
  }
}

import { Directive, ElementRef, Input, EventEmitter, Output } from '@angular/core';
import { NgControl } from '@angular/forms';

declare var $: any;
@Directive({
  selector: '[appSelect2]',
})

export class Select2Directive {
  $: any = $;
  select2: any;

  @Input()
  placeholder: string;

  // @Output()
  // itemSelected = new EventEmitter<boolean>();

  constructor(private el: ElementRef, private control: NgControl) {
    // this.$(el.nativeElement).select2({
    //   // the following code is used to disable x-scrollbar when click in select input and
    //   // take 100% width in responsive also
    //   dropdownAutoWidth: true,
    //   width: '100%'
    // });
    this.initializeSelect2();
  }

  initializeSelect2() {
    this.select2 = this.$(this.el.nativeElement).select2({
      placeholder: this.placeholder || 'Please select',
      dropdownAutoWidth: true,
      width: '100%'
    });

    this.select2.on('select2:select select2:unselect', (event) => {
      // value would be index: 'value' eg: "0: '1'"
      // trim of the first 3 characters to get the correct value
      const values = this.select2.val().map(x => x.substring(3, x.length));
      this.control.control.setValue(values);
    });

    this.select2.on('select2:open', (event) => {
      this.control.control.markAsTouched();
    });
  }

  clear() {
    if (this.select2) {
      this.select2.val(null).trigger('change');
      this.control.control.setValue(null);
    }
  }

}
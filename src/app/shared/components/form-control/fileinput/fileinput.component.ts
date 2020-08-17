import { Component, OnInit, ViewChild, ElementRef, OnDestroy, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'shared-formcontrol-fileinput',
  templateUrl: './fileinput.component.html',
  styleUrls: ['./fileinput.component.css'],
  providers: [     
    {
      provide: NG_VALUE_ACCESSOR, 
      useExisting: forwardRef(() => FileInputComponent),
      multi: true     
    }   
  ]
})
export class FileInputComponent implements OnInit, OnDestroy, ControlValueAccessor {
  @ViewChild('fileinput')
  fileInputElement: ElementRef<any>;

  @ViewChild('customFileInput')
  fileLabelElement: ElementRef<any>;

  @Input() multiple: boolean = false;

  onChanged = (value: any) => {};
  onTouched = () => {};

  disabled: boolean = false;
  files: FileList;
  fileName: string = 'Choose File';

  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  writeValue(value: any) {
    if (value instanceof FileList)
			this.files = value;
		else if (Array.isArray(value) && ! value.length)
      this.files = null;
		else if (value == null || value == '') 
			this.files = null;
		else 
      throw new Error("Attempting to assign value: " + value + " which is a non-FileList type to input[type=file].")
  }

  registerOnChange(fn: any) {
    this.onChanged = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  handleChange(event: any) {
    this.files = event.target.files;

		if (this.multiple) {
      this.onChanged(Array.from(this.files));
      this.fileName = this.files.length > 1 ? this.files.length + ' selected' : this.files[0].name;
    }
    else {
      this.onChanged(this.files.length ? this.files[0] : null );
      this.fileName = this.files[0].name;
    }
	}
}

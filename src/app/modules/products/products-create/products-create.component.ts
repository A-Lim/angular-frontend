import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { BaseFormComponent } from 'app/shared/components/baseform.component';
import { ProductStatus } from 'app/shared/models/product.enum';
import { ProductService } from 'app/modules/products/products.service';
import { AlertService } from 'app/shared/services/alert.service';

@Component({
  selector: 'products-create',
  templateUrl: './products-create.component.html',
  styleUrls: ['./products-create.component.css']
})
export class ProductsCreateComponent extends BaseFormComponent implements OnInit {
  public Editor = ClassicEditor;

  constructor(private formBuilder: FormBuilder, 
    private alertService: AlertService,
    private productService: ProductService) { 
    super(); 
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      status: [ProductStatus.Active, [Validators.required]],
      description: [''],
      price: ['', [Validators.required]],
      seqNo: ['', [Validators.required]],
      delivery_days: ['', [Validators.required]],
      highlighted: [],
      custom: [''],
    }, {
      validator: [
      ]
    });
  }

  onSubmit() {
    super.onSubmit();
    // validate form
    if (!this.form.valid)
      return;

    this.startLoading();
    this.productService.createProduct(this.form.value)
      .subscribe(response => {
        this.alertService.success(response.message);
        this.endLoading();
      }, _ => {
        this.endLoading();
      });
  }

}

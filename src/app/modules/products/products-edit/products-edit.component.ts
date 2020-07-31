import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Validators, FormBuilder } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { BaseFormComponent } from 'app/shared/components/baseform.component';
import { ProductService } from 'app/modules/products/products.service';
import { AlertService } from 'app/shared/services/alert.service';
import { Product } from 'app/shared/models/product.model';


@Component({
  selector: 'products-edit',
  templateUrl: './products-edit.component.html',
  styleUrls: ['./products-edit.component.css']
})
export class ProductsEditComponent extends BaseFormComponent implements OnInit {
  public Editor = ClassicEditor;
  public product: Product;

  constructor(private formBuilder: FormBuilder, 
    private alertService: AlertService,
    private productService: ProductService,
    private route: ActivatedRoute) { 
    super(); 
  }

  ngOnInit() {
    this.initForm();

    this.startLoading();
    const id = +this.route.snapshot.paramMap.get('id');
    this.productService.getProduct(id)
      .subscribe(response => {
        this.product = response.data;
        this.form.patchValue(this.product);
        this.endLoading();
      })
    
  }

  initForm() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      status: ['', [Validators.required]],
      description: [''],
      price: ['', [Validators.required]],
      seqNo: ['', [Validators.required]],
      delivery_days: ['', [Validators.required]],
      highlighted: [''],
      custom: [''],
    }, {
      validator: []
    });
  }

  onSubmit() {
    super.onSubmit();
    // validate form
    if (!this.form.valid)
      return;

    this.startLoading();
    this.productService.updateProduct(this.product.id, this.form.value)
      .subscribe(response => {
        this.alertService.success(response.message);
        this.endLoading();
      }, _ => {
        this.endLoading();
      });
  }

}

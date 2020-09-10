import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { Base } from 'app/shared/components/base.component';
import { ProductService } from 'app/modules/products/products.service';
import { ProductVm } from 'app/modules/products/models/product.model.vm';
import { switchMap } from 'rxjs/operators';


@Component({
  selector: 'products-create',
  templateUrl: './products-create.component.html',
  styleUrls: ['./products-create.component.css']
})
export class ProductsCreateComponent extends Base implements OnInit, OnDestroy {
  Editor = ClassicEditor;
  productVm: ProductVm;

  @ViewChild('form')
  form: NgForm;

  constructor(private productSvc: ProductService) { 
    super(); 
  }

  ngOnInit() {
    super.ngOnInit();
    this.setTitle('Create Product');
    this.productVm = new ProductVm();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  onSubmit() {
    this.submitted = true;

    // validate form
    if (!this.form.valid)
      return;

    this.isLoading = true;
    this.productSvc.createProduct(this.form.value)
      .pipe(
        switchMap(response => this.swalAlert('Success', response.message, 'success'))
      )
      .subscribe(_ => {
        this.router.navigate(['admin/products']);
        this.isLoading = false;
      }, _ => this.isLoading = false);
  }

}

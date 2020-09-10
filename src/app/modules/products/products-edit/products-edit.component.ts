import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { Base } from 'app/shared/components/base.component';
import { ProductService } from 'app/modules/products/products.service';
import { Product } from 'app/modules/products/models/product.model';
import { ProductVm } from 'app/modules/products/models/product.model.vm';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'products-edit',
  templateUrl: './products-edit.component.html',
  styleUrls: ['./products-edit.component.css']
})
export class ProductsEditComponent extends Base implements OnInit, OnDestroy {
  Editor = ClassicEditor;
  product: Product;
  productVm: ProductVm;

  @ViewChild('form')
  form: NgForm;

  constructor(private productSvc: ProductService, private route: ActivatedRoute) { 
    super(); 
  }

  ngOnInit() {
    super.ngOnInit();
    this.setTitle('Edit Product');

    this.loadProduct();
  }

  loadProduct() {
    this.isLoading = true;
    const id = +this.route.snapshot.paramMap.get('id');

    this.productSvc.getProduct(id)
      .subscribe(response => {
        this.product = response.data;
        this.productVm = <ProductVm> {
          name: response.data.name,
          description: response.data.description,
          status: response.data.status,
          price: response.data.price,
          seqNo: response.data.seqNo,
          delivery_days: response.data.delivery_days,
          highlighted: response.data.highlighted,
          custom: response.data.custom,
        }
        this.isLoading = false;
      }, _ => { this.isLoading = false; });
  }

  onSubmit() {
    this.submitted = true;

    // validate form
    if (!this.form.valid)
      return;

    this.isLoading = true;
    this.productSvc.updateProduct(this.product.id, this.productVm)
      .pipe(switchMap(response => this.swalAlert('Success', response.message, 'success')))
      .subscribe(_ => {
        this.router.navigate(['admin/products']);
        this.isLoading = false;
      }, _ => this.isLoading = false);
  }

}

import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';

import { BaseFormComponent } from 'app/shared/components/baseform.component';
import { AlertService } from 'app/shared/services/alert.service';
import { OrderService } from 'app/modules/orders/orders.service';

@Component({
  selector: 'orders-create',
  templateUrl: './orders-create.component.html',
  styleUrls: ['./orders-create.component.css']
})
export class OrdersCreateComponent extends BaseFormComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, 
    private alertService: AlertService,
    private orderService: OrderService) { 
    super(); 
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    // this.form = this.formBuilder.group({
    //   name: ['', [Validators.required]],
    //   status: [ProductStatus.Active, [Validators.required]],
    //   description: [''],
    //   price: ['', [Validators.required]],
    //   seqNo: ['', [Validators.required]],
    //   delivery_days: ['', [Validators.required]],
    //   highlighted: [],
    //   custom: [''],
    // }, {
    //   validator: [
    //   ]
    // });
  }

  onSubmit() {
    super.onSubmit();
    // validate form
    if (!this.form.valid)
      return;

    this.startLoading();
    // this.productService.createProduct(this.form.value)
    //   .subscribe(response => {
    //     this.alertService.success(response.message);
    //     this.endLoading();
    //   }, _ => {
    //     this.endLoading();
    //   });
  }

}

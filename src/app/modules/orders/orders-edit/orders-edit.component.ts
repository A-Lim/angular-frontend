import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Validators, FormBuilder } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import { BaseFormComponent } from 'app/shared/components/baseform.component';
import { OrderService } from 'app/modules/orders/orders.service';
import { AlertService } from 'app/shared/services/alert.service';
import { ModalService } from 'app/shared/services/modal.service';
import { Order } from 'app/modules/orders/models/order.model';
import { App, API_BASE_URL } from 'app/configs/app.config';
import ValidationUtil from 'app/shared/helpers/validation.util';

import { OrderWorkItem } from 'app/modules/orders/models/orderworkitem.model';
import { ModalWorkItemDetailsComponent } from 'app/modules/orders/orders-edit/modal-work-item-details/modal-work-item-details.component';

@Component({
  selector: 'orders-edit',
  templateUrl: './orders-edit.component.html',
  styleUrls: ['./orders-edit.component.css']
})
export class OrdersEditComponent extends BaseFormComponent implements OnInit {
  public order: Order;
  public showPassword: boolean = false;

  constructor(private titleService: Title,
    private formBuilder: FormBuilder, 
    private alertService: AlertService,
    private orderService: OrderService,
    private modalService: ModalService,
    private route: ActivatedRoute) { 
    super(); 
  }

  ngOnInit() {
    this.titleService.setTitle(`${App.NAME} | Edit User`);
    this.initForm();

    this.startLoading();
    const id = +this.route.snapshot.paramMap.get('id');
    this.orderService.getOrder(id)
      .subscribe(response => {
        this.order = response.data;
        this.form.patchValue(this.order);
        this.endLoading();
      }, _ => { this.isLoading = false; })
    
  }

  initForm() {
    this.form = this.formBuilder.group({
      fileUploadType: ['', Validators.required],
      file: ['', [ValidationUtil.allowedFileTypes(['pdf', 'docx', 'txt'])]],
      externalFileUrl: ['', []],
      message: ['', []],
    }, {
      validator: [
        ValidationUtil.requiredIfValue('fileUploadType', 0, 'file'),
        ValidationUtil.requiredIfValue('fileUploadType', 1, 'externalFileUrl'),
      ]
    });
  }

  showWorkItemDetails(workItem: OrderWorkItem) {
    const modal = this.modalService.open(ModalWorkItemDetailsComponent, workItem);

    modal.afterClosed$.subscribe(res => {
    });
  }

  onFileInputChanged(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.form.patchValue({ fileSource: file });
    }
  }

  onSubmit() {
    super.onSubmit();
    // validate form
    if (!this.form.valid)
      return;

    this.startLoading();
    this.orderService.createOrderWorkItem(this.order.id, this.form.value)
      .subscribe(response => {
        this.alertService.success(response.message);
        this.endLoading();
      }, _ => {
        this.endLoading();
      });
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  get API_BASE_URL() {
    return API_BASE_URL;
  }
}

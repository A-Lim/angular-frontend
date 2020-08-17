import { Component, OnInit, Input } from '@angular/core';
import { OrderWorkItem } from 'app/shared/models/orderworkitem.model';
import { CustomOverlayRef } from 'app/shared/helpers/customoverlayref';
import { API_BASE_URL } from 'app/configs/app.config';

@Component({
  selector: 'modal-work-item-details',
  templateUrl: './modal-work-item-details.component.html',
  styleUrls: ['./modal-work-item-details.component.css']
})
export class ModalWorkItemDetailsComponent implements OnInit {
  workItem: OrderWorkItem;

  constructor(private ref: CustomOverlayRef<OrderWorkItem, OrderWorkItem>) {
  }

  ngOnInit() {
    this.workItem = this.ref.data;
  }

  close() {
    this.ref.close();
  }

  save() {
    this.ref.close(this.workItem);
  }

  get API_BASE_URL() {
    return API_BASE_URL;
  }
}

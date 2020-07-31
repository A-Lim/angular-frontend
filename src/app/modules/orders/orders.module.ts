import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';

import { OrdersRoutingModule } from 'app/modules/orders/orders.routing';
import { OrdersListComponent } from './orders-list/orders-list.component';
import { OrdersEditComponent } from './orders-edit/orders-edit.component';

import { ModalWorkItemDetailsComponent } from './orders-edit/modal-work-item-details/modal-work-item-details.component';

@NgModule({
  declarations: [
    OrdersListComponent,
    OrdersEditComponent,

    ModalWorkItemDetailsComponent
  ],
  imports: [
    OrdersRoutingModule,
    SharedModule,
  ],
})
export class OrdersModule { }

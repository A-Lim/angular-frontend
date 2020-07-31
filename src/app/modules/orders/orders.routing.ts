import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from 'app/core/guards/auth.guard';
import { OrdersListComponent } from './orders-list/orders-list.component';
import { OrdersEditComponent } from './orders-edit/orders-edit.component';


const routes: Routes = [
  { path: '', component: OrdersListComponent, canActivate: [AuthGuard] },
  // { path: 'create', component: ProductsCreateComponent, canActivate: [AuthGuard] },
  { path: ':id', component: OrdersEditComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }

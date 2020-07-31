import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from 'app/core/guards/auth.guard';

import { ProductsListComponent } from './products-list/products-list.component';
import { ProductsCreateComponent } from './products-create/products-create.component';
import { ProductsEditComponent } from './products-edit/products-edit.component';

const routes: Routes = [
  { path: '', component: ProductsListComponent, canActivate: [AuthGuard] },
  { path: 'create', component: ProductsCreateComponent, canActivate: [AuthGuard] },
  { path: ':id', component: ProductsEditComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }

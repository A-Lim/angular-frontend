import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';

import { ProductsRoutingModule } from 'app/modules/products/products.routing';

import { ProductsListComponent } from './products-list/products-list.component';
import { ProductsCreateComponent } from './products-create/products-create.component';
import { ProductsEditComponent } from './products-edit/products-edit.component';

@NgModule({
  declarations: [
    ProductsListComponent,
    ProductsCreateComponent,
    ProductsEditComponent
  ],
  imports: [
    ProductsRoutingModule,
    SharedModule,
  ],
})
export class ProductsModule { }

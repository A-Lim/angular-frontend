import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { AgGridAngular } from 'ag-grid-angular';

import { BaseAgGrid } from 'app/shared/components/baseaggrid.component';
import { ProductService } from 'app/modules/products/products.service';
import { filter, switchMap } from 'rxjs/operators';

@Component({
  selector: 'products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent extends BaseAgGrid implements OnInit, OnDestroy {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  @ViewChild('actionsCell', { static: true }) actionsCell: TemplateRef<any>;
  @ViewChild('statusCell', { static: true }) statusCell: TemplateRef<any>;

  constructor(private productSvc: ProductService) { 
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.setTitle('Products');
    this.columnDefs = [
      this.getIndexColDef(),
      this.getColDef('Name', 'name', true, true),
      this.getNumberColDef('Price', 'price', true, true),
      this.getNumberColDef('Delivery Day(s)', 'delivery_days', true, true),
      this.getNumberColDef('Sequence No.', 'seqNo', true, true),
      this.getStatusColDef('Status', 'status', 100, this.statusCell),
      this.getActionColDef('Action', '', 120, this.actionsCell),
    ];

    this.dataSourceCallBack = (params: any) => {
      return this.productSvc.getProducts(params);
    }

    this.setDataSource();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  delete(id: number) {
    this.swalConfirm('Confirm', 'Are you sure you want to delete this product?', 'warning', 'Delete')
      .pipe(
        filter(x => x.isConfirmed),
        switchMap(_ => this.productSvc.deleteProduct(id)),
        switchMap(response => this.swalAlert('Success', response.message, 'success'))
      ).subscribe(_ => this.agGrid.gridOptions.api.refreshInfiniteCache());
  }
}

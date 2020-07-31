import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { AgGridAngular } from 'ag-grid-angular';
import { GridOptions, IDatasource, IGetRowsParams, ColDef } from 'ag-grid-community';

import { App } from 'app/configs/app.config';
import { ProductService } from 'app/modules/products/products.service';
import { TemplateRendererComponent } from 'app/shared/components/template-renderer.component';
import UrlQueryBuilder from 'app/shared/helpers/urlquerybuilder';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';


@Component({
  selector: 'products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent implements OnInit, OnDestroy {
  @ViewChild('agGrid', { static: false }) agGrid: AgGridAngular;
  @ViewChild('actionsCell', { static: true }) actionsCell: TemplateRef<any>;
  @ViewChild('statusCell', { static: true }) statusCell: TemplateRef<any>;

  public columnDefs: ColDef[];
  public rowData: any;

  public gridOptions: GridOptions = {
    defaultColDef: {
      sortable: true
    },
    floatingFilter: true,
    animateRows: true,
    pagination: true,
    rowModelType: 'infinite',
    rowHeight: 45,
    cacheBlockSize: 10,
    paginationPageSize: 10,
    suppressCellSelection: true
  };

  private _unsubscribe = new Subject<void>();

  public dataSource: IDatasource = {
    getRows: (params: IGetRowsParams) => {
      const urlParams = UrlQueryBuilder.buildUrlFromAgGrid(params);
      this.gridOptions.api.showLoadingOverlay();
      this.productService.getProducts(urlParams).pipe(
        takeUntil(this._unsubscribe),
      )
      .subscribe(response => {
        this.gridOptions.api.hideOverlay();
        params.successCallback(
          response.data.data, response.data.total
        );
      });
    }
  };
  
  constructor(private titleService: Title, private productService: ProductService) { 
  }

  ngOnInit() {
    this.titleService.setTitle(`${App.NAME} | Products`);
    this.columnDefs = [
      {
        headerName: '#',
        lockPosition: true,
        valueGetter: 'node.rowIndex + 1',
        cellClass: 'locked-col',
        width: 30,
        suppressNavigable: true,
        sortable: false,
        filter: false
      },
      {
        headerName: 'Name',
        field: 'name',
        filter: true,
        suppressMenu: true,
        filterParams: {
          suppressAndOrCondition: true,
          filterOptions: ['contains', 'equals']
        }
      },
      {
        headerName: 'Price',
        field: 'price',
        filter: true,
        suppressMenu: true,
        filterParams: {
          suppressAndOrCondition: true,
          filterOptions: ['contains', 'equals']
        }
      },
      {
        headerName: 'Delivery Day(s)',
        field: 'delivery_days',
        filter: true,
        suppressMenu: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
      },
      {
        headerName: 'Sequence No.',
        field: 'seqNo',
        filter: true,
        suppressMenu: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
      },
      {
        headerName: 'Status',
        field: 'status',
        sortable: true,
        filter: true,
        suppressMenu: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        width: 100,
        cellRendererFramework: TemplateRendererComponent,
        cellRendererParams: {
          ngTemplate: this.statusCell
        }
      },
      {
        headerName: 'Action',
        field: '',
        sortable: false,
        filter: false,
        width: 120,
        cellRendererFramework: TemplateRendererComponent,
        cellRendererParams: {
          ngTemplate: this.actionsCell
        }
      },
    ];
  }

  onGridReady(params) {
    params.api.sizeColumnsToFit();
    params.api.setDatasource(this.dataSource);
  }

  ngOnDestroy() {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  delete(id: number) {
    this.productService.deleteProduct(id)
      .subscribe(response => {
        alert(response.message);
      });
  }
}

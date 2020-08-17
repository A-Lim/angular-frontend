import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs';

import { AgGridAngular } from 'ag-grid-angular';
import { GridOptions, IDatasource, IGetRowsParams, ColDef } from 'ag-grid-community';
import Swal from 'sweetalert2'

import { App } from 'app/configs/app.config';
import { OrderService } from 'app/modules/orders/orders.service';
import { TemplateRendererComponent } from 'app/shared/components/template-renderer.component';
import UrlQueryBuilder from 'app/shared/helpers/urlquerybuilder';
import { OrderStatistics } from 'app/shared/models/orderstatistics.model';

@Component({
  selector: 'orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.css'],
  providers: [DatePipe],
})
export class OrdersListComponent implements OnInit, OnDestroy {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  @ViewChild('actionsCell', { static: true }) actionsCell: TemplateRef<any>;
  @ViewChild('statusCell', { static: true }) statusCell: TemplateRef<any>;

  public columnDefs: ColDef[];
  public rowData: any;
  public statistics: OrderStatistics;

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
    suppressCellSelection: true,
    suppressFieldDotNotation: true,
  };

  private _unsubscribe = new Subject<void>();

  public dataSource: IDatasource = {
    getRows: (params: IGetRowsParams) => {
      const urlParams = UrlQueryBuilder.buildUrlFromAgGrid(params);
      this.gridOptions.api.showLoadingOverlay();
      this.orderService.getOrders(urlParams)
        .subscribe(response => {
          this.gridOptions.api.hideOverlay();
          params.successCallback(
            response.data.data, response.data.total
          );
        });
    }
  };
  
  constructor(private titleService: Title, private orderService: OrderService, private datePipe: DatePipe) { 
  }

  ngOnInit() {
    this.titleService.setTitle(`${App.NAME} | Orders`);
    const today = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.retrieveStatistics(today);

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
        headerName: 'Reference No.',
        field: 'refNo',
        filter: true,
        suppressMenu: true,
        filterParams: {
          suppressAndOrCondition: true,
          filterOptions: ['contains', 'equals']
        }
      },
      {
        headerName: 'Email',
        field: 'email',
        filter: true,
        suppressMenu: true,
        filterParams: {
          suppressAndOrCondition: true,
          filterOptions: ['contains', 'equals']
        }
      },
      {
        headerName: 'Total',
        field: 'total',
        filter: 'agNumberColumnFilter',
        suppressMenu: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
      },
      {
        headerName: 'Date',
        field: 'created_at',
        filter: 'agDateColumnFilter',
        suppressMenu: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        filterParams: {
          debounceMs: 500
        }
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

  retrieveStatistics(date: string) {
    this.orderService.getOrderStatistics(date)
      .subscribe(data => {
        this.statistics = data.data;
      });
  }
}


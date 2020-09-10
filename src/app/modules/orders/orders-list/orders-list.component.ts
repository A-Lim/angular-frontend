import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs';

import { AgGridAngular } from 'ag-grid-angular';
import { GridOptions, IDatasource, IGetRowsParams, ColDef } from 'ag-grid-community';

import { App } from 'app/configs/app.config';
import { OrderService } from 'app/modules/orders/orders.service';
import { TemplateRendererComponent } from 'app/shared/components/template-renderer.component';
import UrlQueryBuilder from 'app/shared/helpers/urlquerybuilder';
import { OrderStatistics } from 'app/modules/orders/models/orderstatistics.model';
import { BaseAgGrid } from 'app/shared/components/baseaggrid.component';

@Component({
  selector: 'orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.css'],
  providers: [DatePipe],
})
export class OrdersListComponent extends BaseAgGrid implements OnInit, OnDestroy {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  @ViewChild('actionsCell', { static: true }) actionsCell: TemplateRef<any>;
  @ViewChild('statusCell', { static: true }) statusCell: TemplateRef<any>;

  // public columnDefs: ColDef[];
  // public rowData: any;
  public statistics: OrderStatistics;

  // public gridOptions: GridOptions = {
  //   defaultColDef: {
  //     sortable: true
  //   },
  //   floatingFilter: true,
  //   animateRows: true,
  //   pagination: true,
  //   rowModelType: 'infinite',
  //   rowHeight: 45,
  //   cacheBlockSize: 10,
  //   paginationPageSize: 10,
  //   suppressCellSelection: true,
  //   suppressFieldDotNotation: true,
  // };

  // private _unsubscribe = new Subject<void>();

  // public dataSource: IDatasource = {
  //   getRows: (params: IGetRowsParams) => {
  //     const urlParams = UrlQueryBuilder.buildUrlFromAgGrid(params);
  //     this.gridOptions.api.showLoadingOverlay();
  //     this.orderService.getOrders(urlParams)
  //       .subscribe(response => {
  //         this.gridOptions.api.hideOverlay();
  //         params.successCallback(
  //           response.data.data, response.data.total
  //         );
  //       });
  //   }
  // };
  
  constructor(private orderService: OrderService, private datePipe: DatePipe) { 
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.setTitle('Orders');
    const today = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.retrieveStatistics(today);

    this.columnDefs = [
      this.getIndexColDef(),
      this.getColDef('Reference No.', 'refNo', true, true),
      this.getColDef('Email', 'email', true, true),
      this.getNumberColDef('Total', 'total', true, true),
      this.getDateColDef('Date', 'created_at'),
      this.getStatusColDef('Status', 'status', 100, this.statusCell),
      this.getActionColDef('Action', '', 120, this.actionsCell),
    ];

    this.dataSourceCallBack = (params: any) => {
      return this.orderService.getOrders(params);
    }

    this.setDataSource();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  retrieveStatistics(date: string) {
    this.orderService.getOrderStatistics(date)
      .subscribe(data => {
        this.statistics = data.data;
      });
  }
}


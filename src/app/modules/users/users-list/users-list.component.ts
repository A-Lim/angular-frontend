import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { AgGridAngular } from 'ag-grid-angular';
import { GridOptions, IDatasource, IGetRowsParams, ColDef } from 'ag-grid-community';

import { App } from 'app/configs/app.config';
import { UserService } from 'app/modules/users/users.service';
import { TemplateRendererComponent } from 'app/shared/components/template-renderer.component';
import UrlQueryBuilder from 'app/shared/helpers/urlquerybuilder';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit, OnDestroy {
  @ViewChild('agGrid') agGrid: AgGridAngular;
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
      this.userService.getUsers(urlParams).pipe(
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
  
  constructor(private titleService: Title, private userService: UserService) { 
  }

  ngOnInit() {
    this.titleService.setTitle(`${App.NAME} | Users`);
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
        width: 80,
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

}

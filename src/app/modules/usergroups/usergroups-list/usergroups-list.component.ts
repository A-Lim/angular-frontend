import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridOptions, IDatasource, IGetRowsParams } from 'ag-grid-community';

import { UserGroupService } from 'app/modules/usergroups/usergroups.service';
import UrlQueryBuilder from 'app/shared/helpers/urlquerybuilder';
import { TemplateRendererComponent } from 'app/shared/components/template-renderer.component';

@Component({
  selector: 'usergroups-list',
  templateUrl: './usergroups-list.component.html',
  styleUrls: ['./usergroups-list.component.css']
})
export class UserGroupsListComponent implements OnInit {
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

  public dataSource: IDatasource = {
    getRows: (params: IGetRowsParams) => {
      const urlParams = UrlQueryBuilder.buildUrlFromAgGrid(params);
      this.gridOptions.api.showLoadingOverlay();
      this.userGroupService.getUserGroups(urlParams).pipe(
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

  private _unsubscribe = new Subject<void>();

  constructor(public userGroupService: UserGroupService) { }

  ngOnInit() {
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
        headerName: 'Code',
        field: 'code',
        filter: true,
        suppressMenu: true,
        filterParams: {
          suppressAndOrCondition: true,
          filterOptions: ['contains', 'equals']
        }
      },
      {
        headerName: 'Users Count',
        field: 'users_count',
        filter: false,
        suppressMenu: true,
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

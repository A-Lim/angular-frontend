import { OnInit, OnDestroy, Directive, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GridOptions, IDatasource, ColDef, IGetRowsParams } from 'ag-grid-community';

import { ServiceLocator } from 'app/shared/services/servicelocator';
import { Base } from 'app/shared/components/base.component';
import { TemplateRendererComponent } from './template-renderer.component';
import UrlQueryBuilder from 'app/shared/helpers/urlquerybuilder';


@Directive()
export abstract class BaseAgGrid extends Base implements OnInit, OnDestroy {
  // default grid options
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

  public dataSource: IDatasource;
  public columnDefs: ColDef[];

  public dataSourceCallBack: (qParams: any) => Observable<any>;

  constructor() {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  onGridReady(params) {
    params.api.sizeColumnsToFit();
    params.api.setDatasource(this.dataSource);
  }

  getIndexColDef(headerName: string = '#', width: number = 30): ColDef {
    return <ColDef> {
      headerName: headerName,
      lockPosition: true,
      valueGetter: 'node.rowIndex + 1',
      cellClass: 'locked-col',
      width: width,
      suppressNavigable: true,
      sortable: false,
      filter: false
    };
  }

  getColDef(headerName: string, field: string, filter: boolean = false, sortable: boolean = false, type: string = ''): ColDef {
    let colDef: ColDef = {
      headerName: headerName,
      field: field,
      filter: filter,
      sortable: sortable,
      suppressMenu: true,
    };

    if (filter)
      colDef.filterParams = { suppressAndOrCondition: true, filterOptions: ['contains', 'equals'] }

    if (type != '')
      colDef.type = type;

    return colDef;
  }

  getNumberColDef(headerName: string, field: string, filter: boolean = false, sortable: boolean = false) {
    let colDef = <ColDef> {
      headerName: headerName,
      field: field,
      type: 'numericColumn',
      suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
    };

    if (filter)
      colDef.filter = 'agNumberColumnFilter';
    
    return colDef;
  }

  getDateColDef(headerName: string, field: string) {
    let colDef = <ColDef> {
      headerName: headerName,
      field: field,
      filter: 'agDateColumnFilter',
      suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
      filterParams: {
        debounceMs: 500
      }
    }
    
    return colDef;
  }

  getStatusColDef(
    headerName: string, 
    field: string,
    width: number = 100,
    template: TemplateRef<any>): ColDef {

    return <ColDef> {
      headerName: headerName,
      field: field,
      sortable: true,
      filter: true,
      suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
      width: width,
      cellRendererFramework: TemplateRendererComponent,
      cellRendererParams: {
        ngTemplate: template
      }
    }
  }

  getActionColDef(
    headerName: string, 
    field: string,
    width: number = 100,
    template: TemplateRef<any>): ColDef {
    
    return <ColDef>{
      headerName: headerName,
      field: field,
      sortable: false,
      filter: false,
      width: width,
      cellRendererFramework: TemplateRendererComponent,
      cellRendererParams: {
        ngTemplate: template
      }
    };
  }

  setDataSource() {
    this.dataSource = {
      getRows: (params: IGetRowsParams) => {
        const urlParams = UrlQueryBuilder.buildUrlFromAgGrid(params);
        this.gridOptions.api.showLoadingOverlay();
        // perform callback from datasource
        this.dataSourceCallBack(urlParams)
          .pipe(takeUntil(this.destroy$))
          .subscribe(response => {
            this.gridOptions.api.hideOverlay();
            params.successCallback(
              response.data.data, response.data.total
            );
          });
      }
    }
  }
}
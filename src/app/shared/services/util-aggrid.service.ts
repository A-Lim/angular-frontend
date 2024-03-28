import { formatDate } from '@angular/common';
import { Injectable, LOCALE_ID, TemplateRef, inject } from '@angular/core';
import { environment } from '@environments/environment';
import { ColDef } from 'ag-grid-community';
import { UiGridLinkCellComponent } from '@shared/components/ui-grid-link-cell/ui-grid-link-cell.component';
import { UiTemplateRendererComponent } from '@shared/components/ui-template-renderer/ui-template-renderer.component';
import { LinkType } from '@shared/types/link.type';

@Injectable({ providedIn: 'root' })
export class UtilAggridService {
  private _locale = inject(LOCALE_ID);

  getIndexColDef(headerName: string = '#', width: number = 35): ColDef {
    return <ColDef>{
      headerName: headerName,
      lockPosition: true,
      valueGetter: 'node.rowIndex + 1',
      cellClass: 'flex items-center',
      width: width,
      suppressNavigable: true,
      sortable: false,
      filter: false,
    };
  }

  getColDef(
    headerName: string,
    field: string,
    filter: boolean = false,
    sortable: boolean = false,
    width: number | undefined = undefined
  ): ColDef {
    let colDef: ColDef = {
      headerName: headerName,
      cellClass: 'flex items-center',
      field: field,
      filter: filter,
      sortable: sortable,
      suppressMenu: true,
    };

    if (filter)
      colDef.filterParams = {
        suppressAndOrCondition: true,
        filterOptions: ['contains', 'equals'],
      };

    if (width) colDef.width = width;

    return colDef;
  }

  getLinkColDef(
    headerName: string,
    field: string,
    type: LinkType,
    filter: boolean = false,
    sortable: boolean = false,
    width?: number
  ): ColDef {
    let colDef: ColDef = {
      headerName: headerName,
      cellClass: 'flex items-center',
      field: field,
      filter: filter,
      sortable: sortable,
      suppressMenu: true,
      cellRenderer: UiGridLinkCellComponent,
      cellRendererParams: {
        type,
      },
    };

    if (filter)
      colDef.filterParams = {
        suppressAndOrCondition: true,
        filterOptions: ['contains', 'equals'],
      };

    if (width) colDef.width = width;

    return colDef;
  }

  getNumberColDef(headerName: string, field: string, filter: boolean = false): ColDef {
    let colDef = <ColDef>{
      headerName: headerName,
      field: field,
      type: 'numericColumn',
      cellClass: 'flex items-center justify-end',
      suppressMenu: true,
      width: 100,
      floatingFilterComponentParams: { suppressFilterButton: true },
    };

    if (filter) colDef.filter = 'agNumberColumnFilter';

    return colDef;
  }

  getDateColDef(headerName: string, field: string): ColDef {
    let colDef = <ColDef>{
      headerName: headerName,
      field: field,
      filter: 'agDateColumnFilter',
      sortable: true,
      suppressMenu: true,
      floatingFilterComponent: 'dateFilterComponent',
      floatingFilterComponentParams: { suppressFilterButton: true },
      filterParams: {
        debounceMs: 500,
      },
      valueFormatter: (params) =>
        params.value ? formatDate(params.value, environment.dateFormat, this._locale) : null,
    };

    return colDef;
  }

  getTemplateColDef(
    headerName: string,
    field: string,
    width: number = 100,
    sortable: boolean,
    filter: boolean,
    pinned: boolean,
    template: TemplateRef<any>
  ): ColDef {
    return <ColDef>{
      headerName: headerName,
      field: field,
      sortable: sortable,
      filter: filter,
      suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
      width: width,
      pinned: pinned,
      cellRenderer: UiTemplateRendererComponent,
      cellRendererParams: {
        ngTemplate: template,
      },
      minWidth: 100,
    };
  }

  getStatusColDef(
    headerName: string,
    field: string,
    width: number = 100,
    pinned: string | boolean = false,
    template: TemplateRef<any>
  ): ColDef {
    return <ColDef>{
      headerName: headerName,
      headerClass: 'centered',
      field: field,
      sortable: true,
      filter: true,
      suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
      width: width,
      pinned: pinned,
      cellClass: 'flex items-center justify-center',
      cellRenderer: UiTemplateRendererComponent,
      cellRendererParams: {
        ngTemplate: template,
      },
      minWidth: 100,
    };
  }

  getActionColDef(
    headerName: string,
    field: string,
    width: number = 100,
    template: TemplateRef<any>
  ): ColDef {
    return <ColDef>{
      headerName: headerName,
      field: field,
      sortable: false,
      filter: false,
      width: width,
      cellClass: 'flex items-center',
      cellRenderer: UiTemplateRendererComponent,
      cellRendererParams: {
        ngTemplate: template,
      },
    };
  }
}

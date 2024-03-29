import { Injectable } from '@angular/core';
import { IGetRowsParams } from 'ag-grid-community';

@Injectable({ providedIn: 'root' })
export class UtilUrlQueryBuilderService {
  // output eg:
  // {skip: 0, limit: 10, name: "contains:test", email: "contains:john", sort: "asc:email;asc:name"}
  buildUrlFromAgGrid(params: IGetRowsParams) {
    const qParams: any = {};

    qParams.limit = params.endRow - params.startRow;
    qParams.page = Math.ceil(params.endRow / qParams.limit);

    Object.keys(params.filterModel).forEach((keys) => {
      const filter = params.filterModel[keys];
      let val = '';
      switch (filter.filterType) {
        case 'date':
          val = this._getDateFilterValue(filter);
          break;

        default:
          val = filter.type + ':' + filter.filter;
          break;
      }
      qParams[keys] = val;
    });

    const sortData: string[] = [];
    params.sortModel.forEach((model: any) => {
      sortData.push(`${model.sort}:${model.colId}`);
    });

    if (sortData.length > 0) {
      qParams.sort = sortData.join(';');
    }

    return qParams;
  }

  private _getDateFilterValue(filter: any) {
    switch (filter.type) {
      default:
        return filter.type + ':' + filter.dateFrom;
    }
  }
}

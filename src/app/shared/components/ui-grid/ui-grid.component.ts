import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  NgZone,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
  inject,
} from '@angular/core';
import { environment } from '@environments/environment';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import {
  ColDef,
  GridOptions,
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
} from 'ag-grid-community';
import { Observable, auditTime, fromEvent } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UiGridDateFilterComponent } from '@shared/components/ui-grid-date-filter/ui-grid-date-filter.component';
import { UtilAggridService } from '@shared/services/util-aggrid.service';
import { UtilUrlQueryBuilderService } from '@shared/services/util.urlquerybuilder.service';

@UntilDestroy()
@Component({
  selector: 'app-ui-grid',
  standalone: true,
  imports: [AgGridModule],
  templateUrl: './ui-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiGridComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('agGrid', { static: true }) agGrid!: AgGridAngular;

  readonly _ngZone = inject(NgZone);
  readonly _utilAggridService = inject(UtilAggridService);
  readonly _utilUrlQueryBuilderService = inject(UtilUrlQueryBuilderService);

  @Input() dataSource?: ((qParams: any) => Observable<any>) | null;
  @Input() columnDefs?: ColDef[] | null;
  @Input() gridOptions: GridOptions = {
    defaultColDef: {
      sortable: true,
    },
    animateRows: true,
    pagination: true,
    rowModelType: 'infinite',
    rowHeight: 45,
    cacheBlockSize: environment.pageSize,
    paginationPageSize: environment.pageSize,
    suppressCellFocus: true,
    paginationPageSizeSelector: [10, 20, 50, 100],
  };
  @Input() defaultColDef: ColDef = {
    sortable: false,
    filter: false,
    floatingFilter: true,
    resizable: true,
  };

  private _dataSource?: IDatasource;

  ngOnInit() {
    this.agGrid.components = {
      dateFilterComponent: UiGridDateFilterComponent,
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['columnDefs'] || changes['dataSource']) {
      if (this.columnDefs != undefined && this.dataSource != undefined) this.setDataSource();
    }
  }

  ngAfterViewInit() {
    this._ngZone.runOutsideAngular(() => {
      fromEvent(window, 'resize')
        .pipe(auditTime(16), untilDestroyed(this))
        .subscribe(() => this.agGrid.api.redrawRows());
    });
  }

  refreshTable() {
    this.agGrid.api.setGridOption('datasource', this._dataSource);
  }

  onGridReady(event: GridReadyEvent) {
    this.agGrid.api.setGridOption('datasource', this._dataSource);
    event.api.sizeColumnsToFit();
  }

  private setDataSource() {
    this._dataSource = {
      getRows: (params: IGetRowsParams) => {
        const urlParams = this._utilUrlQueryBuilderService.buildUrlFromAgGrid(params);
        this.agGrid.api.showLoadingOverlay();
        // perform callback from datasource
        this.dataSource?.(urlParams)
          .pipe(untilDestroyed(this))
          .subscribe((response) => {
            this.agGrid.api.hideOverlay();
            params.successCallback(response.data.data, response.data.total);
          });
      },
    };
  }
}

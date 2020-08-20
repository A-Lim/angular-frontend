import { OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subject, Observable } from 'rxjs';
import Swal from 'sweetalert2'

import { App } from 'app/configs/app.config';
import { AlertService } from 'app/shared/services/alert.service';
import { ModalService } from 'app/shared/services/modal.service';
import { ServiceLocator } from 'app/shared/services/servicelocator';
import { BreadCrumb } from 'app/shared/models/breadcrumb.model';

export abstract class Base implements OnInit, OnDestroy {
  public titleSvc: Title;
  public alertSvc: AlertService;
  public modalSvc: ModalService;

  public submitted = false;
  public isLoading = false;
  public destroy$: Subject<boolean> = new Subject<boolean>();
  public breadcrumbs$: Observable<BreadCrumb[]>;

  constructor() {
    this.titleSvc = ServiceLocator.inject(Title);
    this.alertSvc = ServiceLocator.inject(AlertService);
    this.modalSvc = ServiceLocator.inject(ModalService);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  setTitle(title: string) {
    this.titleSvc.setTitle(`${App.NAME} | ${title}`);
  }

  get SweetAlert() {
    return Swal;
  }
}
import { OnInit, OnDestroy, Directive, NgZone } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subject, from } from 'rxjs';
import Swal, { SweetAlertIcon } from 'sweetalert2'

import { App } from 'app/configs/app.config';
import { AlertService } from 'app/shared/services/alert.service';
import { ModalService } from 'app/shared/services/modal.service';
import { ServiceLocator } from 'app/shared/services/servicelocator';
import { Router } from '@angular/router';

@Directive()
export abstract class Base implements OnInit, OnDestroy {
  public titleSvc: Title;
  public alertSvc: AlertService;
  public modalSvc: ModalService;
  public router: Router;
  public ngZone: NgZone;

  public submitted = false;
  public isLoading = false;
  public destroy$ = new Subject<void>();

  constructor() {
    this.titleSvc = ServiceLocator.inject(Title);
    this.alertSvc = ServiceLocator.inject(AlertService);
    this.modalSvc = ServiceLocator.inject(ModalService);
    this.router = ServiceLocator.inject(Router);
    this.ngZone = ServiceLocator.inject(NgZone);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  setTitle(title: string) {
    this.titleSvc.setTitle(`${App.NAME} | ${title}`);
  }

  navigateTo(path: string, id?: string) {
    this.ngZone.run(() => this.router.navigate([path, id]));
  }

  swalConfirm(title: string, text: string, icon: SweetAlertIcon, confirmButtonText: string) {
    return from(Swal.fire({
      title: title,
      text: text,
      icon: icon, 
      showCancelButton: true, 
      confirmButtonText: confirmButtonText
    }));
  }

  swalAlert(title: string, text: string, icon: SweetAlertIcon) {
    return from(Swal.fire(title, text, icon));
  }
}
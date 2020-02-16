import { HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AlertService } from 'app/shared/services/alert.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(private alertService: AlertService) { }

 intercept(req: HttpRequest<any>, next: HttpHandler) {
   return next.handle(req)
     .pipe(
       catchError((error: HttpErrorResponse) => {
        // if error 401 and unauthenticated
        // dont throw error cause going to attempt to refresh token
        if (error.status !== 401 && 
          error.error && error.error.message !== 'Unauthenticated.') {
            if (error.error.errors) {
              const errorMessages = Object.values(error.error.errors);
              this.alertService.error(errorMessages);
            } else if (error.error.message) {
              this.alertService.error(error.error.message);
            } else {
            this.alertService.error('Oops, unable to process request currently');
            }
        }
        return throwError(error);
       })
     );
 }
}
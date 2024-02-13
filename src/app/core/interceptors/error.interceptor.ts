import {
  HttpErrorResponse,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private messageService: NzMessageService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.error.errors) {
          const errorMessages = Object.values(error.error.errors);
          const errorMessageCombined = errorMessages.join(' ');
          this.messageService.error(errorMessageCombined);
        } else if (error.error.message) {
          this.messageService.error(error.error.message);
        } else {
          this.messageService.error(error.message);
        }
        return throwError(() => error);
      })
    );
  }
}

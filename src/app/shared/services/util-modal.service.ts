import { Injectable, inject } from '@angular/core';
import { Observable, Subject, combineLatest, switchMap, take } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd/modal';

@Injectable({ providedIn: 'any' })
export class UtilModalService {
  private _modalService = inject(NzModalService);

  confirm$<T>(
    title$: Observable<string>,
    content$: Observable<string>,
    data: T // data to be passed over to the next step of stream
  ) {
    const subject = new Subject<T>();
    const ok$ = subject.asObservable();
    return combineLatest([title$, content$]).pipe(
      take(1),
      switchMap(([title, content]) => {
        this._modalService.confirm({
          nzTitle: title,
          nzContent: content,
          nzOnOk: () => subject.next(data),
        });
        return ok$;
      })
    );
  }
}

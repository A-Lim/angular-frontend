import {
  ChangeDetectorRef,
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { selectHasPermissions } from '@core/states/auth/auth.selectors';

@UntilDestroy()
@Directive({ selector: '[noPermissions]', standalone: true })
export class NoPermissionDirective implements OnInit {
  @Input({ required: true }) noPermissions!: string[];

  private _store = inject(Store);
  private _vcr = inject(ViewContainerRef);
  private _cdr = inject(ChangeDetectorRef);
  private _templateRef = inject(TemplateRef);

  ngOnInit() {
    this._store
      .select(selectHasPermissions(this.noPermissions))
      .pipe(
        filter((x) => x != null),
        untilDestroyed(this)
      )
      .subscribe((hasPermission) => {
        if (hasPermission) {
          this._vcr.clear();
        } else {
          this._vcr.createEmbeddedView(this._templateRef);
          this._cdr.detectChanges();
        }
      });
  }
}

import { Injectable, inject } from '@angular/core';
import { EMPTY, Observable, map } from 'rxjs';
import { Dictionary } from '@ngrx/entity';
import { Response } from '@core/models/response.model';
import {
  SessionState,
  SessionStateTypes,
} from '@core/states/session/session.state';
import { PermissionApiService } from '@shared/services/permissions.api-service';

@Injectable({ providedIn: 'root' })
export class SessionApiService {
  private _permissionsApiService = inject(PermissionApiService);

  getResource(
    resource: keyof SessionState,
    params?: Dictionary<any>
  ): Observable<SessionStateTypes> {
    let observable: Observable<Response<SessionStateTypes>> | undefined =
      undefined;
    switch (resource) {
      case 'permissions':
        observable = this._permissionsApiService.getPermissions();
    }

    return observable?.pipe(map((response) => response.data)) ?? EMPTY;
  }
}

import { Injectable, inject } from '@angular/core';
import { EMPTY, Observable, map } from 'rxjs';
import { Dictionary } from '@ngrx/entity';
import { Response } from '@core/models/response.model';
import { SessionState, SessionStateTypes } from '@core/states/session/session.state';
import { PermissionApiService } from '@shared/services/permissions.api-service';
import { PackagesApiService } from '@modules/packages/packages.api-service';

@Injectable({ providedIn: 'root' })
export class SessionApiService {
  private _permissionsApiService = inject(PermissionApiService);
  private _packagesApiService = inject(PackagesApiService);

  getResource(
    resource: keyof SessionState,
    params?: Dictionary<any>
  ): Observable<SessionStateTypes> {
    let observable: Observable<Response<SessionStateTypes>> | undefined = undefined;
    switch (resource) {
      case 'permissions':
        observable = this._permissionsApiService.getPermissions();
        break;

      case 'packages':
        observable = this._packagesApiService.getAllPackages();
        break;
    }

    return observable?.pipe(map((response) => response.data)) ?? EMPTY;
  }
}

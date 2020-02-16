import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared.module';

import { SystemSettingsRoutingModule } from './systemsettings.routing';
import { SystemSettingsComponent } from 'app/modules/systemsettings/systemsettings.component';
import { SystemsettingsGeneralTabComponent } from 'app/modules/systemsettings/systemsettings-general-tab/systemsettings-general-tab.component';

@NgModule({
  declarations: [
    SystemSettingsComponent,
    SystemsettingsGeneralTabComponent,
  ],
  imports: [
    SystemSettingsRoutingModule,
    SharedModule,
  ],
})
export class SystemSettingsModule { }

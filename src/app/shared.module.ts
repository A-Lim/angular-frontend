import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AlertComponent } from 'app/shared/components/alert/alert.component';
import { NavComponent } from 'app/shared/components/nav/nav.component';
import { FooterComponent } from 'app/shared/components/footer/footer.component';
import { SideMenuComponent } from 'app/shared/components/side-menu/side-menu.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AlertComponent,
    NavComponent,
    FooterComponent,
    SideMenuComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    
    AlertComponent,
    NavComponent,
    FooterComponent,
    SideMenuComponent,
  ]
})
export class SharedModule {
}

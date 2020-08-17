import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AgGridModule } from 'ag-grid-angular';
import { OverlayModule } from '@angular/cdk/overlay';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { DefaultModalComponent } from 'app/shared/components/modal/default.modal.component';
import { AlertComponent } from 'app/shared/components/alert/alert.component';
import { NavComponent } from 'app/shared/components/nav/nav.component';
import { FooterComponent } from 'app/shared/components/footer/footer.component';
import { SideMenuComponent } from 'app/shared/components/side-menu/side-menu.component';

import { SelectComponent } from 'app/shared/components/form-control/select/select.component';
import { FileInputComponent } from 'app/shared/components/form-control/fileinput/fileinput.component';

import { TemplateRendererComponent } from 'app/shared/components/template-renderer.component';
import { AdminLayoutComponent } from 'app/shared/components/layouts/admin/admin.layout.component';
import { DefaultLayoutComponent } from 'app/shared/components/layouts/default.layout.component.css/default.layout.component';



@NgModule({
  declarations: [
    AlertComponent,
    NavComponent,
    FooterComponent,
    SideMenuComponent,
    TemplateRendererComponent,
    // Form Input
    SelectComponent,
    FileInputComponent,

    AdminLayoutComponent,
    DefaultLayoutComponent,

    DefaultModalComponent

    // Directives
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CKEditorModule,
    AgGridModule.withComponents([
      TemplateRendererComponent
    ]),
    OverlayModule
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
    // ag-grid
    AgGridModule,
    TemplateRendererComponent,
    CKEditorModule,

    // form controls
    SelectComponent,
    FileInputComponent,
    // Directives
  ]
})
export class SharedModule {
}

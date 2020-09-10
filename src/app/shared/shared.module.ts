import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AgGridModule } from 'ag-grid-angular';
import { OverlayModule } from '@angular/cdk/overlay';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { AbilityModule } from '@casl/angular';
import { Ability, PureAbility } from '@casl/ability';

import { DefaultModalComponent } from 'app/shared/components/modal/default.modal.component';
import { AlertComponent } from 'app/shared/components/alert/alert.component';
import { NavComponent } from 'app/shared/components/nav/nav.component';
import { FooterComponent } from 'app/shared/components/footer/footer.component';
import { SideMenuComponent } from 'app/shared/components/side-menu/side-menu.component';
import { BreadCrumbComponent } from './components/breadcrumb/breadcrumb.component';

import { FileInputComponent } from 'app/shared/components/form-control/fileinput/fileinput.component';

import { TemplateRendererComponent } from 'app/shared/components/template-renderer.component';
import { AdminLayoutComponent } from 'app/shared/components/layouts/admin/admin.layout.component';
import { DefaultLayoutComponent } from 'app/shared/components/layouts/default.layout.component.css/default.layout.component';

// pipes
import { IsRouteActivePipe } from 'app/shared/pipes/isrouteactive.pipe';

// Validators
import { IsIntegerValidator } from 'app/shared//validators/isinteger.validator';
import { MatchValueValidator } from 'app/shared//validators/matchvalue.validator';
import { RequiredIfEitherNotEmptyValidator } from 'app/shared/validators/requiredifnotempty.validator';

// pages
import { PageNotFoundComponent } from 'app/shared/pages/pagenotfound/pagenotfound.component';
import { ForbiddenComponent } from 'app/shared/components/forbidden/forbidden.component';
import { AuthorizedContentComponent } from './components/authorized-content/authorized-content/authorized-content.component';

@NgModule({
  declarations: [
    AlertComponent,
    NavComponent,
    FooterComponent,
    SideMenuComponent,
    BreadCrumbComponent,
    ForbiddenComponent,
    AuthorizedContentComponent,

    TemplateRendererComponent,
    // Form Input
    FileInputComponent,

    AdminLayoutComponent,
    DefaultLayoutComponent,
    DefaultModalComponent,
    PageNotFoundComponent,

    // Pipe
    IsRouteActivePipe,

    // Validator
    IsIntegerValidator,
    MatchValueValidator,
    RequiredIfEitherNotEmptyValidator,
    AuthorizedContentComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    // TODO REMOVE
    ReactiveFormsModule,
    RouterModule,
    CKEditorModule,
    AgGridModule.withComponents([
      TemplateRendererComponent
    ]),
    OverlayModule,
    NgSelectModule,
    AbilityModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    // TODO REMOVE
    ReactiveFormsModule,
    RouterModule,
    
    AlertComponent,
    NavComponent,
    FooterComponent,
    SideMenuComponent,
    BreadCrumbComponent,
    ForbiddenComponent,
    PageNotFoundComponent,
    AuthorizedContentComponent,

    // 3rd party
    AgGridModule,
    TemplateRendererComponent,
    CKEditorModule,
    NgSelectModule,
    AbilityModule,

    // form controls
    FileInputComponent,
    // Directives

    // Pipes
    IsRouteActivePipe,

    // Validator
    IsIntegerValidator,
    MatchValueValidator,
    RequiredIfEitherNotEmptyValidator,
  ],
  providers: [
    { provide: Ability, useValue: new Ability() },
    { provide: PureAbility, useExisting: Ability },
  ]
})
export class SharedModule { }

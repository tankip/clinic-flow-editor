import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import 'hammerjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppMaterialModule } from './app-material.module';

import { AppComponent } from './app.component';
import { ViewWorkflowsComponent } from './view-workflows/view-workflows.component';
import { WorkflowEditorComponent } from './workflow-editor/workflow-editor.component';
import { WorkflowBuilderComponent } from './workflow-builder/workflow-builder.component';

import { AuthenticationService } from './services/authentication.service';
import { AuthGuardService } from './services/auth-guard.service';
import { LocalStorageService } from './services/local-storage.service';
import { SessionStorageService } from './services/session-storage.service';
import { SessionService } from './services/session.service';
import { SchemaService } from './services/schema.service';
import { NavigatorService } from './services/navigator.service';
import { ProgramsService } from './services/programs.service';
import { VisitService } from './services/visit.service';
import { EncounterTypesService } from './services/encounter-types.service';

import { AceEditorComponent } from 'ng2-ace-editor';
import 'brace/index';
import 'brace/mode/json';
import 'brace/theme/chrome';
import 'brace/theme/cobalt';
import 'brace/ext/searchbox';
import { NgxPaginationModule } from 'ngx-pagination';
import { TypeaheadModule } from 'ngx-bootstrap';
import { ClipboardModule } from 'ngx-clipboard';
import { LoginComponent } from './login/login.component';
import { NavigatorComponent } from './navigator/navigator.component';
import { ModalModule } from 'ngx-bootstrap';
import { SearchFilterPipe } from './search-filter.pipe';

@NgModule({
  declarations: [
    AppComponent,
    ViewWorkflowsComponent,
    WorkflowEditorComponent,
    AceEditorComponent,
    LoginComponent,
    WorkflowBuilderComponent,
    NavigatorComponent,
    SearchFilterPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    AppMaterialModule,
    NgxPaginationModule,
    ClipboardModule,
    BrowserAnimationsModule,
    TypeaheadModule.forRoot(),
    ModalModule.forRoot(),
  ],
  providers: [
    AuthenticationService,
    AuthGuardService,
    LocalStorageService,
    SessionService,
    SessionStorageService,
    SchemaService,
    NavigatorService,
    ProgramsService,
    VisitService,
    EncounterTypesService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }

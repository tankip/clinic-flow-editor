import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ViewWorkflowsComponent } from './view-workflows/view-workflows.component';
import { WorkflowEditorComponent } from './workflow-editor/workflow-editor.component';
import { LoginComponent } from './login/login.component';
import { AuthGuardService } from './services/auth-guard.service';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'schemas',
    pathMatch: 'full'
  },
  {
    path: 'schemas',
    component: ViewWorkflowsComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: WorkflowEditorComponent
  },
  {
    path: 'login',
    component: LoginComponent
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { useHash : true }
    )
  ],
  exports: [
    RouterModule
  ]
})

export class AppRoutingModule {}

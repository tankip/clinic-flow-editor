import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ViewWorkflowsComponent } from './view-workflows/view-workflows.component';
import { LoginComponent } from './login/login.component';
import { WorkflowBuilderComponent } from './workflow-builder/workflow-builder.component';

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
    component: WorkflowBuilderComponent
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

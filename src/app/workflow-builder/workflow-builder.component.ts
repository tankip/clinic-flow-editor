import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs/Rx';
import { MatSnackBar } from '@angular/material';

import { SchemaService } from '../services/schema.service';
import { SessionStorageService } from '../services/session-storage.service';
import { NavigatorService } from '../services/navigator.service';
import { Constants } from '../services/constants';

@Component({
  selector: 'app-workflow-builder',
  templateUrl: './workflow-builder.component.html',
  styleUrls: ['./workflow-builder.component.css']
})
export class WorkflowBuilderComponent implements OnInit, OnDestroy {

  public version: number;
  public subscription: Subscription;
  public loadedSchema;
  public raw;
  public schema;
  public user;
  private currentUrl: any;

  constructor(
    private route: ActivatedRoute,
    private schemaService: SchemaService,
    private navigatorService: NavigatorService,
    private router: Router,
    private snackBar: MatSnackBar,
    private sessionStorageService: SessionStorageService
  ) {
    const credentials = JSON.parse(sessionStorageService.getItem(Constants.USER_KEY));
    this.user = credentials.uuid;
  }

  ngOnInit() {

    this.currentUrl = this.router.url;

    this.subscription = this.route.params.subscribe((params) => {
      const uuid = params['id'];
      if ( uuid === 'new') {
        this.navigatorService.setSchema({});
      } else {
        this.version = uuid;
        this.schemaService.getSchema(this.version).subscribe((data) => {
          this.navigatorService.setSchema(data.schema);
          this.navigatorService.setSchemaInfo(data);
        });
      }
    });

    this.navigatorService.getSchema().subscribe((d) => {
      this.loadedSchema = JSON.stringify(d, null, '\t');
    });

    this.navigatorService.getClickedElementSchema().subscribe((res) => {
      this.raw = JSON.stringify(res, null, '\t');
    });

  }
  exit() {

    this.router.navigate(['/']);

  }

  ngOnDestroy() {
    const check = window.confirm('Are you sure you want to exit the editor?');
    if (check === false) {
      this.router.navigate([this.currentUrl]);
    } else {
      this.router.navigate(['/']);
    }
    this.subscription.unsubscribe();
  }

}

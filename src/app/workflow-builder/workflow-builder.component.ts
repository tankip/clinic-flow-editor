import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs/Rx';
import { MatSnackBar } from '@angular/material';

import { SchemaService } from '../services/schema.service';
import { SessionStorageService } from '../services/session-storage.service';
import { LocalStorageService } from '../services/local-storage.service';
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
  public schemaInfo;
  public raw;
  public schema;
  public user;
  public url;
  public loading = true;
  private currentUrl: any;

  constructor(
    private route: ActivatedRoute,
    private schemaService: SchemaService,
    private navigatorService: NavigatorService,
    private router: Router,
    private snackBar: MatSnackBar,
    private sessionStorageService: SessionStorageService,
    private localStorageService: LocalStorageService
  ) {
    const credentials = JSON.parse(sessionStorageService.getItem(Constants.USER_KEY));
    this.user = credentials;
  }

  ngOnInit() {

    this.currentUrl = this.router.url;
    this.url = this.sessionStorageService.getItem('url');

    this.subscription = this.route.params.subscribe((params) => {
      const uuid = params['id'];
      if ( uuid === 'new') {
        this.navigatorService.setSchema({});
        this.loading = false;
      } else if (uuid === 'restoredSchema') {
        const schema = this.localStorageService.getObject('rawSchema');
        this.loadedSchema = JSON.stringify(schema);
        this.navigatorService.setSchema(schema);
      } else {
        this.version = uuid;
        this.schemaService.getSchema(this.version).subscribe((data) => {
          this.navigatorService.setSchemaInfo({
            created_by : data.created_by,
            date_created : data.date_created,
            date_retired : data.date_retired,
            description : data.description,
            id : data.id,
            name : data.name,
            published : data.published,
            retired : data.retired,
            retired_by : data.retired_by,
            uuid : data.uuid,
            version : data.version
          });
          this.navigatorService.setSchema(data.schema);
          this.loading = false;
        });
      }
    });

    this.navigatorService.getSchema().subscribe((d) => {
      this.loadedSchema = JSON.stringify(d, null, '\t');
    });

    this.navigatorService.getSchemaInfo().subscribe((data) => {
      this.schemaInfo = data;
    });

    this.navigatorService.getClickedElementSchema().subscribe((res) => {
      this.raw = JSON.stringify(res, null, '\t');
    });

  }

  saveSchema() {
    if (this.loadedSchema) {
      const value = JSON.parse(this.loadedSchema);

     const payload = {
       name: value.name,
       creator: this.user.uuid,
       schema: JSON.stringify(value),
       uuid: value.uuid,
       description: value.description
     };

      const check = window.confirm('Are you sure you want to Save the schema?');
      if (check === false) {
        this.router.navigate([this.currentUrl]);
      } else {
        this.schemaService.saveSchema(payload).subscribe(success => {

          this.openSnackBar('Schema Saved Successfully');
          this.localStorageService.remove('rawSchema');
          this.localStorageService.remove('timestamp');
          this.loadedSchema = JSON.stringify(success.schema, null, '\t');
          this.router.navigate(['/edit', success.id]);

        }, (err) => {
          this.openSnackBar('There was an error while saving schema: ' + err);
        });
      }
    } else {
      this.openSnackBar('You cannot save an empty schema');
    }
  }

  public saveLocally() {
    this.localStorageService.setObject('rawSchema', JSON.parse(this.loadedSchema));
    this.localStorageService.setObject('timestamp', Date.now());
    this.openSnackBar('Schema Saved Successfully');
  }

  public publish() {
    const payload = {
      version: this.schemaInfo.version,
      id: this.schemaInfo.id,
      uuid: this.schemaInfo.uuid
    };

    const check = window.confirm('Are you sure you want to PUBLISH this schema?');
    if (check === false) {
      this.router.navigate([this.currentUrl]);
    } else {
      this.schemaService.deploySchema(payload).subscribe((success) => {
        if (success) {
          this.openSnackBar('Schema Published Successfully');
        }
      }, (error) => {
        this.openSnackBar('Error Publishing the Workflow.');
      });
    }
  }

  unpublish(id) {
    const payload = {
      id: this.schemaInfo.id
    };

    const check = window.confirm('Are you sure you want to UNPUBLISH this schema?');
    if (check === false) {
      this.router.navigate([this.currentUrl]);
    } else {
      this.schemaService.unpublishSchema(payload).subscribe((success) => {
        if (success) {
          this.openSnackBar('Schema Unpublished Successfully');
        }
      });
    }
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

  public openSnackBar(message) {
    this.snackBar.open(message, '', { duration: 2000 });
  }
}

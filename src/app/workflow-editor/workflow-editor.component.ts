import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

import { SchemaService } from '../services/schema.service';
import { SessionStorageService } from '../services/session-storage.service';
import { NavigatorService } from '../services/navigator.service';
import { Constants } from '../services/constants';
import * as _ from 'lodash';
import { scheduleMicroTask } from '@angular/core/src/util';

@Component({
  selector: 'app-workflow-editor',
  templateUrl: './workflow-editor.component.html',
  styleUrls: ['./workflow-editor.component.css']
})
export class WorkflowEditorComponent implements OnInit, OnDestroy {

  @ViewChild('editor') editor;
  public version: number;
  public loadedSchema;
  public schemInfo;
  public schema;
  public user;
  public raw;
  private currentUrl: any;

  @Input() set _schema(schema) {
    if (schema) {
      schema = JSON.parse(schema);
      this.loadedSchema = JSON.stringify(schema, null, '\t');
      this.schemInfo = schema;
      this.editor.setTheme('cobalt');
      this.editor.setMode('json');
      this.editor.setText(this.loadedSchema);
      this.editor.getEditor().setFontSize(16);
      this.editor.getEditor().scrollToLine(0);
      this.editSchema();
    }
  }

  @Input() set _raw(schema) {
    if (schema) {
      this.raw = schema;
      this.editor.setTheme('cobalt');
      this.editor.setMode('json');
      this.editor.setText(this.raw);
      this.editor.getEditor().setFontSize(16);
      this.editor.getEditor().scrollToLine(0);
      this.viewSchema();
    }
  }

  constructor(
    private route: ActivatedRoute,
    private schemaService: SchemaService,
    private navigatorService: NavigatorService,
    private router: Router,
    private snackBar: MatSnackBar,
    private sessionStorageService: SessionStorageService,
  ) {
    const credentials = JSON.parse(sessionStorageService.getItem(Constants.USER_KEY));
    this.user = credentials.uuid;
  }

  ngOnInit() {

    this.currentUrl = this.router.url;

  }

  ngOnDestroy() {
  }

  public editSchema() {
    this.editor.getEditor().setOptions({ readOnly: false });
    this.editor.setTheme('chrome');
  }

  public viewSchema() {
    this.editor.getEditor().setOptions({ readOnly: true });
    this.editor.setTheme('chrome');
  }

  public viewFullSchema() {
    this.editor.setText(this.loadedSchema);
    this.editSchema();
  }

  public saveSchema() {
    if (this.loadedSchema) {
      const value = JSON.parse(this.editor.getEditor().getValue());

     const payload = {
       name: value.name,
       creator: this.user,
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
          this.editor.setText(JSON.stringify(success.schema, null, '\t'));
          this.viewSchema();
          this.router.navigate(['/edit', success.id]);

        }, (err) => {
          this.openSnackBar('There was an error while saving schema: ' + err);
        });
      }
    } else {
      this.openSnackBar('You cannot save an empty schema');
    }

  }

  public openSnackBar(message) {
    this.snackBar.open(message, '', { duration: 2000 });
  }

}

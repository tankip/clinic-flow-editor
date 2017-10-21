import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

import { SchemaService } from '../services/schema.service';
import { SessionStorageService } from '../services/session-storage.service';
import { Constants } from '../services/constants';

import { AceEditorComponent } from 'ng2-ace-editor';

import 'brace/index';
import 'brace/mode/json';
import 'brace/theme/chrome';
import 'brace/theme/cobalt';
import 'brace/ext/searchbox';

@Component({
  selector: 'app-workflow-editor',
  templateUrl: './workflow-editor.component.html',
  styleUrls: ['./workflow-editor.component.css']
})
export class WorkflowEditorComponent implements OnInit, OnDestroy {

  @ViewChild('editor') editor;

  public version: number;
  public loadedSchema;
  public schema;
  public user;
  private currentUrl: any;

  constructor(
    private route: ActivatedRoute,
    private schemaService: SchemaService,
    private router: Router,
    private snackBar: MatSnackBar,
    private sessionStorageService: SessionStorageService
  ) {
    const credentials = JSON.parse(sessionStorageService.getItem(Constants.USER_KEY));
    this.user = credentials.uuid;
  }

  ngOnInit() {

    this.currentUrl = this.router.url;

    this.route.params.subscribe((params) => {
      this.version = params['id'];
    });

    this.schemaService.getSchema(this.version).subscribe((data) => {

      this.loadedSchema = JSON.stringify(data.schema, null, 4);
      this.schema = data.info;
      this.editor.setTheme('cobalt');
      this.editor.setMode('json');
      this.editor.setText(this.loadedSchema);
      this.editor.getEditor().setFontSize(16);
      this.editor.getEditor().scrollToLine(0);
      this.viewSchema();

    });

  }

  ngOnDestroy() {
    const check = window.confirm('Are you sure you want to exit the editor?');
    if (check === false) {
      this.router.navigate([this.currentUrl]);
    }
  }

  public editSchema() {
    this.editor.getEditor().setOptions({ readOnly: false });
    this.editor.setTheme('chrome');
  }

  public viewSchema() {
    this.editor.getEditor().setOptions({ readOnly: true });
    this.editor.setTheme('cobalt');
  }

  public saveSchema() {

    const value = this.editor.getEditor().getValue();

    const payload = {
      user: this.user,
      schema: value
    };

    const check = window.confirm('Are you sure you want to Save the schema?');
    if (check === false) {
      this.router.navigate([this.currentUrl]);
    } else {
      this.schemaService.saveSchema(payload).subscribe(success => {

        this.version = success.info;
        this.openSnackBar('Schema Saved Successfully');

        this.editor.setText(JSON.stringify(success.schema, null, 4));
        this.viewSchema();
        this.router.navigate(['/edit', this.version]);

      }, (err) => {
        this.openSnackBar('There was an error while saving schema: ' + err);
      });
    }

  }

  public openSnackBar(message) {
    this.snackBar.open(message, '', { duration: 2000 });
  }

}

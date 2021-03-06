import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SchemaService } from '../services/schema.service';
import { AuthenticationService } from '../services/authentication.service';
import { MatSnackBar } from '@angular/material';
import { SessionStorageService } from '../services/session-storage.service';
import { LocalStorageService } from '../services/local-storage.service';
import { Constants } from '../services/constants';

@Component({
  selector: 'app-view-workflows',
  templateUrl: './view-workflows.component.html',
  styleUrls: ['./view-workflows.component.css']
})
export class ViewWorkflowsComponent implements OnInit {

  public schemas;
  public page = 1;
  public loggingOut = false;
  public currentUrl;
  public searchValue = '';
  public user;
  public restoreMessage= '';
  public draftAvailable = false;

  constructor(
    private schemaService: SchemaService,
    private router: Router,
    private snackBar: MatSnackBar,
    private auth: AuthenticationService,
    private sessionStorageService: SessionStorageService,
    private localStorageService: LocalStorageService
  ) {
    const credentials = JSON.parse(sessionStorageService.getItem(Constants.USER_KEY));
    this.user = credentials;
  }

  ngOnInit() {
    this.getSchemas();
    this.currentUrl = this.router.url;
    this.checkDraft();
  }

  public createSchema() {
    this.router.navigate(['/edit', 'new']);
  }

  public getSchemas() {
    this.schemaService.getAllSchemas().subscribe((data) => {
      this.schemas = data.reverse();
    }, (err) => {
      console.log('err', err);
    });
  }

  public checkDraft() {
    const schema = this.localStorageService.getObject('rawSchema');
    const timestamp = this.localStorageService.getObject('timestamp');
    if (schema) {
      this.draftAvailable = true;
      this.restoreMessage =
      `Workflow, ${ schema.name }, was last worked on at ${new Date(parseInt(timestamp)).toLocaleDateString()}
      ${new Date(parseInt(timestamp)).toLocaleTimeString()} Would you like to continue working on this?`;
    }
  }
  public editSchema(id) {
    this.router.navigate(['/edit', id]);
  }

  retireSchema(id) {
    const payload = {
      id: id,
      user: this.user.uuid
    };

    const check = window.confirm('Are you sure you want to RETIRE this schema?');
    if (check === false) {
      this.router.navigate([this.currentUrl]);
    } else {
      this.schemaService.retireSchema(payload).subscribe((success) => {
        if (success) {
          this.getSchemas();
          this.openSnackBar('Schema Retired Successfully');
        }
      });
    }
  }

  unretireSchema(id) {
    const payload = {
      id: id
    };

    const check = window.confirm('Are you sure you want to UNRETIRE this schema?');
    if (check === false) {
      this.router.navigate([this.currentUrl]);
    } else {
      this.schemaService.unretireSchema(payload).subscribe((success) => {
        if (success) {
          this.getSchemas();
          this.openSnackBar('Schema unRetired Successfully');
        }
      });
    }
  }

  public logout() {
    this.loggingOut = true;
      this.auth.logOut().catch(e => this.router.navigate(['/login']))
      .subscribe(res => {
        this.router.navigate(['/login']);
      });
  }

  public openSnackBar(message) {
    this.snackBar.open(message, '', { duration: 2500 });
  }

  public discard() {
    this.draftAvailable = false;
    this.localStorageService.remove('rawSchema');
    this.localStorageService.remove('timestamp');
  }

  public restore() {
    this.router.navigate(['/edit', 'restoredSchema']);
  }

}

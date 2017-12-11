import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SchemaService } from '../services/schema.service';
import { AuthenticationService } from '../services/authentication.service';
import { MatSnackBar } from '@angular/material';
import { SessionStorageService } from '../services/session-storage.service';
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

  constructor(
    private schemaService: SchemaService,
    private router: Router,
    private snackBar: MatSnackBar,
    private auth: AuthenticationService,
    private sessionStorageService: SessionStorageService
  ) {
    const credentials = JSON.parse(sessionStorageService.getItem(Constants.USER_KEY));
    this.user = credentials.uuid;
  }

  ngOnInit() {
    this.getSchemas();
    this.currentUrl = this.router.url;
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

  public editSchema(version) {
    this.router.navigate(['/edit', version]);
  }

  public deploySchema(version, id, uuid) {
    const payload = {
      version: version,
      id: id,
      uuid: uuid
    };

    const check = window.confirm('Are you sure you want to DEPLOY this schema?');
    if (check === false) {
      this.router.navigate([this.currentUrl]);
    } else {
      this.schemaService.deploySchema(payload).subscribe((success) => {
        if (success) {
          this.getSchemas();
          this.openSnackBar('Schema Deployed Successfully');
        }
      });
    }
  }
  retireSchema(id) {
    const payload = {
      id: id,
      user: this.user
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

}

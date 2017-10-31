import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SchemaService } from '../services/schema.service';
import { AuthenticationService } from '../services/authentication.service';
import { MatSnackBar } from '@angular/material';

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

  constructor(
    private schemaService: SchemaService,
    private router: Router,
    private snackBar: MatSnackBar,
    private auth: AuthenticationService
  ) { }

  ngOnInit() {
    this.getSchemas();
    this.currentUrl = this.router.url;
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

  public deploySchema(version) {
    const payload = {
      version: version
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

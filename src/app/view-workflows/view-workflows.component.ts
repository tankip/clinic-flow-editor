import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SchemaService } from '../services/schema.service';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-view-workflows',
  templateUrl: './view-workflows.component.html',
  styleUrls: ['./view-workflows.component.css']
})
export class ViewWorkflowsComponent implements OnInit {

  public schemas;
  public page = 1;
  public loggingOut = false;

  constructor(
    private schemaService: SchemaService,
    private router: Router,
    private auth: AuthenticationService
  ) { }

  ngOnInit() {
    this.getSchemas();
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
    console.log('Version', version);
  }

  public logout() {
    this.loggingOut = true;
      this.auth.logOut().catch(e => this.router.navigate(['/login']))
      .subscribe(res => {
        this.router.navigate(['/login']);
      });
  }

}

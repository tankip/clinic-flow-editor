import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { SessionStorageService } from './session-storage.service';
import { AuthenticationService } from './authentication.service';
import { Constants } from './constants';

@Injectable()
export class SchemaService {

  public sUrl;
  private headers = new Headers();

  public schema: BehaviorSubject<any> = new BehaviorSubject<any>([]);

  constructor( private http: Http,
    private sessionStorageService: SessionStorageService,
    private auth: AuthenticationService
  ) {
    const credentials = JSON.parse(sessionStorageService.getItem(Constants.USER_KEY));
    const url = sessionStorage.getItem(Constants.BASE_URL);
    this.sUrl = url;
    auth.getCredentialsSubject().subscribe((creds) => {
      this.headers.delete('Authorization');
      this.headers.append('Authorization', 'Basic ' + creds);
    });
    this.headers.append('Content-Type', 'application/json');
  }

  public getAllSchemas() {

    return this.http.get(Constants.CLINIC_FLOW_SERVER + 'get-all-schemas', { headers: this.headers })
      .map((res) => {
        return res.json();
      });

  }

  public getUser(uuid) {
    return this.http.get(this.sUrl + '/ws/rest/v1/user/' + uuid, { headers: this.headers })
    .map(res => {
      return res.json();
    });
  }

  public getSchema(version) {

    this.http.get(Constants.CLINIC_FLOW_SERVER + 'get-schema/' + version, { headers: this.headers })
      .map((res) => res.json())
      .subscribe((result) => {
        this.schema.next(result);
      }, (error) => {
        this.schema.error(error);
      });

    return this.schema.asObservable();

  }

  public saveSchema(value) {

    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });

    const url =  Constants.CLINIC_FLOW_SERVER + 'save-schema';

    return this.http.post(url, value, options)
    .map((res) => {
      if (res) {
        return res.json();
      }
    });

  }

  public deploySchema(version) {

    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    const url =  Constants.CLINIC_FLOW_SERVER + 'deploy-schema';

    return this.http.post(url, version, options)
    .map((res) => {
      return res.json();
    });

  }

  public unpublishSchema(id) {

    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    const url =  Constants.CLINIC_FLOW_SERVER + 'unpublish-schema';

    return this.http.post(url, id, options)
    .map((res) => {
      return res.json();
    });

  }

  public retireSchema(id) {

    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    const url =  Constants.CLINIC_FLOW_SERVER + 'retire-schema';

    return this.http.post(url, id, options)
    .map((res) => {
      return res.json();
    });
  }

  public unretireSchema(id) {

    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    const url =  Constants.CLINIC_FLOW_SERVER + 'unretire-schema';

    return this.http.post(url, id, options)
    .map((res) => {
      return res.json();
    });
  }

}

import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { SessionStorageService } from './session-storage.service';
import { Constants } from './constants';

@Injectable()
export class SchemaService {

  public sUrl;

  public schema: BehaviorSubject<any> = new BehaviorSubject<any>([]);

  constructor( private http: Http, private sessionStorageService: SessionStorageService ) {
    const credentials = JSON.parse(sessionStorageService.getItem(Constants.USER_KEY));
    const url = sessionStorage.getItem(Constants.BASE_URL);
    this.sUrl = url;
  }

  getAllSchemas() {

    return this.http.get(Constants.NODE_BASE_URL + 'get-all-schemas')
      .map((res) => {
        if (res) {
          const results = res.json();
          const myRes = [];
          results.forEach(value => {
            this.getUser(value.created_by).subscribe((response) => {
              myRes.push({
                user: response.person.display,
                schema: value
              });
            });
          });
          return myRes;
        }
      });

  }

  getUser(uuid) {
    return this.http.get(this.sUrl + '/ws/rest/v1/user/' + uuid)
    .map(res => {
      return res.json();
    });
  }

  getSchema(version) {

    this.http.get(Constants.NODE_BASE_URL + 'get-schema/' + version)
      .map((res) => res.json())
      .subscribe((result) => {
        this.schema.next(result);
      }, (error) => {
        this.schema.error(error);
      });

    return this.schema.asObservable();

  }

  saveSchema(value) {

    const rschema: BehaviorSubject<any> = new BehaviorSubject<any>([]);

    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });

    const url =  Constants.NODE_BASE_URL + 'save-schema';

    return this.http.post(url, value, options)
    .map((res) => {
      if (res) {
        return res.json();
      }
    });

  }

}

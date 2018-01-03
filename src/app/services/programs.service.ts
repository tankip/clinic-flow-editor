import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable, Subject, ReplaySubject } from 'rxjs/Rx';
import { Constants } from './constants';

@Injectable()
export class ProgramsService {

  constructor(
    private http: Http
  ) { }

  public getUrl() {
    return Constants.SERVER_URL + 'program';
  }

  public getAllPrograms() {

    const url = this.getUrl();
    const v = 'custom:(uuid,display,description)';

    const params: URLSearchParams = new URLSearchParams();
    params.set('v', v);

    return this.http.get(url, {
      search: params
    }).map((response: Response) => {
      return response.json().results;
    });
  }

}

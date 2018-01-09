import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable, Subject, ReplaySubject } from 'rxjs/Rx';
import { Constants } from './constants';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class ProgramsService {
  private headers = new Headers();

  constructor(
    private http: Http,
    private auth: AuthenticationService
  ) {
    auth.getCredentialsSubject().subscribe((creds) => {
      this.headers.delete('Authorization');
      this.headers.append('Authorization', 'Basic ' + creds);
    });
    this.headers.append('Content-Type', 'application/json');
  }

  public getUrl() {
    return Constants.SERVER_URL + 'program';
  }

  public getAllPrograms() {

    const url = this.getUrl();
    const v = 'custom:(uuid,display,description)';

    const params: URLSearchParams = new URLSearchParams();
    params.set('v', v);

    return this.http.get(url, {
      search: params,
      headers: this.headers
    }).map((response: Response) => {
      return response.json().results;
    });
  }

}

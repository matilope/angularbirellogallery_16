import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from '@global/global';
import { UserObservable, UsersObservable } from '@core/models/user';

@Injectable()
export class AdminService {
  public url: string;
  private _http: HttpClient = inject(HttpClient);

  constructor() {
    this.url = Global.url;
  }

  getUsers(): Observable<UsersObservable> {
    return this._http.get<UsersObservable>(this.url + 'users');
  }

  deleteUser(id: string): Observable<UserObservable> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.delete<UserObservable>(this.url + 'user/' + id, { headers: headers });
  }
}

import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Global } from '@global/global';
import { User, UserObservable } from '@core/models/user';
import { environment } from 'src/environments/environment.prod';
import { Observable } from 'rxjs';

@Injectable()
export class AuthService {
  public url: string;
  private _http: HttpClient = inject(HttpClient);
  private _router: Router = inject(Router);
  private platformId: Object = inject(PLATFORM_ID);

  constructor() {
    this.url = Global.url;
  }

  registerUser(user: User): Observable<UserObservable> {
    return this._http.post<UserObservable>(this.url + 'register', user);
  }

  loginUser(user: User): Observable<UserObservable> {
    return this._http.post<UserObservable>(this.url + 'login', user);
  }

  logoutUser(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(environment.token);
      this._router.navigate(['/admin/login']);
    }
  }

  getToken(): string | void {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(environment.token);
    }
  }

  loggedIn(): boolean | void {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem(environment.token);
    }
  }

}

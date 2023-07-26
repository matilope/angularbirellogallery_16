import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Token, TokenObservable, TokensObservable } from '@core/models/token';
import { Global } from '@global/global';

@Injectable()
export class InstagramService {
  public token!: string;
  public url: string;
  private _http: HttpClient = inject(HttpClient);

  constructor() {
    this.url = Global.url;
  }

  getTokens(): Observable<TokensObservable> {
    return this._http.get<TokensObservable>(this.url + 'tokens');
  }

  getToken(tokenId: string): Observable<TokenObservable> {
    return this._http.get<TokenObservable>(this.url + 'token/' + tokenId);
  }

  saveToken(token: Token): Observable<TokenObservable> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.post<TokenObservable>(this.url + 'savetoken', { token }, { headers: headers, });
  }

  updateToken(id: string, token: Token): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.put(this.url + 'token/' + id, { token }, { headers: headers, });
  }

  getInstagram(token: string): Observable<any> {
    return this._http.get(
      `https://graph.instagram.com/v1.0/17841403549294920/media?access_token=${token}&pretty=1&fields=caption%2Cmedia_url%2Cmedia_type%2Cpermalink%2Ctimestamp%2Cusername&limit=6`
    );
  }

  getInstagramNext(token: string, after: string): Observable<any> {
    return this._http.get(
      `https://graph.instagram.com/v1.0/17841403549294920/media?access_token=${token}&pretty=1&fields=caption%2Cmedia_url%2Cmedia_type%2Cpermalink%2Ctimestamp%2Cusername&limit=20&after=${after}`
    );
  }

}

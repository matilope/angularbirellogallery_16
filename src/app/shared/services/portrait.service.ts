import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PortraitObservable, PortraitsObservable } from '@core/models/portrait';
import { Global } from '@global/global';

@Injectable({ providedIn: 'root' })
export class PortraitService {
  public url: string;
  private _http: HttpClient = inject(HttpClient);

  constructor() {
    this.url = Global.url;
  }

  getPortraits(): Observable<PortraitsObservable> {
    return this._http.get<PortraitsObservable>(this.url + 'portraits');
  }

  getPortrait(portraitId: string): Observable<PortraitObservable> {
    return this._http.get<PortraitObservable>(this.url + 'portrait/' + portraitId);
  }

  updatePortrait(id: string, portrait: FormData): Observable<PortraitObservable> {
    return this._http.put<PortraitObservable>(this.url + 'portrait/' + id, portrait);
  }
}

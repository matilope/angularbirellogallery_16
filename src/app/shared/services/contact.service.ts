import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from '@global/global';
import { Contact } from '@core/models/contact';

@Injectable({ providedIn: 'root' })
export class ContactService {
  public url: string;
  private _http: HttpClient = inject(HttpClient);

  constructor() {
    this.url = Global.url;
  }

  getContacts(body: Contact): Observable<Contact> {
    return this._http.post<Contact>(this.url + 'formulario', body);
  }
}

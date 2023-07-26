import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from '@global/global';
import { PaintingsObservable, PaintingObservable } from '@core/models/painting';

@Injectable()
export class PaintingsService {
  public url: string;
  private _http: HttpClient = inject(HttpClient);

  constructor() {
    this.url = Global.url;
  }

  getPaintings(): Observable<PaintingsObservable> {
    return this._http.get<PaintingsObservable>(this.url + 'paintings/?page=1&limit=100');
  }

  getPaintingsPagination(page: number): Observable<PaintingsObservable> {
    return this._http.get<PaintingsObservable>(`${this.url}paintings/?page=${page}&limit=3`);
  }

  getPainting(pinturaId: string): Observable<PaintingObservable> {
    return this._http.get<PaintingObservable>(this.url + 'painting/' + pinturaId);
  }

  save(body: FormData): Observable<PaintingObservable> {
    return this._http.post<PaintingObservable>(this.url + 'save', body);
  }

  update(id: string, body: FormData): Observable<PaintingObservable> {
    return this._http.put<PaintingObservable>(this.url + 'painting/' + id, body);
  }

  delete(id: string): Observable<PaintingObservable> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.delete<PaintingObservable>(this.url + 'painting/' + id, { headers: headers });
  }

  deleteImg(id: string, index: number): Observable<PaintingObservable> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.post<PaintingObservable>(this.url + 'delete_image', { index, id }, { headers: headers });
  }

  search(search: string): Observable<PaintingsObservable> {
    return this._http.get<PaintingsObservable>(this.url + `search/?search=${search}`);
  }
}

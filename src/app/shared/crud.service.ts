import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Page } from './page';

// Calls for one admin section at /api/admin/<resource>. Extend it once per section.
export abstract class CrudService<T, TRequest> {
  protected http = inject(HttpClient);
  private url: string;

  // `sort` is Spring's sort parameter, e.g. 'startDate,desc', or a list of them.
  constructor(resource: string, private sort: string | string[] = 'createdAt,desc') {
    this.url = `${environment.apiUrl}/api/admin/${resource}`;
  }

  list(page = 0, size = 20): Observable<Page<T>> {
    return this.http.get<Page<T>>(this.url, { params: { page, size, sort: this.sort } });
  }

  get(id: number): Observable<T> {
    return this.http.get<T>(`${this.url}/${id}`);
  }

  create(body: TRequest): Observable<T> {
    return this.http.post<T>(this.url, body);
  }

  update(id: number, body: TRequest): Observable<T> {
    return this.http.put<T>(`${this.url}/${id}`, body);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}

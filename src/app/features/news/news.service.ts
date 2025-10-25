import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, switchMap, tap, map } from 'rxjs';
import { News } from './models/news.model';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private http = inject(HttpClient);
  private api = 'https://test.tyonline.pl';

  getNews(): Observable<News[]> {
    const existing = localStorage.getItem('auth_token');

    console.log(
      '[token] saved to localStorage:',
      this.mask(localStorage.getItem('auth_token') || '')
    );

    if (existing) {
      return this.fetchNews(existing);
    }

    return this.login().pipe(switchMap((token) => this.fetchNews(token)));
  }

  private login(): Observable<string> {
    return this.http
      .post<{ token: string }>(`${this.api}/login`, {
        email: 'test@test.com',
        password: 'sekrecik',
        device: 'Chrome',
      })
      .pipe(
        tap(({ token }) => {
          localStorage.setItem('auth_token', token);
        }),
        switchMap(({ token }) => Promise.resolve(token))
      );
  }

  private fetchNews(token: string): Observable<News[]> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<News[]>(`${this.api}/news`, { headers });
  }

  private mask(t: string): string {
    return t && t.length > 12 ? `${t.slice(0, 6)}…${t.slice(-4)}` : t;
  }
}

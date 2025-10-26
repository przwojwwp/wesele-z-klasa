import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, switchMap, of, tap } from 'rxjs';
import { News } from './models/news.model';

@Injectable({ providedIn: 'root' })
export class NewsService {
  private http = inject(HttpClient);
  private api = 'https://test.tyonline.pl';

  getNews(): Observable<News[]> {
    return this.ensureToken().pipe(
      switchMap((token) => {
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
        return this.http.get<News[]>(`${this.api}/news`, { headers });
      }),
      map((news) =>
        (Array.isArray(news) ? news : []).sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      ),
      tap((news) => {
        console.log('[NewsService] mapped & sorted:', news);
      })
    );
  }

  private ensureToken(): Observable<string> {
    const existing = localStorage.getItem('auth_token');
    if (existing) {
      console.log('[token] found:', this.mask(existing));
      return of(existing);
    }
    return this.login().pipe(
      tap((token) => {
        localStorage.setItem('auth_token', token);
        console.log('[token] saved:', this.mask(token));
      })
    );
  }

  private login(): Observable<string> {
    return this.http
      .post<{ token: string }>(`${this.api}/login`, {
        email: 'test@test.com',
        password: 'sekreciks',
        device: 'Chrome',
      })
      .pipe(map(({ token }) => token));
  }

  private mask(t: string): string {
    return t && t.length > 12 ? `${t.slice(0, 6)}…${t.slice(-4)}` : t;
  }
}

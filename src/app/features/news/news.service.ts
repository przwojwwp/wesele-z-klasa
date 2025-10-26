import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, switchMap, of, tap } from 'rxjs';
import { News } from './models/news.model';
import { AuthService } from '../../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class NewsService {
  private http = inject(HttpClient);
  private api = 'https://test.tyonline.pl';
  private auth = inject(AuthService);

  getNews(): Observable<News[]> {
    return this.auth.login({ email: 'test@test.com', password: 'sekrecik', device: 'Chrome' }).pipe(
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
        console.log(this.auth.getToken());
        console.log('[NewsService] mapped & sorted:', news);
      })
    );
  }
}

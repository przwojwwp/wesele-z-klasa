import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { News } from './models/news.model';
import { AuthService } from '../../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class NewsService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private api = 'https://test.tyonline.pl';

  getNews(): Observable<News[]> {
    const token = this.auth.getToken();
    if (!token) {
      return throwError(() => new Error('User not logged in'));
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http
      .get<News[]>(`${this.api}/news`, { headers })
      .pipe(
        map((news) =>
          (Array.isArray(news) ? news : []).sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
        )
      );
  }
}

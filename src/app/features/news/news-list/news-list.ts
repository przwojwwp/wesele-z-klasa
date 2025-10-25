import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-news-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './news-list.html',
  styleUrls: ['./news-list.scss'],
})
export class NewsListComponent implements OnInit {
  private http = inject(HttpClient);
  private api = 'https://test.tyonline.pl';

  ngOnInit(): void {
    this.http
      .post<{ token: string }>(`${this.api}/login`, {
        email: 'test@test.com',
        password: 'sekrecik',
        device: 'Chrome',
      })
      .pipe(
        switchMap(({ token }) => {
          localStorage.setItem('auth_token', token);
          const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
          return this.http.get(`${this.api}/news`, { headers });
        })
      )
      .subscribe({
        next: (res) => console.log('[GET /news] response:', res),
        error: (err) => console.error('[Flow] error:', err),
      });
  }
}

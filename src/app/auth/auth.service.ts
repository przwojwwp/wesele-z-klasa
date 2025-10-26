import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, tap, catchError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private api = 'https://test.tyonline.pl';
  private TOKEN_KEY = 'auth_token';

  get token(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  logout(): Observable<void> {
    const token = this.token;
    if (!token) {
      this.clearToken();
      return of(void 0);
    }
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<void>(`${this.api}/logout`, { headers }).pipe(
      catchError(() => of(void 0)),
      tap(() => this.clearToken())
    );
  }
}

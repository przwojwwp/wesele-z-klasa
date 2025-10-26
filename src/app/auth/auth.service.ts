import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, tap, catchError, map } from 'rxjs';

export interface LoginCredentials {
  email: string;
  password: string;
  device: string;
}

export interface User {
  email?: string;
  name?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private api = 'https://test.tyonline.pl';
  private TOKEN_KEY = 'auth_token';

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  login(credentials: LoginCredentials): Observable<string> {
    return this.http.post<{ token: string }>(`${this.api}/login`, credentials).pipe(
      tap(({ token }) => this.setToken(token)),
      map(({ token }) => token)
    );
  }

  logout(): Observable<void> {
    return this.http.get<void>(`${this.api}/logout`).pipe(
      tap(() => this.clearToken()),
      catchError(() => {
        this.clearToken();
        return of(void 0);
      })
    );
  }

  getUser(): Observable<User | null> {
    const token = this.getToken();
    if (!token) {
      return of(null);
    }

    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
    return this.http.get<User>(`${this.api}/login`, { headers }).pipe(catchError(() => of(null)));
  }
}

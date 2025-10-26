import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap, catchError, finalize } from 'rxjs/operators';

export interface LoginCredentials {
  email: string;
  password: string;
  device: string;
}

export interface User {
  email?: string;
  name?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private readonly API = 'https://test.tyonline.pl';
  private readonly TOKEN_KEY = 'auth_token';

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
    return this.http.post<{ token: string }>(`${this.API}/login`, credentials).pipe(
      tap(({ token }) => this.setToken(token)),
      map(({ token }) => token)
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.API}/logout`, {}).pipe(
      finalize(() => this.clearToken()),
      catchError(() => {
        this.clearToken();
        return of(void 0);
      })
    );
  }

  getUser(): Observable<User | null> {
    if (!this.getToken()) {
      return of(null);
    }
    return this.http.get<User>(`${this.API}/login`).pipe(catchError(() => of(null)));
  }
}

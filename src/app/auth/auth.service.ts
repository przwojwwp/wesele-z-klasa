import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, tap, catchError, finalize, map } from 'rxjs';

export interface LoginCredentials {
  email: string;
  password: string;
  device?: string;
}

export interface User {
  email?: string;
  username?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private readonly API = 'https://test.tyonline.pl';
  private readonly TOKEN_KEY = 'auth_token';

  readonly isLoggedIn = signal<boolean>(!!localStorage.getItem(this.TOKEN_KEY));
  readonly user = signal<User | null>(null);

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.isLoggedIn.set(true);
  }

  private clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.isLoggedIn.set(false);
    this.user.set(null);
  }

  login(credentials: LoginCredentials): Observable<string> {
    const device = credentials.device || this.getBrowserName();
    return this.http.post<{ token: string }>(`${this.API}/login`, { ...credentials, device }).pipe(
      tap(({ token }) => {
        this.setToken(token);
        this.fetchUser().subscribe();
      }),
      map(({ token }) => token)
    );
  }

  logout(): Observable<void> {
    return this.http.get<void>(`${this.API}/logout`).pipe(
      finalize(() => this.clearToken()),
      catchError(() => {
        this.clearToken();
        return of(void 0);
      })
    );
  }

  getUser(): Observable<User | null> {
    const token = this.getToken();
    if (!token) return of(null);
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<User>(`${this.API}/login`, { headers }).pipe(
      tap((user) => this.user.set(user)),
      catchError(() => {
        this.user.set(null);
        return of(null);
      })
    );
  }

  fetchUser(): Observable<User | null> {
    return this.getUser();
  }

  private getBrowserName(): string {
    const ua = navigator.userAgent;
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari')) return 'Safari';
    return 'Unknown';
  }
}

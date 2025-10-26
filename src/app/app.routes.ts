import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login';
import { NewsListComponent } from './features/news/news-list/news-list';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'news', component: NewsListComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'news', pathMatch: 'full' },
  { path: '**', redirectTo: 'news' },
];

import { Component, OnInit, signal, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected readonly title = signal('news-app');
  protected readonly loggedIn = signal(false);
  private auth = inject(AuthService);

  ngOnInit() {
    this.auth.getUser().subscribe((user) => {
      this.loggedIn.set(!!user);
    });
  }
}

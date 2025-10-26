import { Component, OnInit, inject, signal } from '@angular/core';
import { NewsService } from '../news.service';
import { News } from '../models/news.model';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-news-list',
  standalone: true,

  templateUrl: './news-list.html',
  styleUrls: ['./news-list.scss'],
})
export class NewsListComponent implements OnInit {
  private newsService = inject(NewsService);
  private sanitizer = inject(DomSanitizer);
  private auth = inject(AuthService);

  news = signal<News[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  getSafeHtml(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  ngOnInit(): void {
    this.loading.set(true);
    this.newsService.getNews().subscribe({
      next: (news) => {
        this.news.set(news);
        this.loading.set(false);
        console.log(news);
      },
      error: (err) => {
        console.error('[GET /news] error:', err);
        this.error.set('Failed to load news');
        this.loading.set(false);
      },
    });
  }
}

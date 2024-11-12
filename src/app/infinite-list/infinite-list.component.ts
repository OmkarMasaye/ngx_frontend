import { Component } from '@angular/core';
import { NewsService } from './news.service';
import { CommonModule } from '@angular/common';
import { NbCardModule, NbLayoutModule, NbListModule } from '@nebular/theme';
import { NewPostComponent } from './new-post/new-post.component';
import { NewPostPlaceholderComponent } from './new-post-placeholder/new-post-placeholder.component';
import { LayoutComponent } from '../layout/layout.component';


@Component({
  selector: 'app-infinite-list',
  standalone: true,
  imports: [CommonModule, NbCardModule, NbListModule, NewPostComponent, NewPostPlaceholderComponent,NbLayoutModule,LayoutComponent],
  templateUrl: './infinite-list.component.html',
  styleUrl: './infinite-list.component.css'
})
export class InfiniteListComponent {
  firstCard = { news: [], placeholders: [], loading: false, pageToLoadNext: 1 };
  secondCard = { news: [], placeholders: [], loading: false, pageToLoadNext: 1 };
  pageSize = 10;

  constructor(private newsService: NewsService) {}

  loadNext(cardData: any) {
    if (cardData.loading) return;

    cardData.loading = true;
    cardData.placeholders = new Array(this.pageSize);
    this.newsService.load(cardData.pageToLoadNext, this.pageSize).subscribe(nextNews => {
      cardData.placeholders = [];
      cardData.news.push(...nextNews);
      cardData.loading = false;
      cardData.pageToLoadNext++;
    });
  }
}
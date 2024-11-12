import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';

const TOTAL_PAGES = 7;

export interface NewsPost {
  title: string;
  link: string;
  creator: string;
  text: string;
}

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  constructor(private http: HttpClient) {}

  load(page: number, pageSize: number): Observable<NewsPost[]> {
    const startIndex = ((page - 1) % TOTAL_PAGES) * pageSize;

    return this.http.get<any>('https://jsonplaceholder.typicode.com/todos/1').pipe(
      map(data => {
        // Transform the data to fit the NewsPost format
        const newsItem: NewsPost = {
          title: data.title,
          link: `https://jsonplaceholder.typicode.com/todos/${data.id}`,
          creator: 'Placeholder User',
          text: `Task ID: ${data.id}, Completed: ${data.completed}`
        };
        return Array(pageSize).fill(newsItem); // Create an array of the same item
      }),
      delay(1500),
    );
  }
}

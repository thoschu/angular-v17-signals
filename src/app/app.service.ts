import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, Observer } from 'rxjs';
import {fromPromise} from "rxjs/internal/observable/innerFrom";

export type Post = {
  id: number;
  title: string;
  views: number;
};

export type Posts = ReadonlyArray<Post>;

export type Comment = {
  id: number;
  text: string;
  postId: string;
};

export type Comments = ReadonlyArray<Comment>;

export type Profile = Readonly<Record<'email', string>>;

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private readonly http: HttpClient) {}

  public getPosts(): Observable<Posts>  {
    // fromPromise(fetch('/api/posts', { method: 'GET' }));
    const promise: Promise<Response> = fetch('/api/posts', { method: 'GET' });

    return Observable.create((observer: Observer<Posts>): void => {
      promise
        .then((res: Response) => res.json())
        .then(async (promise: Promise<Posts>): Promise<Posts> => await promise)
        .then((posts: Posts): void => observer.next(posts))
        .then((): void => observer.complete())
        .catch((err: Error): void => observer.error(err));
      }
    );
  }

  public getComments(): Observable<Comments>  {
    return this.getPayload<Comments>('/comments');
  }

  public getProfile(): Observable<Profile> {
    return this.getPayload<Profile>('/profile');
  }

  private getPayload<T>(uri: string): Observable<T> {
    return this.http.get<T>(`/api${uri}`);
  }
}

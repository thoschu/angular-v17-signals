import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {map, Observable, Observer, tap} from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';

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
    // 📌 fromPromise(fetch('/api/posts', { method: 'GET', signal: abortController.signal }));
    const abortController: AbortController = new AbortController();
    const signal: AbortSignal = abortController.signal;

    return Observable.create((observer: Observer<Posts>): () => void => {
      const promise: Promise<Response> = fetch('/api/posts', { method: 'GET', signal });

      promise
        .then((res: Response) => {
          if(res.ok) {
            return  res.json();
          } else {
            return observer.error(`Request failed with status: ${res.status}`);
          }
        })
        .then(async (promise: Promise<Posts>): Promise<Posts> => await promise)
        .then((posts: Posts): void => observer.next(posts))
        .then((): void => observer.complete())
        .catch((err: Error): void => observer.error(err)); // only network or dns error

      // unsubscribe triggers this fn
      return (): void => abortController.abort();
    });
  }

  public getComments(): Observable<Comments>  {
    return this.getPayload<Comments>('/comments');
  }

  public getProfile(): Observable<Profile> {
    return this.getPayload<Profile>('/profile');
  }

  public getError(): Observable<Profile> {
    return this.getPayload<Profile>('/error');
  }

  public getDelay(): Observable<Profile> {
    return this.getPayload<Profile>('/delay');
  }

  private getPayload<T>(uri: string): Observable<T> {
    return this.http.get<T>(`${uri}`);
  }
}

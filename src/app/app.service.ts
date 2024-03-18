import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map, Observable, Observer, Subject, tap } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';

import { toUpperOrToLowerCase } from './test.rxjs';

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

  constructor(private readonly http: HttpClient) {
    // Hot observable (like a live stream): Hot observables produce values even before a subscription is made. They are already producing values and, when a new subscriber comes along, it will only receive new values from the point of subscription forward.

    // Cold observable (like a DVD video): Cold observables start running upon subscription; that is, the observable sequence only starts pushing values to the observers when .subscribe() is called. Each subscription has its own execution context. This means that if you have multiple subscribers, each one will receive a unique set of emitted values from the start.
  }

  public getValueFromSubject(): Observable<string> {
    const subject: Subject<string> = new Subject();

    subject.next('Hello');
    subject.pipe(toUpperOrToLowerCase('upperCase')).subscribe((data: string): void => console.log(data));
    subject.next('World');

    const series$: Observable<string> = subject.asObservable().pipe(toUpperOrToLowerCase('lowerCase'));

    series$.subscribe((data: string): void => console.log(data));

    subject.next('Tom S.');

    return series$;
  }

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

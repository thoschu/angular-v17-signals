import { AsyncPipe, JsonPipe, NgForOf, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  concat, concatMap,
  filter,
  fromEvent,
  interval,
  map, merge,
  noop,
  Observable,
  of,
  shareReplay,
  Subscription,
  tap,
  timer
} from 'rxjs';
import { gt, lt } from 'ramda';

import { AppService, Comment, Comments, Post, Posts } from './app.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe, NgIf, NgForOf, JsonPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  public readonly title: string = 'angular-v17-signals';
  private readonly click$: Observable<Event> = fromEvent<Event>(document, 'click');
  private readonly _posts$: Observable<Posts> = this.appService.getPosts().pipe(shareReplay());
  protected readonly posts$: Observable<Posts> = this.appService.getPosts();
  protected readonly postsFilteredGreaterThan$: Observable<Posts> = this._posts$.pipe(
      map(
          (posts: Posts) => posts.filter((post: Post): boolean => gt<number>(post.views, 200))
      )
  );
  protected readonly postsFilteredLessThan$: Observable<Posts> = this._posts$.pipe(
      map(
          (posts: Posts) => posts.filter((post: Post): boolean => lt<number>(post.views, 300))
      )
  );
  protected readonly comments$: Observable<Comments> = this.appService.getComments()
      .pipe(
          shareReplay(),
          tap(console.log) // ❗❗❗
      );
  protected readonly commentsFilteredLess$: Observable<Comments> =
      this.comments$.pipe(map((comments: Comments) => comments.filter((comment: Comment): boolean => {
        return comment.id < 3;
      })));

  protected readonly commentsFilteredGreater$: Observable<Comments> =
      this.comments$.pipe(map((comments: Comments) => comments.filter((comment: Comment): boolean => {
        return comment.id > 2;
      })));

  constructor(private readonly appService: AppService) {
    this.commentsFilteredLess$.subscribe(noop);
    this.commentsFilteredGreater$.subscribe(noop);

    // 📌 a observable has to complete in terms of: concat operator
    const source0$: Observable<number> = interval(1000);
    const source1$: Observable<number> = of<number[]>(1, 2, 3, 4, 5);
    const source2$: Observable<string> = of<string[]>('A', 'B', 'C', 'D', 'E');
    const source3$: Observable<boolean> = of<boolean[]>(true, false, true, true, false);
    const source4$: Observable<boolean> = of();
    // 📍 https://reactivex.io/documentation/operators/concat.html
    const resultConcat$: Observable<string | number | boolean> = concat<[/*number,*/ number, string, boolean]>(/*source0$,*/ source1$, source2$, source3$);
    const subscribe: Subscription = resultConcat$.pipe(filter((val: string | number | boolean): boolean => {
      // console.log(val);
      return true ?? val === true;
    })).subscribe(console.log);

    // source0$.pipe(
    //     filter((value: number): boolean => {
    //       return value > 5;
    //     }),
    //     // 📌 combining the result of the first observable with the second observable. waiting for second observable to complete before subscribing to the next observable value from the first
    //     concatMap((value: number) => of<number>(value * 10)),
    //     // map((value: number) => of(value * 10)),
    //     map((value: number) => value * 10),
    // ).subscribe(console.log);

    // 📍 https://reactivex.io/documentation/operators/merge.html
    const resultMerge$: Observable<any> = merge(
      interval(1000).pipe(map((val: number): string => `${val}###`)),
      interval(3000).pipe(map((val: number): string => `${val}...`)),
      interval(2000).pipe(map((val: number): string => `${val}+++`))
    );
    resultMerge$.subscribe(console.log);

    // const resultConcatMap$;

    // appService.getPosts().pipe(
    //     tap(console.dir)
    // ).subscribe(
    //     console.dir,
    //     noop,
    //     (): void => console.info('complete')
    // );

    // this.appService.getProfile()
    //   .pipe(
    //     tap<Profile>(console.log),
    //   )
    //   .subscribe(noop);

    // this.appService.getComments().pipe().subscribe(
    //     console.dir,
    //     noop,
    //     (): void => console.info('complete')
    // );
  }

  public ngOnInit(): void {
    // 📍 http://callbackhell.com/
    // document.addEventListener('click', (evt: Event): void => {
    //   console.log(evt);
    //   setTimeout((): void => {
    //     let counter: number = 0;
    //
    //     setInterval((): void => {
    //       console.log(counter);
    //       counter++;
    //     }, 1000);
    //   }, 1000);
    // });

    // {
    //   const timer$: Observable<number> = timer(3000, 1000);
    //
    //   setTimeout((sub: Subscription): void => sub.unsubscribe(),7000, timer$.subscribe(
    //     (value: number): void => console.log(value),
    //     (err: Error): void => console.error(err),
    //     (): void => console.info('timer$ complete')
    //   ));
    // }
    // // ---------------------------------------------------------------------------------------
    // {
    //   const interval$: Observable<number> = interval(1000);
    //
    //   setTimeout((sub: Subscription): void => sub.unsubscribe(), 9000, interval$.pipe(
    //       tap(console.log),
    //       map((val: number ): number => val * 10),
    //       tap(console.log)
    //   ).subscribe(noop));
    // }
  }

  protected trackByPostId(index: number, post: Post): number {
    return post.id;
  }

  protected trackByCommentId(index: number, comment: Comment): number {
    return comment.id;
  }
}

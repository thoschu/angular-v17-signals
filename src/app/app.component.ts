import { AsyncPipe, JsonPipe, NgForOf, NgIf } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';
import {
  catchError, concat, concatMap, debounceTime, delay, delayWhen, distinctUntilChanged, exhaustMap, filter, finalize,
  fromEvent, interval, map, merge, mergeMap, noop, Observable, of, retryWhen, shareReplay, Subscription,
  switchMap, take, tap, throttleTime, throwError, timer
} from 'rxjs';
import { startWith, throttle } from 'rxjs/operators';
import { gt, lt } from 'ramda';

import { AppService, Comment, Comments, Post, Posts, Profile } from './app.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe, NgIf, NgForOf, JsonPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit, OnInit {
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

  @ViewChild('nameInput')
  protected readonly nameInput!: ElementRef<HTMLInputElement>;

  constructor(private readonly renderer: Renderer2, private readonly appService: AppService) {
    this.commentsFilteredLess$.subscribe(noop);
    this.commentsFilteredGreater$.subscribe(noop);

    // 📌📌📌 catchError: catches errors on the observable to be handled by returning a new observable or throwing an error.
    // 📍 https://www.learnrxjs.io/learn-rxjs/operators/error_handling/catch
    // appService.getError().subscribe(
    //     () => console.log('error'),
    //     (err: HttpErrorResponse) => console.log(err),
    //     () => console.log('complete'));
    //
    // // the catch and replace error handling strategy
    // appService.getError().pipe(
    //   tap((val: unknown) => console.log(`###${val}###`)),
    //   catchError(
    //     (errorResponse: HttpErrorResponse) =>
    //       of({ message: `# ${JSON.stringify(errorResponse.error)} #`, email: 'thoschulte@gmail.com' })
    //   )
    // ).subscribe((result: any) => console.info(result.email));
    //
    // the catch and rethrow RxJs error handling strategy and the finalize operator
    // appService.getError().pipe(
    //   catchError(
    //     (errorResponse: HttpErrorResponse) => {
    //       console.error(`Error occurred with status: ${errorResponse.status}`, errorResponse);
    //
    //       return throwError(errorResponse);
    //     }
    //   ),
    //   finalize(() => console.info('getError():finalize: complete')),
    //   tap((val: unknown) => console.log(`###${val}###`)),
    // ).subscribe((result: any) => console.info(result.email));
    //
    // retry error handling strategy
    // appService.getDelay().pipe(
    //     finalize(() => console.info('getDelay():finalize: complete')),
    //     tap((val: unknown) => console.log(val)),
    //     map((val: any) => val.payload),
    //     retryWhen((error: Observable<any>) => error.pipe(delayWhen(() => timer(2000))))
    // ).subscribe((result: any) => console.info(result.email));

    // 📌📌📌 startWith
    // 📍 https://www.learnrxjs.io/learn-rxjs/operators/combination/startwith
    // appService.getProfile()
    //     .pipe(startWith({ email: "thoschulte@googlemail.com" }))
    //     .subscribe((result: any) => console.info(result));
    //
    // this.click$.pipe(startWith(null)).subscribe(console.log);

    // 📌📌📌 switchMap: projects each source value to an observable which is merged in the output observable, emitting values only from the most recently projected observable.
    // 📍 https://rxjs.dev/api/index/function/switchMap
    // this.click$.pipe(switchMap((evt: Event) => interval(1000))).subscribe(console.log);

    // 📌 a observable has to complete in terms of: concat operator
    const source0$: Observable<number> = interval(1000);
    const source1$: Observable<number> = of<number[]>(1, 2, 3, 4, 5);
    const source2$: Observable<string> = of<string[]>('A', 'B', 'C', 'D', 'E');
    const source3$: Observable<boolean> = of<boolean[]>(true, false, true, true, false);
    const source4$: Observable<number> = of(1,1,1,1,1,1,1, 7, 1,1,1);

    // 📌📌📌 distinctUntilChanged: returns a result observable that emits all values pushed by the source observable if they are distinct in comparison to the last value the result observable emitted.
    // 📍 https://rxjs.dev/api/operators/distinctUntilChanged
    // source4$.pipe(distinctUntilChanged()).subscribe(console.log);

    // 📍 https://reactivex.io/documentation/operators/concat.html
    const resultConcat$: Observable<string | number | boolean> = concat<[/*number,*/ number, string, boolean]>(/*source0$,*/ source1$, source2$, source3$);
    // const subscribe: Subscription = resultConcat$.pipe(filter((val: string | number | boolean): boolean => {
    //   // console.log(val);
    //   return true ?? val === true;
    // })).subscribe(console.log);

    // 📌📌📌 mergeMap: works not sequentially, it doesn't wait that the previous observable has completed like concatMap
    // 📍 https://rxjs.dev/api/operators/mergeMap
    // source0$.pipe(
    //     mergeMap((value: number) => of(value).pipe(delay<number>(Math.random() * (7000 - 700) + 700))),
    //     map((value: number): string => `${value}`)
    // ).subscribe(console.log);

    // 📌📌📌 concatMap: works sequentially, combining the result of the first observable with the second observable. waiting for second observable to complete before subscribing to the next observable value from the first
    // 📍 https://rxjs.dev/api/operators/concatMap
    // source0$.pipe(
    //     filter((value: number): boolean => {
    //       return value > 5;
    //     }),
    //     concatMap((value: number) => of<number>(value * 10)),
    //     // map((value: number) => of(value * 10)),
    //     map((value: number) => value * 10),
    // ).subscribe(console.log);

    // 📍 https://reactivex.io/documentation/operators/merge.html
    // const resultMerge$: Observable<any> = merge(
    //   interval(1000).pipe(map((val: number): string => `${val}###`)),
    //   interval(3000).pipe(map((val: number): string => `${val}...`)),
    //   interval(2000).pipe(map((val: number): string => `${val}+++`))
    // );
    // resultMerge$.subscribe(console.log);

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
    //     tap<Profile>((profile: Profile) => console.info(profile)),
    //     finalize(() => console.info('getProfile():finalize: complete'))
    //   )
    //   .subscribe(noop);

    // this.appService.getComments().pipe().subscribe(
    //     console.dir,
    //     noop,
    //     (): void => console.info('complete')
    // );

    // 📌📌📌 exhaustMap: ignores new 'input' (from the outer), until the inner observable completed
    // 📍 https://rxjs.dev/api/operators/exhaustMap
    // const result$: Observable<number> = this.click$.pipe(
    //     exhaustMap((evt: Event) => interval(1000).pipe(take(5)))
    // );
    // result$.subscribe(console.log);
    //
    // interval(1000).pipe(
    //     exhaustMap((value: number) => interval(1000).pipe(take(5), map((val: number): string => `${val}---${value}`)))
    // ).subscribe(console.log);
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

  public ngAfterViewInit(): void {
    const inputElement: HTMLInputElement = this.nameInput.nativeElement;
    this.renderer.setStyle(inputElement, 'background', 'yellow');

    const input$: Observable<KeyboardEvent> = fromEvent<KeyboardEvent>(inputElement, 'keyup');
    // 📌📌📌 distinctUntilChanged
    // 📍 https://www.learnrxjs.io/learn-rxjs/operators/filtering/distinctuntilchanged
    // 📌📌📌 debounceTime
    // 📍 https://www.learnrxjs.io/learn-rxjs/operators/filtering/debouncetime
    input$.pipe(
      map((evt: KeyboardEvent) => evt.target),
      map((target: EventTarget | null) => target as HTMLInputElement),
      map((element: HTMLInputElement) => element.value),
      distinctUntilChanged(),
      debounceTime(1000),
    ).subscribe(console.log);

    // 📌📌📌 throttleTime and throttle
    // 📍 https://www.learnrxjs.io/learn-rxjs/operators/filtering/throttletime
    // input$.pipe(
    //     map((evt: KeyboardEvent) => evt.target),
    //     map((target: EventTarget | null) => target as HTMLInputElement),
    //     map((element: HTMLInputElement) => element.value),
    //     throttleTime(2000)
    // ).subscribe(console.log);
    // 📍 https://www.learnrxjs.io/learn-rxjs/operators/filtering/throttle
    input$.pipe(
      map((evt: KeyboardEvent) => evt.target),
      map((target: EventTarget | null) => target as HTMLInputElement),
      map((element: HTMLInputElement) => element.value),
      throttle(() => interval(1000))
    ).subscribe(console.log);
  }

  protected trackByPostId(index: number, post: Post): number {
    return post.id;
  }

  protected trackByCommentId(index: number, comment: Comment): number {
    return comment.id;
  }
}

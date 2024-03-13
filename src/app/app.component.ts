import {AsyncPipe, JsonPipe, NgForOf, NgIf} from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { fromEvent, interval, map, noop, Observable, Subscription, tap, timer } from 'rxjs';

import {AppService, Post, /*Comments, Posts, Profile*/} from './app.service';

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
  protected readonly posts$:  Observable<any> = this.appService.getPosts();
  protected readonly comments$: Observable<any> = this.appService.getComments();

  constructor(private readonly appService: AppService) {
    appService.getPosts().pipe(
        tap(console.dir)
    ).subscribe(
        console.dir,
        noop,
        (): void => console.info('complete')
    );

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
    // http://callbackhell.com/
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

  protected trackById(index: number, post: Post) { // 👈
    return post.id;
  }
}

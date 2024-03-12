import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { fromEvent, interval, noop, Observable, Subscription, timer } from 'rxjs';

import { AppService, Posts } from './app.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  public title: string = 'angular-v17-signals';

  constructor(private readonly appService: AppService) {
    appService.getPosts().subscribe(
        (value: Posts): void => console.dir(value),
        noop,
        (): void => console.info('complete')
    );
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

    const click$: Observable<Event> = fromEvent<Event>(document, 'click');
    const interval$: Observable<number> = interval(1000);
    const timer$: Observable<number> = timer(3000, 1000);

    const sub: Subscription = timer$.subscribe(
        (value: number): void => console.log(value),
        (err: Error): void => console.error(err),
        (): void => console.info('complete')
    );

    setTimeout((): void => sub.unsubscribe(), 7000);
  }
}

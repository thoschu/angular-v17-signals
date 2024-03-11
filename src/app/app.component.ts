import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AppService } from './app.service';

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
    appService.getProfile().subscribe((data: Object): void => {
        console.log(data);
    });
  }

  public ngOnInit(): void {
    // http://callbackhell.com/
    document.addEventListener('click', (evt: Event): void => {
      console.log(evt);
      // setTimeout((): void => {
      //   let counter: number = 0;
      //
      //   setInterval((): void => {
      //     console.log(counter);
      //     counter++;
      //   }, 1000);
      // }, 1000);
    })
  }
}

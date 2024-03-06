import {ChangeDetectionStrategy, Component, computed, Signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { FooComponent } from './foo/foo.component';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FooComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.Default
})
export class AppComponent {
  public readonly title: string = 'angular-v17-signals';
  protected readonly message: string[] = [];
  protected readonly derivedCounter: Signal<number> = computed<number>((): number => {
    return this.appService.counter() * 2;
  });

  constructor(protected readonly appService: AppService) {}

  protected increment(): void {
    this.appService.incrementCounter();
    this.message.push(this.appService.counter().toString());
  }
}

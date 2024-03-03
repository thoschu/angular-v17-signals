import {ChangeDetectionStrategy, Component, signal, WritableSignal} from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  public title: string = 'angular-v17-signals';
  protected counter: WritableSignal<number> = signal<number>(0);

  protected increment(): void {
    // this.counter++;
    this.counter.set(this.counter() + 1);
  }
}

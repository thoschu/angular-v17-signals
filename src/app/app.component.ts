import {ChangeDetectionStrategy, Component, signal, WritableSignal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {FooComponent} from "./foo/foo.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FooComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.Default
})
export class AppComponent {
  public title: string = 'angular-v17-signals';
  protected counter: WritableSignal<number> = signal<number>(0);
  protected message: string[] = [];

  protected increment(): void {
    // this.counter++;
    const val: number = this.counter() + 1;
    this.message.push(val.toString());
    this.counter.set(val);
  }
}

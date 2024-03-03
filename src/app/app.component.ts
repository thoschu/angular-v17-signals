import {ChangeDetectionStrategy, Component, computed, Signal, signal, WritableSignal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {FooComponent} from "./foo/foo.component";
import {JsonPipe} from "@angular/common";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FooComponent, JsonPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  public title: string = 'angular-v17-signals';
  protected counter: WritableSignal<number> = signal<number>(0);
  protected towns: WritableSignal<string[]> =  signal<string[]>(['London', 'Paris', 'New York', 'Berlin', 'Madrid']);
  protected town = signal<Record<'name', string>>({
    name: 'London'
  });
  protected message: string[] = [];
  protected derivedCounter: Signal<number> = computed<number>(() => {
    return this.counter() * 10;
  });

  constructor() {
    const readonlyCounter: Signal<number> = this.counter.asReadonly();
    // readonlyCounter.
  }

  protected increment(): void {
    // this.counter++;
    // const val: number = this.counter() + 1;
    // this.message.push(val.toString());
    // this.counter.set(val);

    this.counter.update((val: number): number => {
      const newValue: number = val + 1;

      this.message.push(newValue.toString());

      return newValue;
    });


    // Antipattern !!!!
    // Angular has no way to know to value has been mutated
    // Works with default changeDetection
    // Solution: Use set- oder update- fn
    /*
    this.town().name = 'Bielefeld';
    this.towns()[1] = 'Bielefeld';
    */

    // Better
    // Signal ist able to inform interests about changes
    this.town.set({name: 'Berlin'});
    this.towns.update((towns: string[]) => {
      const newTowns: string[] = [...towns];

      newTowns[1] = 'Berlin';

      return newTowns;
    });
  }
}

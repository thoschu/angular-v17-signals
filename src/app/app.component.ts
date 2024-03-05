import { JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  EffectRef,
  Signal,
  signal,
  WritableSignal
} from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { FooComponent } from './foo/foo.component';

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
  protected multiplier: number = 0;
  protected counter: WritableSignal<number> = signal<number>(0);
  protected towns: WritableSignal<string[]> = signal<string[]>(['London', 'Paris', 'New York', 'Berlin', 'Madrid']);
  protected town:  WritableSignal<Record<'name', string>> = signal<Record<'name', string>>({
    name: 'London'
  });
  protected message: string[] = [];
  protected derivedCounter: Signal<number> = computed<number>((): number => {
    // Dependencies between signal and computed
    const res: number = this.counter() * 10;

    if(this.multiplier >= 10) {
      // const res: number = this.counter() * 10;
      return res;
    } else {
      return 0;
    }
  });

  constructor() {
    const readonlyCounter: Signal<number> = this.counter.asReadonly();
    // readonlyCounter.

    // https://angular.io/guide/signals#effects
    const effRef: EffectRef = effect(() => {
      // Dependencies between signals and effect
      const counterValue: number = this.counter();
      const derivedCounterValue: number = this.derivedCounter();

      console.log('counter:', counterValue);
      console.log('derivedCounter:', derivedCounterValue);

      localStorage.setItem('counter signal', counterValue.toString());
      localStorage.setItem('derived counter signal', derivedCounterValue.toString());

      // ❗❗❗ Error: NG0600: Writing to signals is not allowed in a `computed` or an `effect` by default.
      // Use `allowSignalWrites` in the `CreateEffectOptions` to enable this inside effects.
      // this.counter.set(77);

      return null;
    }, { allowSignalWrites: false });
  }

  protected incrementMultiplier(): void {
    this.multiplier++;
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
    this.town().name = 'Bielefeld';
    this.towns()[1] = 'Bielefeld';


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

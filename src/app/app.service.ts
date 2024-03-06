import { Injectable, Signal, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private static readonly ZERO: number = 0;
  private readonly counterSignal: WritableSignal<number> = signal<number>(AppService.ZERO);
  public readonly counter: Signal<number> = this.counterSignal.asReadonly();

  constructor() { }

  public incrementCounter(): void {
    this.counterSignal.update((val: number) => val + 1);
  }

  public resetCounter(): void {
    this.counterSignal.set(AppService.ZERO);
  }
}

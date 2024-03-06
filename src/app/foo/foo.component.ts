import { ChangeDetectionStrategy, Component, computed, input, Input, InputSignal, Signal } from '@angular/core';

import { AppService } from '../app.service';

@Component({
  selector: 'app-foo',
  standalone: true,
  imports: [],
  templateUrl: './foo.component.html',
  styleUrl: './foo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooComponent {
  // @Input({required: true})
  // public message: string[] = [];
  public message: InputSignal<string[]> = input<string[]>([]);
  protected readonly derivedMessage: Signal<number>;

  constructor(protected readonly appService: AppService) {
    this.derivedMessage = computed((): number => {
      const messageList: string[] = this.message();

      return messageList.length * appService.counter();
    });
  }

  protected reset(): void {
    this.appService.resetCounter();
  }
}

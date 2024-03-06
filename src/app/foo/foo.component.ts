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
  public readonly message: InputSignal<string[] | undefined> = input<string[]>();
  protected readonly derivedMessage: Signal<number>;

  constructor(protected readonly appService: AppService) {
    this.derivedMessage = computed((): number => {
      const messageList: string[] | undefined = this.message();

      if (messageList) {
        return messageList.length * appService.counter();
      }

      return 0;
    });
  }

  protected reset(): void {
    this.appService.resetCounter();
  }
}

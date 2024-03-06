import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  Input,
  InputSignal,
  InputSignalWithTransform,
  Signal
} from '@angular/core';

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
  // public message: InputSignal<string[]> = input<string[]>([]);
  // public message: InputSignal<string[]> = input<string[]>([], {alias: 'messageAlias'});
  public message: InputSignal<string[]> = input.required<string[]>({
    alias: 'messageAlias'
  });
  protected readonly derivedMessage: Signal<number>;
  public readonly disabled: InputSignalWithTransform<boolean, string | boolean> = input<boolean, string | boolean>(true, {
    alias: 'resetDisabled',
    transform: (value: boolean | string): boolean => (typeof value === 'string') ? (value === '') : value
  });

  constructor(protected readonly appService: AppService) {
    this.derivedMessage = computed((): number => {
      const messageList: string[] = this.message();
      const counterValue: number = appService.counter();

      return messageList.length * counterValue;
    });
  }

  protected reset(): void {
    this.appService.resetCounter();
  }
}

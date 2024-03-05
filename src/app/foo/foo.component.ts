import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  selector: 'app-foo',
  standalone: true,
  imports: [],
  templateUrl: './foo.component.html',
  styleUrl: './foo.component.scss',
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooComponent {
  @Input({required: true})
  message: string[] = [];
}

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

import { PdfComponent } from './pdf/pdf.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PdfComponent, MatProgressSpinner],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  public title: string = 'angular-v17-signals';
  protected doPrefetch: boolean = false;
  protected doContent: boolean = false;

  constructor() {
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback?retiredLocale=de
    window.requestIdleCallback((deadline: IdleDeadline): unknown => {
      while ((deadline.timeRemaining() > 0 || deadline.didTimeout)) {
        // console.dir(deadline);
      }
      return deadline;
    }, { timeout: 3000 });
  }

  public performPrefetch(): void {
    this.doPrefetch = true;
  }

  public performContent(): void {
    this.doContent = true;
  }
}

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
}

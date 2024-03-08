import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-pdf',
  standalone: true,
  imports: [
    MatExpansionModule
  ],
  templateUrl: './pdf.component.html',
  styleUrl: './pdf.component.scss'
})
export class PdfComponent {
  constructor() {
    const controller: AbortController = new AbortController();
    const signal: AbortSignal = controller.signal;

    console.log(signal);
  }
}

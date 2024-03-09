import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-pdf',
  standalone: true,
  imports: [
    NgOptimizedImage,
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
    // https://pdfmake.github.io/docs/0.3/getting-started/client-side/
  }
}

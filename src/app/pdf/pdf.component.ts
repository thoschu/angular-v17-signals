import { NgOptimizedImage } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';

import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

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
export class PdfComponent implements OnInit {
  protected readonly imageSrc: string = 'https://www.thomas-schulte.de/pics/es6-module.png';

  constructor() {
    const controller: AbortController = new AbortController();
    const signal: AbortSignal = controller.signal;

    console.log(signal);
  }

  public async ngOnInit(): Promise<void> {
    const pdfDoc: PDFDocument = await PDFDocument.create();

    console.dir(pdfDoc);
  }
}

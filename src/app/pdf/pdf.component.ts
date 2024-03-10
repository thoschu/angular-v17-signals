import { NgOptimizedImage } from '@angular/common';
import { Component, OnInit, ElementRef } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';

import html2canvas from 'html2canvas';
import { PDFDocument, StandardFonts, rgb, PDFImage, PDFPage } from 'pdf-lib'

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
  private link?: HTMLAnchorElement;
  protected readonly imageSrc: string = 'https://www.thomas-schulte.de/pics/es6-module.png';
  protected readonly items: Record<'name' | 'type', unknown>[] = [
    {
      name: 'Item 1',
      type: 'odd',
    }, {
      name: 'Item 2',
      type: 'even',
    }, {
      name: 'Item 3',
      type: 'odd',
    }, {
      name: 'Item 4',
      type: 'even',
    }
  ];

  constructor(private readonly hostElementRef: ElementRef) {
    const controller: AbortController = new AbortController();
    const signal: AbortSignal = controller.signal;

    // console.log(signal);
  }

  public async ngOnInit(): Promise<void> {
    const pdfDoc: PDFDocument = await PDFDocument.create();

    html2canvas(this.hostElementRef.nativeElement).then(async (canvas: HTMLCanvasElement): Promise<void> => {
      const jpgImage: PDFImage = await pdfDoc.embedJpg(canvas.toDataURL('image/jpeg'));
      const page: PDFPage = pdfDoc.addPage();

      page.drawImage(jpgImage);

      const pdfBytes: Uint8Array = await pdfDoc.save();
      const blob: Blob = new Blob([pdfBytes], {type: 'application/pdf'});
      this.link = document.createElement('a');

      this.link.href = window.URL.createObjectURL(blob);
      this.link.download = "myFileName.pdf";
      // this.link.click();
    });
  }

  protected downloadPdf(): void {
    this.link?.click();
  }
}

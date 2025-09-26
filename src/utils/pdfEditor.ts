import { Color, PDFDocument, PDFFont, rgb, StandardFonts } from 'pdf-lib';

export interface PDFInsertData {
  x: number;
  y: number;
  size: number;
  text: string;
  font?: PDFFont;
  color?: Color;
}

export interface PDFDrawRectangle {
  x: number;
  y: number;
  width: number;
  height: number;
  color: Color;
}

export async function modifyPdf(
  inputPdf: ArrayBuffer,
  data: PDFInsertData[],
  draw?: PDFDrawRectangle[]
): Promise<ArrayBuffer> {
  const pdfDoc = await PDFDocument.load(inputPdf);
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const { height } = firstPage.getSize();

  draw?.forEach((item) => {
    firstPage.drawRectangle({
      x: item.x,
      y: height - item.y - item.height,
      width: item.width,
      height: item.height,
      color: item.color,
    });
  });

  data.forEach((item) => {
    firstPage.drawText(item.text, {
      x: item.x,
      y: height - item.y,
      size: item.size,
      font: item.font || helveticaFont,
      color: item.color || rgb(0, 0, 0),
    });
  });

  const pdfBytes = await pdfDoc.save();
  return new Uint8Array(pdfBytes).buffer;
}

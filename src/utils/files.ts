/* eslint-disable no-console */
import { saveAs } from 'file-saver';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

export const downloadFile = async (file: Blob, fileName: string) => {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(file);
  link.download = fileName;
  link.click();
};

export const loadFile = async (url: string) => {
  try {
    if (import.meta.env.DEV) {
      console.log('Loading file:', url);
    }
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Network response was not ok ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    return arrayBuffer;
  } catch (error) {
    console.error('Error loading file:', error);
    throw error;
  }
};

export const generateDocument = async (
  url: string,
  data: { [key: string]: string | number },
  fileName: string
) => {
  const content = await loadFile(url);
  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });
  doc.setData(data);

  try {
    doc.render();
  } catch (error) {
    if (import.meta.env.DEV) {
      console.log(JSON.stringify({ error }));
    }
    throw error;
  }

  const out = doc.getZip().generate({
    type: 'blob',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });

  saveAs(out, fileName);
};

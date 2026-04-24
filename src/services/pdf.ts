import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export async function exportarPDF() {
  const elemento = document.getElementById("grade");

  if (!elemento) {
    alert("Elemento da grade não encontrado.");
    return;
  }

  const canvas = await html2canvas(elemento, {
    scale: 2,
    useCORS: true,
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("landscape", "mm", "a4");

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let finalWidth = imgWidth;
  let finalHeight = imgHeight;

  if (finalHeight > pageHeight) {
    finalHeight = pageHeight - 10;
    finalWidth = (canvas.width * finalHeight) / canvas.height;
  }

  pdf.addImage(imgData, "PNG", 5, 5, finalWidth - 10, finalHeight);
  pdf.save("grade-professores.pdf");
}
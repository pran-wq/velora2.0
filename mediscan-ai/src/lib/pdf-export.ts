import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function exportReportAsPDF(elementId: string, filename: string = 'MediScan_AI_Report.pdf') {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error('Target printable layout identifier not found.');
      return;
    }

    // Capture canvas
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#09090E'
    });

    const imgData = canvas.toDataURL('image/png');
    
    // Setup jsPDF document
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgWidth = 210; // A4 size width
    const pageHeight = 295; // A4 size height
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(filename);
  } catch (error) {
    console.error('PDF creation exception:', error);
  }
}

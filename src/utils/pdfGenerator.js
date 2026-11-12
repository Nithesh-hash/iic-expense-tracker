import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { convertAmountToWords, formatINR } from './numberToWords';

/**
 * Generates an official, highly styled PDF Reinvestment Report
 * for selected IIC records using jsPDF and jspdf-autotable.
 *
 * @param {Array} selectedRecords - Array of selected expense objects
 * @param {Object} options - Optional metadata (generatedBy, customTitle, etc.)
 */
export function generateReinvestmentPDF(selectedRecords, options = {}) {
  if (!selectedRecords || selectedRecords.length === 0) {
    throw new Error('No records selected for export.');
  }

  // Create PDF document in Landscape for tabular clarity
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const generatedAt = new Date().toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'medium',
  });
  const reportRef = `IIC-REP-${Date.now().toString().slice(-6)}`;
  const generatedBy = options.generatedBy || 'IIC-VIT Administrator';

  // Calculate totals
  const totalAmount = selectedRecords.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const totalInWords = convertAmountToWords(totalAmount);

  // 1. INSTITUTIONAL HEADER & LOGO BARS
  // Top primary banner
  doc.setFillColor(15, 30, 65); // Dark Navy Blue
  doc.rect(0, 0, pageWidth, 24, 'F');

  // Accent gold line
  doc.setFillColor(217, 119, 6); // Amber / Gold accent
  doc.rect(0, 24, pageWidth, 2, 'F');

  // Organization Header Text
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text("INSTITUTION'S INNOVATION COUNCIL (IIC) — VIT", 14, 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225); // Slate 300
  doc.text("Ministry of Education (MoE) Initiative | Vellore Institute of Technology, Vellore - 632014", 14, 18);

  // Confidentiality Badge on Right
  doc.setFillColor(220, 38, 38); // Crimson Red badge
  doc.roundedRect(pageWidth - 75, 6, 61, 12, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text("CONFIDENTIAL REPORT", pageWidth - 44.5, 11, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.text("INTERNAL AUDIT & REINVESTMENT", pageWidth - 44.5, 15.5, { align: 'center' });

  // 2. DOCUMENT SUBTITLE & METADATA GRID
  doc.setTextColor(15, 23, 42); // Slate 900
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text("IIC Expense Tracker - Confidential Reinvestment Report", 14, 34);

  // Metadata block (Light grey background)
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 38, pageWidth - 28, 16, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, 38, pageWidth - 28, 16, 2, 2, 'S');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);

  // Col 1: Report Ref
  doc.text("Report Reference:", 18, 44);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(reportRef, 46, 44);

  // Col 2: Date
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text("Generated On:", 88, 44);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(generatedAt, 110, 44);

  // Col 3: Records Count
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text("Total Records:", 170, 44);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(`${selectedRecords.length} Items`, 192, 44);

  // Row 2 of metadata
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text("Authorized Admin:", 18, 50);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(generatedBy, 46, 50);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text("Total Disbursed:", 88, 50);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 185, 129); // Emerald
  doc.text(formatINR(totalAmount), 110, 50);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text("Fiscal Period:", 170, 50);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text("AY 2025-2026", 192, 50);

  // 3. TABLE DATA FORMATTING
  const tableRows = selectedRecords.map((item, index) => [
    index + 1,
    item.reinvestmentNumber || `IIC-REV-${index + 1}`,
    item.eventDate || '-',
    item.facultyName || '-',
    item.resourcePerson || '-',
    item.eventTitle || '-',
    item.category || '-',
    `INR ${Number(item.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
  ]);

  // Render Table using autoTable
  autoTable(doc, {
    startY: 58,
    margin: { left: 14, right: 14 },
    head: [
      [
        '#',
        'Reinvestment No.',
        'Date',
        'Faculty Coordinator',
        'Resource Person',
        'Event Title',
        'Category',
        'Amount (INR)',
      ],
    ],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [30, 41, 59], // Slate 800
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
      halign: 'left',
      cellPadding: 3,
    },
    styles: {
      fontSize: 7.5,
      textColor: [30, 41, 59],
      cellPadding: 2.5,
      lineColor: [226, 232, 240],
      lineWidth: 0.2,
      overflow: 'linebreak',
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 32, fontStyle: 'bold' },
      2: { cellWidth: 20 },
      3: { cellWidth: 34 },
      4: { cellWidth: 42 },
      5: { cellWidth: 58 },
      6: { cellWidth: 40 },
      7: { cellWidth: 28, halign: 'right', fontStyle: 'bold' },
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
  });

  // 4. SUMMARY FOOTER & AMOUNT IN WORDS
  const finalY = doc.lastAutoTable.finalY + 6;

  // Check if we need to add a new page if near the bottom
  let summaryY = finalY;
  if (summaryY > pageHeight - 55) {
    doc.addPage();
    summaryY = 20;
  }

  // Summary Container
  const summaryBoxWidth = pageWidth - 28;
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(14, summaryY, summaryBoxWidth, 26, 2, 2, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, summaryY, summaryBoxWidth, 26, 2, 2, 'S');

  // Total in numbers
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.text("TOTAL REINVESTMENT AMOUNT (INR):", 20, summaryY + 8);

  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(formatINR(totalAmount), pageWidth - 20, summaryY + 8, { align: 'right' });

  // Divider line inside summary
  doc.setDrawColor(226, 232, 240);
  doc.line(20, summaryY + 12, pageWidth - 20, summaryY + 12);

  // Total in words
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text("Amount in Words:", 20, summaryY + 18);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  // Wrap text if needed
  const splitWords = doc.splitTextToSize(totalInWords, summaryBoxWidth - 65);
  doc.text(splitWords, 48, summaryY + 18);

  // 5. SIGNATURE & VERIFICATION BLOCK
  let signY = summaryY + 34;
  if (signY > pageHeight - 25) {
    doc.addPage();
    signY = 25;
  }

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);

  // 3 Signature Columns
  const colWidth = (pageWidth - 28) / 3;

  // Sig 1
  doc.line(18, signY + 10, 18 + colWidth - 20, signY + 10);
  doc.setFont('helvetica', 'bold');
  doc.text("Prepared & Checked By", 18, signY + 14);
  doc.setFont('helvetica', 'normal');
  doc.text("IIC Finance Executive / Secretary", 18, signY + 18);

  // Sig 2
  doc.line(18 + colWidth, signY + 10, 18 + (colWidth * 2) - 20, signY + 10);
  doc.setFont('helvetica', 'bold');
  doc.text("Verified By", 18 + colWidth, signY + 14);
  doc.setFont('helvetica', 'normal');
  doc.text("IIC Convener / Faculty In-Charge", 18 + colWidth, signY + 18);

  // Sig 3
  doc.line(18 + (colWidth * 2), signY + 10, 18 + (colWidth * 3) - 20, signY + 10);
  doc.setFont('helvetica', 'bold');
  doc.text("Approved & Authorized By", 18 + (colWidth * 2), signY + 14);
  doc.setFont('helvetica', 'normal');
  doc.text("President, IIC — VIT Vellore", 18 + (colWidth * 2), signY + 18);

  // Page numbering and footer confidentiality watermark on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);

    doc.text(
      "Institution's Innovation Council (IIC-VIT) - Strictly Confidential Internal Document",
      14,
      pageHeight - 6
    );
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth - 14,
      pageHeight - 6,
      { align: 'right' }
    );
  }

  // Save the PDF
  const filename = `IIC_Reinvestment_Report_${new Date().toISOString().slice(0, 10)}_${reportRef}.pdf`;
  doc.save(filename);
  return filename;
}


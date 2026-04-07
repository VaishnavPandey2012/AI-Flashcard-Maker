import jsPDF from 'jspdf';
import type { Deck } from '../types/flashcard';

export async function exportDeckAsPDF(deck: Deck): Promise<void> {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  // Title page
  pdf.setFillColor(15, 10, 30);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');

  pdf.setTextColor(124, 58, 237);
  pdf.setFontSize(28);
  pdf.setFont('helvetica', 'bold');
  pdf.text(deck.title, pageWidth / 2, 80, { align: 'center' });

  pdf.setTextColor(200, 180, 255);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'normal');
  pdf.text(deck.description, pageWidth / 2, 100, { align: 'center', maxWidth: contentWidth });

  pdf.setTextColor(150, 130, 200);
  pdf.setFontSize(11);
  pdf.text(`${deck.cards.length} flashcards`, pageWidth / 2, 120, { align: 'center' });
  pdf.text(`Created: ${new Date(deck.createdAt).toLocaleDateString()}`, pageWidth / 2, 130, { align: 'center' });

  pdf.addPage();

  let y = margin;
  const lineHeight = 7;
  const cardSpacing = 15;

  deck.cards.forEach((card, index) => {
    const questionLines = pdf.splitTextToSize(`Q: ${card.question}`, contentWidth - 10);
    const answerLines = pdf.splitTextToSize(`A: ${card.answer}`, contentWidth - 10);
    const cardHeight = (questionLines.length + answerLines.length) * lineHeight + 20;

    if (y + cardHeight > pageHeight - margin) {
      pdf.addPage();
      y = margin;
    }

    // Card background
    pdf.setFillColor(30, 20, 60);
    pdf.roundedRect(margin, y, contentWidth, cardHeight, 4, 4, 'F');

    // Card number
    pdf.setTextColor(124, 58, 237);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`#${index + 1} · ${card.type.toUpperCase()} · ${card.difficulty.toUpperCase()}`, margin + 5, y + 8);

    // Tags
    if (card.tags.length > 0) {
      pdf.setTextColor(6, 182, 212);
      pdf.text(card.tags.slice(0, 3).join(' · '), margin + contentWidth - 5, y + 8, { align: 'right' });
    }

    pdf.setDrawColor(124, 58, 237);
    pdf.line(margin + 5, y + 11, margin + contentWidth - 5, y + 11);

    // Question
    pdf.setTextColor(230, 220, 255);
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    let textY = y + 18;
    questionLines.forEach((line: string) => {
      pdf.text(line, margin + 5, textY);
      textY += lineHeight;
    });

    textY += 2;

    // Answer
    pdf.setTextColor(180, 160, 240);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    answerLines.forEach((line: string) => {
      pdf.text(line, margin + 5, textY);
      textY += lineHeight;
    });

    y += cardHeight + cardSpacing;
  });

  pdf.save(`${deck.title.replace(/\s+/g, '_')}_flashcards.pdf`);
}

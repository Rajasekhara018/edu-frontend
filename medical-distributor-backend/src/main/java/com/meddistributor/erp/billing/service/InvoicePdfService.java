package com.meddistributor.erp.billing.service;

import com.meddistributor.erp.billing.entity.Invoice;
import com.meddistributor.erp.billing.entity.InvoiceLine;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.stereotype.Service;

@Service
public class InvoicePdfService {
  public byte[] generate(Invoice invoice, List<InvoiceLine> lines) {
    try (PDDocument document = new PDDocument()) {
      PDPage page = new PDPage(PDRectangle.A4);
      document.addPage(page);

      try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
        contentStream.beginText();
        contentStream.setFont(PDType1Font.HELVETICA_BOLD, 14);
        contentStream.newLineAtOffset(40, 800);
        contentStream.showText("Invoice " + invoice.getInvoiceNo());
        contentStream.endText();

        contentStream.beginText();
        contentStream.setFont(PDType1Font.HELVETICA, 10);
        contentStream.newLineAtOffset(40, 780);
        contentStream.showText("Customer: " + invoice.getCustomer().getName());
        contentStream.endText();

        float y = 750;
        contentStream.setFont(PDType1Font.HELVETICA, 9);
        for (InvoiceLine line : lines) {
          contentStream.beginText();
          contentStream.newLineAtOffset(40, y);
          contentStream.showText(line.getProduct().getName() + " | Batch: " + line.getBatch().getBatchNo()
              + " | Qty: " + line.getQuantity() + " | Net: " + line.getNetAmount());
          contentStream.endText();
          y -= 14;
          if (y < 80) {
            break;
          }
        }

        contentStream.beginText();
        contentStream.setFont(PDType1Font.HELVETICA_BOLD, 11);
        contentStream.newLineAtOffset(40, 60);
        contentStream.showText("Total: " + invoice.getNetTotal());
        contentStream.endText();
      }

      ByteArrayOutputStream out = new ByteArrayOutputStream();
      document.save(out);
      return out.toByteArray();
    } catch (IOException ex) {
      throw new IllegalStateException("Failed to generate PDF", ex);
    }
  }
}

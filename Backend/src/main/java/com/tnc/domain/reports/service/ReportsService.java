package com.tnc.domain.reports.service;

import com.tnc.domain.reports.dto.ReportRequestDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReportsService {

    private final PdfExportService pdfExportService;
    private final ExcelExportService excelExportService;

    /**
     * Generate report in specified format
     */
    public byte[] generateReport(ReportRequestDTO request) throws IOException {
        log.info("Generating {} report in {} format", request.getReportType(), request.getFormat());

        if ("EXCEL".equalsIgnoreCase(request.getFormat())) {
            return excelExportService.generateExcelReport();
        } else if ("PDF".equalsIgnoreCase(request.getFormat())) {
            return pdfExportService.generatePdfReport();
        }

        throw new IllegalArgumentException("Unsupported format: " + request.getFormat());
    }
}

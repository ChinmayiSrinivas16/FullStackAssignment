package com.tnc.domain.reports.controller;

import com.tnc.domain.reports.dto.ReportRequestDTO;
import com.tnc.domain.reports.service.ReportsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
@Tag(name = "Reports", description = "Report generation and export endpoints")
public class ReportsController {

    private final ReportsService reportsService;

    @PostMapping("/generate")
    @Operation(summary = "Generate and download portfolio report")
    public ResponseEntity<?> generateReport(@RequestBody ReportRequestDTO request) throws IOException {
        byte[] reportData = reportsService.generateReport(request);

        String filename;
        MediaType mediaType;

        if ("EXCEL".equalsIgnoreCase(request.getFormat())) {
            filename = "portfolio-report.xlsx";
            mediaType = MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        } else if ("PDF".equalsIgnoreCase(request.getFormat())) {
            filename = "portfolio-report.pdf";
            mediaType = MediaType.APPLICATION_PDF;
        } else {
            return ResponseEntity.badRequest().body("Unsupported format");
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(mediaType)
                .body(reportData);
    }
}

package com.tnc.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/reports")
@CrossOrigin(
    origins = {"http://stockfolio.duckdns.org", "https://stockfolio.duckdns.org", "http://localhost"}
)
public class ReportsController {

    @Autowired
    private com.tnc.service.ReportsService reportsService;

    @PostMapping("/generate")
    public ResponseEntity<?> generateReport(@RequestBody Map<String, Object> request, Authentication authentication) {
        String username = authentication.getName();
        
        String reportType = (String) request.get("type");
        String period = (String) request.get("period");
        String format = (String) request.get("format");
        
        // Default values
        if (reportType == null || reportType.isEmpty()) {
            reportType = "performance";
        }
        if (period == null || period.isEmpty()) {
            period = "monthly";
        }
        if (format == null || format.isEmpty()) {
            format = "pdf";
        }
        
        try {
            // Generate the report and get the file path
            String filePath = reportsService.generateReport(username, reportType, period, format);
            
            // Extract report ID from filename (format: [uuid]_[type]_[period].[ext])
            String fileName = new File(filePath).getName();
            String reportId = extractReportId(fileName);
            
            Map<String, Object> data = new HashMap<>();
            data.put("reportId", reportId);
            data.put("filePath", filePath);
            data.put("fileName", fileName);
            data.put("status", "completed");
            data.put("createdAt", java.time.Instant.now().toString());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Report generated successfully");
            response.put("data", data);
            response.put("timestamp", System.currentTimeMillis());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to generate report: " + e.getMessage());
            response.put("timestamp", System.currentTimeMillis());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    private String extractReportId(String fileName) {
        // Filename format: [uuid]_[type]_[period].[ext]
        // Example: a1b2c3d4_performance_monthly.pdf
        String baseName = fileName.substring(0, fileName.lastIndexOf('.')); // Remove extension
        String[] parts = baseName.split("_");
        if (parts.length >= 1) {
            return "rpt_" + parts[0]; // rpt_[uuid] - use parts[0] to get the UUID
        }
        return "rpt_" + UUID.randomUUID().toString().substring(0, 8);
    }

    @GetMapping("/download/{reportId}")
    public ResponseEntity<?> downloadReport(@PathVariable String reportId, Authentication authentication) {
        String username = authentication.getName();
        
        try {
            // Get the reports directory
            String reportsDir = reportsService.getReportsDirectory();
            File dir = new File(reportsDir);
            
            if (!dir.exists() || !dir.isDirectory()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Reports directory not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            
            // Extract the UUID part from reportId (remove "rpt_" prefix if present)
            final String uuidPart;
            if (reportId.startsWith("rpt_")) {
                uuidPart = reportId.substring(4);
            } else {
                uuidPart = reportId;
            }
            
            // Find the file with matching report ID (supports both pdf and xlsx)
            final String searchPrefix1 = uuidPart;
            final String searchPrefix2 = "rpt_" + uuidPart;
            File[] files = dir.listFiles((d, name) -> {
                if (name.endsWith(".pdf") || name.endsWith(".xlsx")) {
                    // Check if filename starts with the UUID
                    String baseName = name.substring(0, name.lastIndexOf('.'));
                    return baseName.startsWith(searchPrefix1) || baseName.startsWith(searchPrefix2);
                }
                return false;
            });
            
            if (files == null || files.length == 0) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Report not found: " + reportId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            
            File reportFile = files[0];
            Resource resource = new FileSystemResource(reportFile);
            
            // Set content type based on file extension
            MediaType contentType = reportFile.getName().endsWith(".xlsx") 
                ? MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                : MediaType.APPLICATION_PDF;
            
            return ResponseEntity.ok()
                    .contentType(contentType)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + reportFile.getName() + "\"")
                    .body(resource);
                    
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to download report: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/list")
    public ResponseEntity<?> listReports(Authentication authentication) {
        String username = authentication.getName();
        
        try {
            String reportsDir = reportsService.getReportsDirectory();
            File dir = new File(reportsDir);
            
            Map<String, Object> response = new HashMap<>();
            
            if (!dir.exists() || !dir.isDirectory()) {
                response.put("success", true);
                response.put("data", new java.util.ArrayList<>());
                return ResponseEntity.ok(response);
            }
            
            File[] files = dir.listFiles((d, name) -> name.endsWith(".pdf") || name.endsWith(".xlsx"));
            java.util.List<Map<String, Object>> reports = new java.util.ArrayList<>();
            
            if (files != null) {
                for (File file : files) {
                    Map<String, Object> reportInfo = new HashMap<>();
                    reportInfo.put("fileName", file.getName());
                    reportInfo.put("reportId", extractReportId(file.getName()));
                    reportInfo.put("size", file.length());
                    reportInfo.put("createdAt", java.time.Instant.ofEpochMilli(file.lastModified()).toString());
                    reports.add(reportInfo);
                }
            }
            
            response.put("success", true);
            response.put("data", reports);
            response.put("timestamp", System.currentTimeMillis());
            
            return ResponseEntity.ok(response);
                    
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to list reports: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}


package com.tnc.domain.portfolio.controller;

import com.tnc.common.api.ApiResponse;
import com.tnc.domain.portfolio.dto.AnalyticsDTO;
import com.tnc.domain.portfolio.service.AnalyticsService;
import com.tnc.domain.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/portfolios/{portfolioId}/reports")
@RequiredArgsConstructor
public class ReportController {

    private final AnalyticsService analyticsService;

    @GetMapping("/profit-loss")
    public ResponseEntity<ApiResponse<AnalyticsDTO.ProfitLossReport>> getProfitLossReport(
            @AuthenticationPrincipal User user,
            @PathVariable Long portfolioId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        AnalyticsDTO.ProfitLossReport report = analyticsService.getProfitLossReport(
                user.getId(), portfolioId, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(report));
    }

    @GetMapping("/performance")
    public ResponseEntity<ApiResponse<List<AnalyticsDTO.StockPerformance>>> getPerformanceReport(
            @AuthenticationPrincipal User user,
            @PathVariable Long portfolioId) {
        
        List<AnalyticsDTO.StockPerformance> performance = analyticsService.getStockPerformance(
                user.getId(), portfolioId);
        return ResponseEntity.ok(ApiResponse.success(performance));
    }

    @GetMapping("/sector")
    public ResponseEntity<ApiResponse<AnalyticsDTO.SectorAnalysis>> getSectorReport(
            @AuthenticationPrincipal User user,
            @PathVariable Long portfolioId) {
        
        AnalyticsDTO.SectorAnalysis analysis = analyticsService.getSectorAnalysis(
                user.getId(), portfolioId);
        return ResponseEntity.ok(ApiResponse.success(analysis));
    }
}

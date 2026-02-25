package com.tnc.domain.analytics.controller;

import com.tnc.common.api.ApiResponse;
import com.tnc.domain.analytics.dto.*;
import com.tnc.domain.analytics.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
@Tag(name = "Analytics", description = "Portfolio analytics and insights")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/profit-loss")
    @Operation(summary = "Get profit/loss summary (realized vs unrealized)")
    public ResponseEntity<ApiResponse<ProfitLossSummaryDTO>> getProfitLossSummary() {
        ProfitLossSummaryDTO summary = analyticsService.getProfitLossSummary();
        return ResponseEntity.ok(ApiResponse.success(summary));
    }

        @GetMapping("/top-gainers")
        @Operation(summary = "Get top gaining stocks")
    public ResponseEntity<ApiResponse<List<TopMoversDTO>>> getTopGainers(
            @RequestParam(defaultValue = "5") int limit) {
        List<TopMoversDTO> gainers = analyticsService.getTopGainers(limit);
        return ResponseEntity.ok(ApiResponse.success(gainers));
    }

        @GetMapping("/top-losers")
        @Operation(summary = "Get top losing stocks")
    public ResponseEntity<ApiResponse<List<TopMoversDTO>>> getTopLosers(
            @RequestParam(defaultValue = "5") int limit) {
        List<TopMoversDTO> losers = analyticsService.getTopLosers(limit);
        return ResponseEntity.ok(ApiResponse.success(losers));
    }

    @GetMapping("/allocation")
    @Operation(summary = "Get portfolio allocation by symbol")
    public ResponseEntity<ApiResponse<List<AllocationDTO>>> getPortfolioAllocation() {
        List<AllocationDTO> allocation = analyticsService.getPortfolioAllocation();
        return ResponseEntity.ok(ApiResponse.success(allocation));
    }

        @GetMapping("/performance/daily")
        @Operation(summary = "Get daily performance for N days")
    public ResponseEntity<ApiResponse<List<TimeSeriesPointDTO>>> getDailyPerformance(
            @RequestParam(defaultValue = "30") int days) {
        List<TimeSeriesPointDTO> performance = analyticsService.getDailyPerformance(days);
        return ResponseEntity.ok(ApiResponse.success(performance));
    }

        @GetMapping("/performance/monthly")
        @Operation(summary = "Get monthly performance for N months")
    public ResponseEntity<ApiResponse<List<TimeSeriesPointDTO>>> getMonthlyPerformance(
            @RequestParam(defaultValue = "12") int months) {
        List<TimeSeriesPointDTO> performance = analyticsService.getMonthlyPerformance(months);
        return ResponseEntity.ok(ApiResponse.success(performance));
    }

        @GetMapping("/performance/yearly")
        @Operation(summary = "Get yearly performance for N years")
    public ResponseEntity<ApiResponse<List<TimeSeriesPointDTO>>> getYearlyPerformance(
            @RequestParam(defaultValue = "5") int years) {
        List<TimeSeriesPointDTO> performance = analyticsService.getYearlyPerformance(years);
        return ResponseEntity.ok(ApiResponse.success(performance));
    }
}

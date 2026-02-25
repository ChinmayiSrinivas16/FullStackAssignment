package com.tnc.domain.portfolio.controller;

import com.tnc.common.api.ApiResponse;
import com.tnc.domain.portfolio.dto.PortfolioDTO;
import com.tnc.domain.portfolio.dto.AnalyticsDTO;
import com.tnc.domain.portfolio.service.AnalyticsService;
import com.tnc.domain.portfolio.service.PortfolioService;
import com.tnc.domain.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/portfolios")
@RequiredArgsConstructor
public class PortfolioController {

    private final PortfolioService portfolioService;
    private final AnalyticsService analyticsService;

    @PostMapping
    public ResponseEntity<ApiResponse<PortfolioDTO.PortfolioResponse>> createPortfolio(
            @AuthenticationPrincipal User user,
            @RequestBody PortfolioDTO.PortfolioRequest request) {
        
        PortfolioDTO.PortfolioResponse portfolio = portfolioService.createPortfolio(user.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(portfolio, "Portfolio created successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PortfolioDTO.PortfolioSummary>>> getUserPortfolios(
            @AuthenticationPrincipal User user) {
        
        List<PortfolioDTO.PortfolioSummary> portfolios = portfolioService.getUserPortfolios(user.getId());
        return ResponseEntity.ok(ApiResponse.success(portfolios));
    }

    @GetMapping("/{portfolioId}")
    public ResponseEntity<ApiResponse<PortfolioDTO.PortfolioResponse>> getPortfolio(
            @AuthenticationPrincipal User user,
            @PathVariable Long portfolioId) {
        
        PortfolioDTO.PortfolioResponse portfolio = portfolioService.getPortfolio(user.getId(), portfolioId);
        return ResponseEntity.ok(ApiResponse.success(portfolio));
    }

    @PutMapping("/{portfolioId}")
    public ResponseEntity<ApiResponse<PortfolioDTO.PortfolioResponse>> updatePortfolio(
            @AuthenticationPrincipal User user,
            @PathVariable Long portfolioId,
            @RequestBody PortfolioDTO.PortfolioRequest request) {
        
        PortfolioDTO.PortfolioResponse portfolio = portfolioService.updatePortfolio(user.getId(), portfolioId, request);
        return ResponseEntity.ok(ApiResponse.success(portfolio, "Portfolio updated successfully"));
    }

    @DeleteMapping("/{portfolioId}")
    public ResponseEntity<ApiResponse<Void>> deletePortfolio(
            @AuthenticationPrincipal User user,
            @PathVariable Long portfolioId) {
        
        portfolioService.deletePortfolio(user.getId(), portfolioId);
        return ResponseEntity.ok(ApiResponse.success(null, "Portfolio deleted successfully"));
    }

    @PostMapping("/{portfolioId}/refresh")
    public ResponseEntity<ApiResponse<PortfolioDTO.PortfolioSummary>> refreshPrices(
            @AuthenticationPrincipal User user,
            @PathVariable Long portfolioId) {
        
        PortfolioDTO.PortfolioSummary summary = portfolioService.refreshPortfolioPrices(user.getId(), portfolioId);
        return ResponseEntity.ok(ApiResponse.success(summary, "Prices refreshed successfully"));
    }

    @GetMapping("/{portfolioId}/dashboard")
    public ResponseEntity<ApiResponse<AnalyticsDTO.DashboardSummary>> getDashboard(
            @AuthenticationPrincipal User user,
            @PathVariable Long portfolioId) {
        
        AnalyticsDTO.DashboardSummary dashboard = analyticsService.getDashboardSummary(user.getId(), portfolioId);
        return ResponseEntity.ok(ApiResponse.success(dashboard));
    }

    @GetMapping("/{portfolioId}/performance")
    public ResponseEntity<ApiResponse<List<AnalyticsDTO.StockPerformance>>> getStockPerformance(
            @AuthenticationPrincipal User user,
            @PathVariable Long portfolioId) {
        
        List<AnalyticsDTO.StockPerformance> performance = analyticsService.getStockPerformance(user.getId(), portfolioId);
        return ResponseEntity.ok(ApiResponse.success(performance));
    }

    @GetMapping("/{portfolioId}/sector-analysis")
    public ResponseEntity<ApiResponse<AnalyticsDTO.SectorAnalysis>> getSectorAnalysis(
            @AuthenticationPrincipal User user,
            @PathVariable Long portfolioId) {
        
        AnalyticsDTO.SectorAnalysis analysis = analyticsService.getSectorAnalysis(user.getId(), portfolioId);
        return ResponseEntity.ok(ApiResponse.success(analysis));
    }
}

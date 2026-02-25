package com.tnc.domain.stock.controller;

import com.tnc.common.api.ApiResponse;
import com.tnc.domain.stock.dto.StockDTO;
import com.tnc.domain.stock.service.StockService;
import com.tnc.domain.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/portfolios/{portfolioId}/stocks")
@RequiredArgsConstructor
public class StockController {

    private final StockService stockService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<StockDTO.StockResponse>>> getStocks(
            @AuthenticationPrincipal User user,
            @PathVariable Long portfolioId) {
        
        List<StockDTO.StockResponse> stocks = stockService.getPortfolioStocks(user.getId(), portfolioId);
        return ResponseEntity.ok(ApiResponse.success(stocks));
    }

    @GetMapping("/{stockId}")
    public ResponseEntity<ApiResponse<StockDTO.StockResponse>> getStock(
            @AuthenticationPrincipal User user,
            @PathVariable Long portfolioId,
            @PathVariable Long stockId) {
        
        StockDTO.StockResponse stock = stockService.getStock(user.getId(), portfolioId, stockId);
        return ResponseEntity.ok(ApiResponse.success(stock));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<StockDTO.StockResponse>> addStock(
            @AuthenticationPrincipal User user,
            @PathVariable Long portfolioId,
            @RequestBody StockDTO.StockRequest request) {
        
        StockDTO.StockResponse stock = stockService.addStock(user.getId(), portfolioId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(stock, "Stock added successfully"));
    }

    @PutMapping("/{stockId}")
    public ResponseEntity<ApiResponse<StockDTO.StockResponse>> updateStock(
            @AuthenticationPrincipal User user,
            @PathVariable Long portfolioId,
            @PathVariable Long stockId,
            @RequestBody StockDTO.StockRequest request) {
        
        StockDTO.StockResponse stock = stockService.updateStock(user.getId(), portfolioId, stockId, request);
        return ResponseEntity.ok(ApiResponse.success(stock, "Stock updated successfully"));
    }

    @DeleteMapping("/{stockId}")
    public ResponseEntity<ApiResponse<Void>> deleteStock(
            @AuthenticationPrincipal User user,
            @PathVariable Long portfolioId,
            @PathVariable Long stockId) {
        
        stockService.deleteStock(user.getId(), portfolioId, stockId);
        return ResponseEntity.ok(ApiResponse.success(null, "Stock deleted successfully"));
    }

    @GetMapping("/gainers")
    public ResponseEntity<ApiResponse<List<StockDTO.StockSummary>>> getTopGainers(
            @AuthenticationPrincipal User user,
            @PathVariable Long portfolioId) {
        
        List<StockDTO.StockSummary> gainers = stockService.getTopGainers(user.getId(), portfolioId);
        return ResponseEntity.ok(ApiResponse.success(gainers));
    }

    @GetMapping("/losers")
    public ResponseEntity<ApiResponse<List<StockDTO.StockSummary>>> getTopLosers(
            @AuthenticationPrincipal User user,
            @PathVariable Long portfolioId) {
        
        List<StockDTO.StockSummary> losers = stockService.getTopLosers(user.getId(), portfolioId);
        return ResponseEntity.ok(ApiResponse.success(losers));
    }

    @PostMapping("/{stockId}/refresh")
    public ResponseEntity<ApiResponse<StockDTO.StockResponse>> refreshStockPrice(
            @AuthenticationPrincipal User user,
            @PathVariable Long portfolioId,
            @PathVariable Long stockId) {
        
        StockDTO.StockResponse stock = stockService.refreshStockPrice(user.getId(), portfolioId, stockId);
        return ResponseEntity.ok(ApiResponse.success(stock, "Price refreshed successfully"));
    }
}

package com.tnc.domain.portfolio.controller;

import com.tnc.common.api.ApiResponse;
import com.tnc.domain.portfolio.service.MarketDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/market")
@RequiredArgsConstructor
public class MarketDataController {

    private final MarketDataService marketDataService;

    @GetMapping("/price/{symbol}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStockPrice(@PathVariable String symbol) {
        BigDecimal price = marketDataService.getCurrentPrice(symbol);
        String name = marketDataService.getStockName(symbol);
        
        return ResponseEntity.ok(ApiResponse.success(Map.of(
            "symbol", symbol.toUpperCase(),
            "name", name,
            "price", price
        )));
    }

    @GetMapping("/stocks")
    public ResponseEntity<ApiResponse<Map<String, BigDecimal>>> getAllStocks() {
        Map<String, BigDecimal> stocks = marketDataService.getAllStockPrices();
        return ResponseEntity.ok(ApiResponse.success(stocks));
    }

    @GetMapping("/validate/{symbol}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> validateStock(@PathVariable String symbol) {
        boolean valid = marketDataService.isValidStock(symbol);
        String name = valid ? marketDataService.getStockName(symbol) : "Unknown";
        
        return ResponseEntity.ok(ApiResponse.success(Map.of(
            "symbol", symbol.toUpperCase(),
            "valid", valid,
            "name", name
        )));
    }
}

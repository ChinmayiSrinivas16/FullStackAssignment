package com.tnc.domain.marketdata.controller;

import com.tnc.common.api.ApiResponse;
import com.tnc.domain.marketdata.dto.PriceQuoteDTO;
import com.tnc.domain.marketdata.dto.RefreshPricesResponse;
import com.tnc.domain.marketdata.service.MarketDataService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/market-data")
@RequiredArgsConstructor
@Tag(name = "Market Data", description = "Stock price and market data endpoints")
public class MarketDataController {

    private final MarketDataService marketDataService;

    @GetMapping("/price/{symbol}")
    @Operation(summary = "Get current price for a stock symbol")
    public ResponseEntity<ApiResponse<PriceQuoteDTO>> getPrice(@PathVariable String symbol) {
        PriceQuoteDTO price = marketDataService.getPrice(symbol);
        return ResponseEntity.ok(ApiResponse.success(price, "Price retrieved successfully"));
    }

    @PostMapping("/prices")
    @Operation(summary = "Get current prices for multiple symbols")
    public ResponseEntity<ApiResponse<List<PriceQuoteDTO>>> getPrices(@RequestBody List<String> symbols) {
        List<PriceQuoteDTO> prices = marketDataService.getPrices(symbols);
        return ResponseEntity.ok(ApiResponse.success(prices, "Prices retrieved successfully"));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh prices for symbols")
    public ResponseEntity<ApiResponse<RefreshPricesResponse>> refreshPrices(@RequestBody List<String> symbols) {
        RefreshPricesResponse response = marketDataService.refreshPrices(symbols);
        return ResponseEntity.ok(ApiResponse.success(response, "Prices refreshed successfully"));
    }
}

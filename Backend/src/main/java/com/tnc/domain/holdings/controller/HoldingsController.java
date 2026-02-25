package com.tnc.domain.holdings.controller;

import com.tnc.common.api.ApiResponse;
import com.tnc.domain.holdings.dto.HoldingRowDTO;
import com.tnc.domain.holdings.dto.HoldingsSummaryDTO;
import com.tnc.domain.holdings.service.HoldingsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/holdings")
@RequiredArgsConstructor
@Tag(name = "Holdings", description = "Portfolio holdings endpoints")
public class HoldingsController {

    private final HoldingsService holdingsService;

    @GetMapping
    @Operation(summary = "Get all current holdings with gains/losses")
    public ResponseEntity<ApiResponse<HoldingsSummaryDTO>> getAllHoldings() {
        HoldingsSummaryDTO holdings = holdingsService.getAllHoldings();
        return ResponseEntity.ok(ApiResponse.success(holdings, "Holdings retrieved successfully"));
    }

    @GetMapping("/{symbol}")
    @Operation(summary = "Get holding details for a specific symbol")
    public ResponseEntity<ApiResponse<HoldingRowDTO>> getHoldingBySymbol(@PathVariable String symbol) {
        HoldingRowDTO holding = holdingsService.getHoldingBySymbol(symbol);
        return ResponseEntity.ok(ApiResponse.success(holding));
    }
}

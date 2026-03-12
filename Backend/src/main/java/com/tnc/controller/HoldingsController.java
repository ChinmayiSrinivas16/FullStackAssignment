package com.tnc.controller;

import com.tnc.domain.holdings.entity.Holding;
import com.tnc.service.HoldingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/holdings")
@CrossOrigin(
    origins = {"http://stockfolio.duckdns.org", "https://stockfolio.duckdns.org", "http://localhost"}
)
public class HoldingsController {

    @Autowired
    private HoldingsService holdingsService;

    @GetMapping
    public ResponseEntity<?> getAllHoldings(Authentication authentication) {
        String username = authentication.getName();
        List<Holding> holdings = holdingsService.getAllHoldings(username);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Holdings retrieved");
        response.put("data", holdings);
        response.put("timestamp", System.currentTimeMillis());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/refresh")
    public ResponseEntity<?> refreshPrices(Authentication authentication) {
        String username = authentication.getName();
        holdingsService.updateCurrentPrices(username);
        
        List<Holding> holdings = holdingsService.getAllHoldings(username);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Prices refreshed from live market");
        response.put("data", holdings);
        response.put("timestamp", System.currentTimeMillis());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getHoldingById(@PathVariable Long id, Authentication authentication) {
        String username = authentication.getName();
        return holdingsService.getHoldingById(id, username)
                .map(holding -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", true);
                    response.put("message", "Holding retrieved");
                    response.put("data", holding);
                    response.put("timestamp", System.currentTimeMillis());
                    return ResponseEntity.ok(response);
                })
                .orElseGet(() -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", false);
                    response.put("message", "Holding not found");
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
                });
    }

    @PostMapping
    public ResponseEntity<?> createHolding(@RequestBody Map<String, Object> request, Authentication authentication) {
        String username = authentication.getName();
        
        Holding holding = new Holding();
        holding.setSymbol(((String) request.get("symbol")).toUpperCase());
        holding.setQuantity(((Number) request.get("quantity")).doubleValue());
        
        // Purchase price is now optional - will be fetched from live market if not provided
        if (request.containsKey("purchasePrice") && request.get("purchasePrice") != null) {
            holding.setAverageCost(((Number) request.get("purchasePrice")).doubleValue());
        }
        
        if (request.containsKey("portfolioId")) {
            // Set portfolio if provided
        }
        
        Holding savedHolding = holdingsService.createHolding(holding, username);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Holding created successfully with live market price");
        response.put("data", savedHolding);
        response.put("timestamp", System.currentTimeMillis());
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}

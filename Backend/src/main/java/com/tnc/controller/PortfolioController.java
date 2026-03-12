package com.tnc.controller;

import com.tnc.service.PortfolioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/portfolio")
@CrossOrigin(
    origins = {"http://stockfolio.duckdns.org", "https://stockfolio.duckdns.org", "http://localhost"}
)
public class PortfolioController {

    @Autowired
    private PortfolioService portfolioService;

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard(Authentication authentication) {
        String username = authentication.getName();
        Map<String, Object> response = portfolioService.getDashboard(username);
        
        if (response == null) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "User not found"
            ));
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/total-investment")
    public ResponseEntity<?> getTotalInvestment(Authentication authentication) {
        String username = authentication.getName();
        Map<String, Object> response = portfolioService.getTotalInvestment(username);
        
        if (response == null) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "User not found"
            ));
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/current-value")
    public ResponseEntity<?> getCurrentValue(Authentication authentication) {
        String username = authentication.getName();
        Map<String, Object> response = portfolioService.getCurrentValue(username);
        
        if (response == null) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "User not found"
            ));
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/total-gain")
    public ResponseEntity<?> getTotalGain(Authentication authentication) {
        String username = authentication.getName();
        Map<String, Object> response = portfolioService.getTotalGain(username);
        
        if (response == null) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "User not found"
            ));
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/pnl")
    public ResponseEntity<?> getPnL(
            @RequestParam(required = false, defaultValue = "monthly") String period,
            Authentication authentication) {
        String username = authentication.getName();
        Map<String, Object> response = portfolioService.getPnL(username, period);
        
        if (response == null) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "User not found"
            ));
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/win-rate")
    public ResponseEntity<?> getWinRate(Authentication authentication) {
        String username = authentication.getName();
        Map<String, Object> response = portfolioService.getWinRate(username);
        
        if (response == null) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "User not found"
            ));
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/returns")
    public ResponseEntity<?> getReturns(
            @RequestParam(required = false, defaultValue = "yearly") String period,
            Authentication authentication) {
        String username = authentication.getName();
        Map<String, Object> response = portfolioService.getReturns(username, period);
        
        if (response == null) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "User not found"
            ));
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/summary")
    public ResponseEntity<?> getSummary(Authentication authentication) {
        String username = authentication.getName();
        Map<String, Object> response = portfolioService.getSummary(username);
        
        if (response == null) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "User not found"
            ));
        }
        return ResponseEntity.ok(response);
    }
}

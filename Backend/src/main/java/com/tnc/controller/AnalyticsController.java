package com.tnc.controller;

import com.tnc.domain.holdings.entity.Holding;
import com.tnc.domain.user.entity.User;
import com.tnc.repository.HoldingRepository;
import com.tnc.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/analytics")
@CrossOrigin(
    origins = {"http://stockfolio.duckdns.org", "https://stockfolio.duckdns.org", "http://localhost"}
)
public class AnalyticsController {

    @Autowired
    private HoldingRepository holdingRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/allocation")
    public ResponseEntity<?> getAssetAllocation(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username).orElse(null);
        
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "User not found"
            ));
        }
        
        List<Holding> holdings = holdingRepository.findByUserId(user.getId());
        
        double totalValue = holdings.stream()
                .mapToDouble(h -> h.getCurrentValue() != null ? h.getCurrentValue() : 0)
                .sum();
        
        // For now, we'll simulate asset allocation based on holdings
        // In a real app, you'd have categories for each holding
        Map<String, Object> stocks = new HashMap<>();
        stocks.put("value", totalValue);
        stocks.put("percentage", totalValue > 0 ? 100.0 : 0.0);
        
        Map<String, Object> bonds = new HashMap<>();
        bonds.put("value", 0.0);
        bonds.put("percentage", 0.0);
        
        Map<String, Object> cash = new HashMap<>();
        cash.put("value", 0.0);
        cash.put("percentage", 0.0);
        
        Map<String, Object> data = new HashMap<>();
        data.put("stocks", stocks);
        data.put("bonds", bonds);
        data.put("cash", cash);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Asset allocation retrieved");
        response.put("data", data);
        response.put("timestamp", System.currentTimeMillis());
        
        return ResponseEntity.ok(response);
    }
}

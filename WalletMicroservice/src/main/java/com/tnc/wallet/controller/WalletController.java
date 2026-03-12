package com.tnc.wallet.controller;

import com.tnc.wallet.model.WalletSummary;
import com.tnc.wallet.service.WalletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/")
@CrossOrigin(
    origins = {"http://stockfolio.duckdns.org", "https://stockfolio.duckdns.org", "http://localhost"},
    allowedHeaders = {"Authorization", "Content-Type", "X-Requested-With"},
    allowCredentials = "true"
)
public class WalletController {

    @Autowired
    private WalletService walletService;

    @PostMapping("wallets/{username}/ensure")
    public ResponseEntity<?> ensureWallet(@PathVariable String username) {
        WalletSummary summary = walletService.ensureWallet(username);
        return ResponseEntity.ok(success("Wallet initialized", summary));
    }

    @GetMapping("wallets/{username}/summary")
    public ResponseEntity<?> getSummary(@PathVariable String username) {
        WalletSummary summary = walletService.getSummary(username);
        return ResponseEntity.ok(success("Wallet summary retrieved", summary));
    }

    @PostMapping("wallets/{username}/debit")
    public ResponseEntity<?> debit(@PathVariable String username, @RequestBody Map<String, Object> request) {
        try {
            Object amountValue = request.get("amount");
            if (!(amountValue instanceof Number)) {
                throw new IllegalArgumentException("Amount is required");
            }
            double amount = ((Number) amountValue).doubleValue();
            WalletSummary summary = walletService.debit(username, amount);
            return ResponseEntity.ok(success("Wallet debited", summary));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(error(ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(error("Unable to process wallet request"));
        }
    }

    @PostMapping("wallets/{username}/credit")
    public ResponseEntity<?> credit(@PathVariable String username, @RequestBody Map<String, Object> request) {
        try {
            Object amountValue = request.get("amount");
            if (!(amountValue instanceof Number)) {
                throw new IllegalArgumentException("Amount is required");
            }
            double amount = ((Number) amountValue).doubleValue();
            WalletSummary summary = walletService.credit(username, amount);
            return ResponseEntity.ok(success("Wallet credited", summary));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(error(ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(error("Unable to process wallet request"));
        }
    }

    @PostMapping("wallets/{username}/add-money")
    public ResponseEntity<?> addMoney(@PathVariable String username, @RequestBody Map<String, Object> request) {
        try {
            Object amountValue = request.get("amount");
            if (!(amountValue instanceof Number)) {
                throw new IllegalArgumentException("Amount is required");
            }
            double amount = ((Number) amountValue).doubleValue();
            WalletSummary summary = walletService.credit(username, amount);
            return ResponseEntity.ok(success("Money added to wallet", summary));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(error(ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(error("Unable to process wallet request"));
        }
    }

    @GetMapping("health")
    public ResponseEntity<?> health() {
        Map<String, Object> response = new HashMap<String, Object>();
        response.put("status", "ok");
        return ResponseEntity.ok(response);
    }

    private Map<String, Object> success(String message, Object data) {
        Map<String, Object> response = new HashMap<String, Object>();
        response.put("success", true);
        response.put("message", message);
        response.put("data", data);
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }

    private Map<String, Object> error(String message) {
        Map<String, Object> response = new HashMap<String, Object>();
        response.put("success", false);
        response.put("message", message);
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }
}

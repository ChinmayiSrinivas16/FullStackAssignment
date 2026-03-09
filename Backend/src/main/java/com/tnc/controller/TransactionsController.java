package com.tnc.controller;

import com.tnc.domain.transaction.entity.Transaction;
import com.tnc.service.TransactionsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/transactions")
@CrossOrigin
public class TransactionsController {

    @Autowired
    private TransactionsService transactionsService;

    @GetMapping
    public ResponseEntity<?> getAllTransactions(
            @RequestParam(required = false) String type,
            @RequestParam(required = false, defaultValue = "50") Integer limit,
            @RequestParam(required = false, defaultValue = "0") Integer offset,
            Authentication authentication) {
        
        String username = authentication.getName();
        List<Transaction> transactions = transactionsService.getAllTransactions(username, type, limit, offset);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Transactions retrieved");
        response.put("data", transactions);
        response.put("timestamp", System.currentTimeMillis());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTransactionById(@PathVariable Long id, Authentication authentication) {
        String username = authentication.getName();
        
        return transactionsService.getTransactionById(id, username)
                .map(transaction -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", true);
                    response.put("message", "Transaction retrieved");
                    response.put("data", transaction);
                    response.put("timestamp", System.currentTimeMillis());
                    return ResponseEntity.ok(response);
                })
                .orElseGet(() -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", false);
                    response.put("message", "Transaction not found");
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
                });
    }

    @GetMapping("/wallet")
    public ResponseEntity<?> getWalletSummary(Authentication authentication) {
        String username = authentication.getName();
        Map<String, Object> response = transactionsService.getWalletSummary(username);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/wallet/add-money")
    public ResponseEntity<?> addMoneyToWallet(@RequestBody Map<String, Object> request, Authentication authentication) {
        String username = authentication.getName();
        try {
            if (!request.containsKey("amount") || !(request.get("amount") instanceof Number)) {
                throw new IllegalArgumentException("Amount is required");
            }
            double amount = ((Number) request.get("amount")).doubleValue();
            Map<String, Object> response = transactionsService.addMoneyToWallet(username, amount);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException ex) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", ex.getMessage());
            error.put("timestamp", System.currentTimeMillis());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping
    public ResponseEntity<?> createTransaction(@RequestBody Map<String, Object> request, Authentication authentication) {
        String username = authentication.getName();
        
        Transaction transaction = new Transaction();
        transaction.setSymbol(((String) request.get("symbol")).toUpperCase());
        transaction.setType(((String) request.get("type")).toUpperCase());
        
        if (request.containsKey("quantity")) {
            transaction.setQuantity(((Number) request.get("quantity")).doubleValue());
        }
        
        // Order type - MARKET, LIMIT, STOP_LOSS, STOP_LIMIT
        if (request.containsKey("orderType")) {
            transaction.setOrderType((String) request.get("orderType"));
        } else {
            transaction.setOrderType("MARKET");
        }
        
        // Limit price for limit orders
        if (request.containsKey("limitPrice")) {
            transaction.setLimitPrice(((Number) request.get("limitPrice")).doubleValue());
        }
        
        // Stop price for stop orders
        if (request.containsKey("stopPrice")) {
            transaction.setStopPrice(((Number) request.get("stopPrice")).doubleValue());
        }
        
        // Price is optional - will be auto-fetched for market orders
        if (request.containsKey("price") && request.get("price") != null) {
            transaction.setPrice(((Number) request.get("price")).doubleValue());
        }
        
        if (request.containsKey("notes")) {
            transaction.setNotes((String) request.get("notes"));
        }
        
        Transaction savedTransaction;
        try {
            savedTransaction = transactionsService.createTransaction(transaction, username);
        } catch (IllegalArgumentException ex) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", ex.getMessage());
            error.put("timestamp", System.currentTimeMillis());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception ex) {
            String message = extractRootMessage(ex);
            if (message == null || message.trim().isEmpty()) {
                message = "Unable to complete transaction";
            }

            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", message);
            error.put("timestamp", System.currentTimeMillis());
            return ResponseEntity.badRequest().body(error);
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Transaction created successfully");
        
        Map<String, Object> data = new HashMap<>();
        data.put("id", savedTransaction.getId());
        data.put("symbol", savedTransaction.getSymbol());
        data.put("type", savedTransaction.getType());
        data.put("quantity", savedTransaction.getQuantity());
        data.put("price", savedTransaction.getPrice());
        data.put("orderType", savedTransaction.getOrderType());
        data.put("status", savedTransaction.getStatus());
        data.put("total", savedTransaction.getQuantity() * savedTransaction.getPrice());
        data.put("date", savedTransaction.getTransactionDate());
        
        response.put("data", data);
        response.put("timestamp", System.currentTimeMillis());
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    private String extractRootMessage(Throwable throwable) {
        Throwable current = throwable;
        while (current != null) {
            if (current.getMessage() != null && !current.getMessage().trim().isEmpty()) {
                String msg = current.getMessage();
                if (msg.contains("Insufficient balance")) {
                    return "Insufficient balance";
                }
                if (msg.contains("Cannot sell a stock you do not currently hold.")) {
                    return "Cannot sell a stock you do not currently hold.";
                }
                if (msg.contains("Insufficient quantity in holdings for sell transaction.")) {
                    return "Insufficient quantity in holdings for sell transaction.";
                }
                if (msg.contains("Wallet request failed")) {
                    return "Insufficient balance";
                }
            }
            current = current.getCause();
        }
        return null;
    }

    @PostMapping("/advanced")
    public ResponseEntity<?> placeAdvancedOrder(@RequestBody Map<String, Object> request, Authentication authentication) {
        String username = authentication.getName();
        
        Transaction transaction = new Transaction();
        transaction.setSymbol(((String) request.get("symbol")).toUpperCase());
        transaction.setType(((String) request.get("type")).toUpperCase());
        
        if (request.containsKey("quantity")) {
            transaction.setQuantity(((Number) request.get("quantity")).doubleValue());
        }
        
        // Required order type
        String orderType = (String) request.get("orderType");
        if (orderType == null || orderType.isEmpty()) {
            orderType = "MARKET";
        }
        transaction.setOrderType(orderType);
        
        // Limit price
        if (request.containsKey("limitPrice")) {
            transaction.setLimitPrice(((Number) request.get("limitPrice")).doubleValue());
        }
        
        // Stop price
        if (request.containsKey("stopPrice")) {
            transaction.setStopPrice(((Number) request.get("stopPrice")).doubleValue());
        }
        
        if (request.containsKey("notes")) {
            transaction.setNotes((String) request.get("notes"));
        }
        
        Transaction savedTransaction;
        try {
            savedTransaction = transactionsService.placeAdvancedOrder(transaction, username);
        } catch (IllegalArgumentException ex) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", ex.getMessage());
            error.put("timestamp", System.currentTimeMillis());
            return ResponseEntity.badRequest().body(error);
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", "EXECUTED".equals(savedTransaction.getStatus()));
        response.put("message", "Order " + savedTransaction.getStatus().toLowerCase());
        
        Map<String, Object> data = new HashMap<>();
        data.put("id", savedTransaction.getId());
        data.put("symbol", savedTransaction.getSymbol());
        data.put("type", savedTransaction.getType());
        data.put("quantity", savedTransaction.getQuantity());
        data.put("price", savedTransaction.getPrice());
        data.put("orderType", savedTransaction.getOrderType());
        data.put("status", savedTransaction.getStatus());
        data.put("limitPrice", savedTransaction.getLimitPrice());
        data.put("stopPrice", savedTransaction.getStopPrice());
        data.put("total", savedTransaction.getQuantity() * savedTransaction.getPrice());
        
        response.put("data", data);
        response.put("timestamp", System.currentTimeMillis());
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}

package com.tnc.domain.transaction.controller;

import com.tnc.common.api.ApiResponse;
import com.tnc.domain.transaction.dto.TransactionDTO;
import com.tnc.domain.transaction.service.TransactionService;
import com.tnc.domain.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/portfolios/{portfolioId}/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping
    public ResponseEntity<ApiResponse<TransactionDTO.TransactionResponse>> createTransaction(
            @AuthenticationPrincipal User user,
            @PathVariable Long portfolioId,
            @RequestBody TransactionDTO.TransactionRequest request) {
        
        TransactionDTO.TransactionResponse transaction = transactionService.createTransaction(
                user.getId(), portfolioId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(transaction, "Transaction created successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<TransactionDTO.TransactionResponse>>> getTransactions(
            @AuthenticationPrincipal User user,
            @PathVariable Long portfolioId,
            Pageable pageable) {
        
        Page<TransactionDTO.TransactionResponse> transactions = transactionService.getPortfolioTransactions(
                user.getId(), portfolioId, pageable);
        return ResponseEntity.ok(ApiResponse.success(transactions));
    }

    @GetMapping("/{transactionId}")
    public ResponseEntity<ApiResponse<TransactionDTO.TransactionResponse>> getTransaction(
            @AuthenticationPrincipal User user,
            @PathVariable Long portfolioId,
            @PathVariable Long transactionId) {
        
        TransactionDTO.TransactionResponse transaction = transactionService.getTransaction(
                user.getId(), portfolioId, transactionId);
        return ResponseEntity.ok(ApiResponse.success(transaction));
    }

    @GetMapping("/stock/{stockId}")
    public ResponseEntity<ApiResponse<List<TransactionDTO.TransactionResponse>>> getStockTransactions(
            @AuthenticationPrincipal User user,
            @PathVariable Long portfolioId,
            @PathVariable Long stockId) {
        
        List<TransactionDTO.TransactionResponse> transactions = transactionService.getStockTransactions(
                user.getId(), portfolioId, stockId);
        return ResponseEntity.ok(ApiResponse.success(transactions));
    }

    @PutMapping("/{transactionId}")
    public ResponseEntity<ApiResponse<TransactionDTO.TransactionResponse>> updateTransaction(
            @AuthenticationPrincipal User user,
            @PathVariable Long portfolioId,
            @PathVariable Long transactionId,
            @RequestBody TransactionDTO.TransactionUpdateRequest request) {
        
        TransactionDTO.TransactionResponse transaction = transactionService.updateTransaction(
                user.getId(), portfolioId, transactionId, request);
        return ResponseEntity.ok(ApiResponse.success(transaction, "Transaction updated successfully"));
    }

    @DeleteMapping("/{transactionId}")
    public ResponseEntity<ApiResponse<Void>> deleteTransaction(
            @AuthenticationPrincipal User user,
            @PathVariable Long portfolioId,
            @PathVariable Long transactionId) {
        
        transactionService.deleteTransaction(user.getId(), portfolioId, transactionId);
        return ResponseEntity.ok(ApiResponse.success(null, "Transaction deleted successfully"));
    }
}

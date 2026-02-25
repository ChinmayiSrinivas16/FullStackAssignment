package com.tnc.domain.transaction.dto;

import com.tnc.domain.transaction.entity.Transaction;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class TransactionDTO {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TransactionRequest {
        private String symbol;
        private Transaction.TransactionType transactionType;
        private Integer quantity;
        private BigDecimal price;
        private BigDecimal brokerage;
        private BigDecimal tax;
        private LocalDate transactionDate;
        private String notes;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TransactionResponse {
        private Long id;
        private Long portfolioId;
        private Long stockId;
        private String symbol;
        private String companyName;
        private Transaction.TransactionType transactionType;
        private Integer quantity;
        private BigDecimal price;
        private BigDecimal totalAmount;
        private BigDecimal brokerage;
        private BigDecimal tax;
        private LocalDate transactionDate;
        private String notes;
        private Boolean isRealized;
        private LocalDateTime createdAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TransactionUpdateRequest {
        private Integer quantity;
        private BigDecimal price;
        private BigDecimal brokerage;
        private BigDecimal tax;
        private LocalDate transactionDate;
        private String notes;
    }
}

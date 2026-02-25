package com.tnc.domain.stock.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

public class StockDTO {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StockRequest {
        private String symbol;
        private String companyName;
        private String sector;
        private String industry;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StockResponse {
        private Long id;
        private String symbol;
        private String companyName;
        private String sector;
        private String industry;
        private Long portfolioId;
        private Integer totalQuantity;
        private BigDecimal averageBuyPrice;
        private BigDecimal totalInvested;
        private BigDecimal currentPrice;
        private BigDecimal currentValue;
        private BigDecimal profitLoss;
        private BigDecimal profitLossPercentage;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StockSummary {
        private String symbol;
        private String companyName;
        private Integer quantity;
        private BigDecimal currentPrice;
        private BigDecimal currentValue;
        private BigDecimal profitLoss;
        private BigDecimal profitLossPercentage;
    }
}

package com.tnc.domain.portfolio.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public class AnalyticsDTO {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DashboardSummary {
        private Long portfolioId;
        private String portfolioName;
        private BigDecimal totalInvested;
        private BigDecimal currentValue;
        private BigDecimal totalProfitLoss;
        private BigDecimal profitLossPercentage;
        private BigDecimal realizedGain;
        private BigDecimal unrealizedGain;
        private Integer stockCount;
        private List<StockPerformance> topGainers;
        private List<StockPerformance> topLosers;
        private Map<String, BigDecimal> sectorAllocation;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StockPerformance {
        private Long stockId;
        private String symbol;
        private String companyName;
        private Integer quantity;
        private BigDecimal averageBuyPrice;
        private BigDecimal currentPrice;
        private BigDecimal totalInvested;
        private BigDecimal currentValue;
        private BigDecimal profitLoss;
        private BigDecimal profitLossPercentage;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProfitLossReport {
        private LocalDate startDate;
        private LocalDate endDate;
        private BigDecimal totalBuyValue;
        private BigDecimal totalSellValue;
        private BigDecimal realizedProfitLoss;
        private Map<LocalDate, BigDecimal> dailyPnL;
        private Integer transactionCount;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SectorAnalysis {
        private Map<String, BigDecimal> sectorValues;
        private Map<String, BigDecimal> sectorPercentages;
        private BigDecimal totalValue;
    }
}

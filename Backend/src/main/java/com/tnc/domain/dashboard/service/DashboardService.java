package com.tnc.domain.dashboard.service;

import com.tnc.domain.dashboard.dto.DashboardDTO;
import com.tnc.domain.analytics.service.AnalyticsService;
import com.tnc.domain.holdings.service.HoldingsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class DashboardService {

    private final HoldingsService holdingsService;
    private final AnalyticsService analyticsService;

    /**
     * Get complete dashboard overview
     */
    public DashboardDTO getDashboard() {
        var holdingsSummary = holdingsService.getAllHoldings();
        var topGainers = analyticsService.getTopGainers(3);
        var topLosers = analyticsService.getTopLosers(3);

        String status = "NEUTRAL";
        if (holdingsSummary.getTotalGainLoss().compareTo(BigDecimal.ZERO) > 0) {
            status = "PROFIT";
        } else if (holdingsSummary.getTotalGainLoss().compareTo(BigDecimal.ZERO) < 0) {
            status = "LOSS";
        }

        var topHoldings = holdingsSummary.getHoldings().stream()
                .sorted((a, b) -> b.getCurrentValue().compareTo(a.getCurrentValue()))
                .limit(5)
                .collect(Collectors.toList());

        return DashboardDTO.builder()
                .totalInvested(holdingsSummary.getTotalInvested())
                .currentPortfolioValue(holdingsSummary.getTotalCurrentValue())
                .totalGainLoss(holdingsSummary.getTotalGainLoss())
                .totalGainLossPercent(holdingsSummary.getTotalGainLossPercent())
                .gainLossStatus(status)
                .totalStocksHeld(holdingsSummary.getTotalStocksHeld())
                .profitableStocks(holdingsSummary.getProfitableCount())
                .lossStocks(holdingsSummary.getLossCount())
                .topGainers(topGainers)
                .topLosers(topLosers)
                .topHoldings(topHoldings)
                .build();
    }
}

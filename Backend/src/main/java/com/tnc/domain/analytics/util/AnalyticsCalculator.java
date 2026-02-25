package com.tnc.domain.analytics.util;

import com.tnc.domain.holdings.dto.HoldingRowDTO;
import com.tnc.domain.analytics.dto.TopMoversDTO;
import com.tnc.domain.analytics.dto.AllocationDTO;
import lombok.extern.slf4j.Slf4j;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
public class AnalyticsCalculator {

    /**
     * Get top N gaining stocks
     */
    public static List<TopMoversDTO> getTopGainers(List<HoldingRowDTO> holdings, int limit) {
    return holdings.stream()
        .filter(h -> h.getGainLoss().compareTo(BigDecimal.ZERO) > 0)
        .sorted((a, b) -> b.getGainLoss().compareTo(a.getGainLoss()))
        .limit(limit)
        .map(h -> TopMoversDTO.builder()
            .symbol(h.getSymbol())
            .gainLoss(h.getGainLoss())
            .gainLossPercent(h.getGainLossPercent())
            .quantity(h.getQuantity())
            .currentValue(h.getCurrentValue())
            .build())
        .collect(Collectors.toList());
    }

    /**
     * Get top N losing stocks
     */
    public static List<TopMoversDTO> getTopLosers(List<HoldingRowDTO> holdings, int limit) {
    return holdings.stream()
        .filter(h -> h.getGainLoss().compareTo(BigDecimal.ZERO) < 0)
        .sorted(Comparator.comparing(HoldingRowDTO::getGainLoss))
        .limit(limit)
        .map(h -> TopMoversDTO.builder()
            .symbol(h.getSymbol())
            .gainLoss(h.getGainLoss())
            .gainLossPercent(h.getGainLossPercent())
            .quantity(h.getQuantity())
            .currentValue(h.getCurrentValue())
            .build())
        .collect(Collectors.toList());
    }

    /**
     * Calculate portfolio allocation by symbol
     */
    public static List<AllocationDTO> calculateAllocation(List<HoldingRowDTO> holdings) {
    BigDecimal totalValue = holdings.stream()
        .map(HoldingRowDTO::getCurrentValue)
        .reduce(BigDecimal.ZERO, BigDecimal::add);

    if (totalValue.compareTo(BigDecimal.ZERO) <= 0) {
        return Collections.emptyList();
    }

    return holdings.stream()
        .map(h -> {
            BigDecimal percentage = h.getCurrentValue()
                .divide(totalValue, 4, RoundingMode.HALF_UP)
                .multiply(new BigDecimal("100"))
                .setScale(2, RoundingMode.HALF_UP);
            return AllocationDTO.builder()
                .symbol(h.getSymbol())
                .value(h.getCurrentValue())
                .percentage(percentage)
                .build();
        })
        .sorted((a, b) -> b.getPercentage().compareTo(a.getPercentage()))
        .collect(Collectors.toList());
    }
}

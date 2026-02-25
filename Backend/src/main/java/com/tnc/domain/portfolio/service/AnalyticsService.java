package com.tnc.domain.portfolio.service;

import com.tnc.common.exception.ResourceNotFoundException;
import com.tnc.domain.portfolio.dto.AnalyticsDTO;
import com.tnc.domain.portfolio.entity.Portfolio;
import com.tnc.domain.portfolio.repository.PortfolioRepository;
import com.tnc.domain.stock.entity.Stock;
import com.tnc.domain.stock.repository.StockRepository;
import com.tnc.domain.transaction.entity.Transaction;
import com.tnc.domain.transaction.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final PortfolioRepository portfolioRepository;
    private final StockRepository stockRepository;
    private final TransactionRepository transactionRepository;
    private final MarketDataService marketDataService;

    @Transactional(readOnly = true)
    public AnalyticsDTO.DashboardSummary getDashboardSummary(Long userId, Long portfolioId) {
        
        Portfolio portfolio = portfolioRepository.findByIdAndUserId(portfolioId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio not found"));

        List<Stock> stocks = stockRepository.findByPortfolioId(portfolioId);

        BigDecimal totalInvested = portfolio.getTotalInvested();
        BigDecimal currentValue = stocks.stream()
                .map(Stock::getCurrentValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal totalProfitLoss = currentValue.subtract(totalInvested);
        BigDecimal profitLossPercentage = BigDecimal.ZERO;
        
        if (totalInvested.compareTo(BigDecimal.ZERO) > 0) {
            profitLossPercentage = totalProfitLoss
                    .multiply(new BigDecimal(100))
                    .divide(totalInvested, 2, RoundingMode.HALF_UP);
        }

        BigDecimal realizedGain = calculateRealizedGain(portfolioId);
        BigDecimal unrealizedGain = totalProfitLoss.subtract(realizedGain);

        List<AnalyticsDTO.StockPerformance> topGainers = stocks.stream()
                .filter(s -> s.getProfitLossPercentage().compareTo(BigDecimal.ZERO) > 0)
                .sorted(Comparator.comparing(Stock::getProfitLossPercentage).reversed())
                .limit(5)
                .map(this::toStockPerformance)
                .collect(Collectors.toList());

        List<AnalyticsDTO.StockPerformance> topLosers = stocks.stream()
                .filter(s -> s.getProfitLossPercentage().compareTo(BigDecimal.ZERO) < 0)
                .sorted(Comparator.comparing(Stock::getProfitLossPercentage))
                .limit(5)
                .map(this::toStockPerformance)
                .collect(Collectors.toList());

        Map<String, BigDecimal> sectorAllocation = calculateSectorAllocation(stocks);

        return AnalyticsDTO.DashboardSummary.builder()
                .portfolioId(portfolioId)
                .portfolioName(portfolio.getPortfolioName())
                .totalInvested(totalInvested)
                .currentValue(currentValue)
                .totalProfitLoss(totalProfitLoss)
                .profitLossPercentage(profitLossPercentage)
                .realizedGain(realizedGain)
                .unrealizedGain(unrealizedGain)
                .stockCount(stocks.size())
                .topGainers(topGainers)
                .topLosers(topLosers)
                .sectorAllocation(sectorAllocation)
                .build();
    }

    @Transactional(readOnly = true)
    public AnalyticsDTO.ProfitLossReport getProfitLossReport(Long userId, Long portfolioId, 
            LocalDate startDate, LocalDate endDate) {
        
        portfolioRepository.findByIdAndUserId(portfolioId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio not found"));

        List<Transaction> transactions = transactionRepository
                .findByPortfolioIdAndTransactionDateBetween(portfolioId, startDate, endDate);

        BigDecimal totalBuyValue = transactions.stream()
                .filter(t -> t.getTransactionType() == Transaction.TransactionType.BUY)
                .map(Transaction::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalSellValue = transactions.stream()
                .filter(t -> t.getTransactionType() == Transaction.TransactionType.SELL)
                .map(Transaction::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal realizedProfitLoss = totalSellValue.subtract(totalBuyValue);

        Map<LocalDate, BigDecimal> dailyPnL = new LinkedHashMap<>();
        LocalDate loopDate = startDate;
        while (!loopDate.isAfter(endDate)) {
            final LocalDate date = loopDate;
            BigDecimal dayBuy = transactions.stream()
                    .filter(t -> t.getTransactionType() == Transaction.TransactionType.BUY 
                            && t.getTransactionDate().equals(date))
                    .map(Transaction::getTotalAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            BigDecimal daySell = transactions.stream()
                    .filter(t -> t.getTransactionType() == Transaction.TransactionType.SELL 
                            && t.getTransactionDate().equals(date))
                    .map(Transaction::getTotalAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            dailyPnL.put(loopDate, daySell.subtract(dayBuy));
            loopDate = loopDate.plusDays(1);
        }

        return AnalyticsDTO.ProfitLossReport.builder()
                .startDate(startDate)
                .endDate(endDate)
                .totalBuyValue(totalBuyValue)
                .totalSellValue(totalSellValue)
                .realizedProfitLoss(realizedProfitLoss)
                .dailyPnL(dailyPnL)
                .transactionCount(transactions.size())
                .build();
    }

    @Transactional(readOnly = true)
    public List<AnalyticsDTO.StockPerformance> getStockPerformance(Long userId, Long portfolioId) {
        
        portfolioRepository.findByIdAndUserId(portfolioId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio not found"));

        return stockRepository.findByPortfolioId(portfolioId).stream()
                .map(this::toStockPerformance)
                .sorted(Comparator.comparing(AnalyticsDTO.StockPerformance::getProfitLossPercentage).reversed())
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AnalyticsDTO.SectorAnalysis getSectorAnalysis(Long userId, Long portfolioId) {
        
        portfolioRepository.findByIdAndUserId(portfolioId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio not found"));

        List<Stock> stocks = stockRepository.findByPortfolioId(portfolioId);
        
        Map<String, BigDecimal> sectorValues = new HashMap<>();
        BigDecimal totalValue = BigDecimal.ZERO;

        for (Stock stock : stocks) {
            String sector = stock.getSector() != null ? stock.getSector() : "Uncategorized";
            BigDecimal value = stock.getCurrentValue();
            sectorValues.merge(sector, value, BigDecimal::add);
            totalValue = totalValue.add(value);
        }

        Map<String, BigDecimal> sectorPercentages = new HashMap<>();
        for (Map.Entry<String, BigDecimal> entry : sectorValues.entrySet()) {
            BigDecimal percentage = totalValue.compareTo(BigDecimal.ZERO) > 0
                    ? entry.getValue().multiply(new BigDecimal(100)).divide(totalValue, 2, RoundingMode.HALF_UP)
                    : BigDecimal.ZERO;
            sectorPercentages.put(entry.getKey(), percentage);
        }

        return AnalyticsDTO.SectorAnalysis.builder()
                .sectorValues(sectorValues)
                .sectorPercentages(sectorPercentages)
                .totalValue(totalValue)
                .build();
    }

    private BigDecimal calculateRealizedGain(Long portfolioId) {
        return BigDecimal.ZERO;
    }

    private Map<String, BigDecimal> calculateSectorAllocation(List<Stock> stocks) {
        BigDecimal totalValue = stocks.stream()
                .map(Stock::getCurrentValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, BigDecimal> sectorAllocation = new HashMap<>();
        
        for (Stock stock : stocks) {
            String sector = stock.getSector() != null ? stock.getSector() : "Other";
            BigDecimal percentage = totalValue.compareTo(BigDecimal.ZERO) > 0
                    ? stock.getCurrentValue().multiply(new BigDecimal(100)).divide(totalValue, 2, RoundingMode.HALF_UP)
                    : BigDecimal.ZERO;
            sectorAllocation.merge(sector, percentage, BigDecimal::add);
        }

        return sectorAllocation;
    }

    private AnalyticsDTO.StockPerformance toStockPerformance(Stock stock) {
        return AnalyticsDTO.StockPerformance.builder()
                .stockId(stock.getId())
                .symbol(stock.getSymbol())
                .companyName(stock.getCompanyName())
                .quantity(stock.getTotalQuantity())
                .averageBuyPrice(stock.getAverageBuyPrice())
                .currentPrice(stock.getCurrentPrice())
                .totalInvested(stock.getTotalInvested())
                .currentValue(stock.getCurrentValue())
                .profitLoss(stock.getProfitLoss())
                .profitLossPercentage(stock.getProfitLossPercentage())
                .build();
    }
}

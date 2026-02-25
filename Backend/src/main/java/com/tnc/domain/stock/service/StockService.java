package com.tnc.domain.stock.service;

import com.tnc.common.exception.BadRequestException;
import com.tnc.common.exception.ResourceNotFoundException;
import com.tnc.domain.portfolio.entity.Portfolio;
import com.tnc.domain.portfolio.repository.PortfolioRepository;
import com.tnc.domain.portfolio.service.MarketDataService;
import com.tnc.domain.stock.dto.StockDTO;
import com.tnc.domain.stock.entity.Stock;
import com.tnc.domain.stock.repository.StockRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StockService {

    private final StockRepository stockRepository;
    private final PortfolioRepository portfolioRepository;
    private final MarketDataService marketDataService;

    @Transactional(readOnly = true)
    public List<StockDTO.StockResponse> getPortfolioStocks(Long userId, Long portfolioId) {
        
        portfolioRepository.findByIdAndUserId(portfolioId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio not found"));

        return stockRepository.findByPortfolioId(portfolioId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public StockDTO.StockResponse getStock(Long userId, Long portfolioId, Long stockId) {
        
        portfolioRepository.findByIdAndUserId(portfolioId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio not found"));

        Stock stock = stockRepository.findById(stockId)
                .orElseThrow(() -> new ResourceNotFoundException("Stock not found"));

        // Refresh current price
        BigDecimal currentPrice = marketDataService.getCurrentPrice(stock.getSymbol());
        stock.setCurrentPrice(currentPrice);
        stock.setCurrentValue(currentPrice.multiply(new BigDecimal(stock.getTotalQuantity())));
        
        return mapToResponse(stock);
    }

    @Transactional
    public StockDTO.StockResponse addStock(Long userId, Long portfolioId, StockDTO.StockRequest request) {
        
        Portfolio portfolio = portfolioRepository.findByIdAndUserId(portfolioId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio not found"));

        if (stockRepository.existsByPortfolioIdAndSymbol(portfolioId, request.getSymbol().toUpperCase())) {
            throw new BadRequestException("Stock already exists in portfolio");
        }

        Stock stock = new Stock();
        stock.setSymbol(request.getSymbol().toUpperCase());
        stock.setCompanyName(request.getCompanyName());
        stock.setSector(request.getSector());
        stock.setIndustry(request.getIndustry());
        stock.setPortfolio(portfolio);
        stock.setTotalQuantity(0);
        stock.setAverageBuyPrice(BigDecimal.ZERO);
        stock.setTotalInvested(BigDecimal.ZERO);
        stock.setCurrentPrice(marketDataService.getCurrentPrice(request.getSymbol()));
        stock.setCurrentValue(BigDecimal.ZERO);
        stock.setProfitLoss(BigDecimal.ZERO);
        stock.setProfitLossPercentage(BigDecimal.ZERO);

        stock = stockRepository.save(stock);

        return mapToResponse(stock);
    }

    @Transactional
    public StockDTO.StockResponse updateStock(Long userId, Long portfolioId, Long stockId, 
            StockDTO.StockRequest request) {
        
        portfolioRepository.findByIdAndUserId(portfolioId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio not found"));

        Stock stock = stockRepository.findById(stockId)
                .orElseThrow(() -> new ResourceNotFoundException("Stock not found"));

        stock.setCompanyName(request.getCompanyName());
        stock.setSector(request.getSector());
        stock.setIndustry(request.getIndustry());

        stock = stockRepository.save(stock);

        return mapToResponse(stock);
    }

    @Transactional
    public void deleteStock(Long userId, Long portfolioId, Long stockId) {
        
        portfolioRepository.findByIdAndUserId(portfolioId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio not found"));

        Stock stock = stockRepository.findById(stockId)
                .orElseThrow(() -> new ResourceNotFoundException("Stock not found"));

        if (stock.getTotalQuantity() > 0) {
            throw new BadRequestException("Cannot delete stock with holdings. Sell all shares first.");
        }

        stockRepository.delete(stock);
    }

    @Transactional
    public List<StockDTO.StockSummary> getTopGainers(Long userId, Long portfolioId) {
        
        portfolioRepository.findByIdAndUserId(portfolioId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio not found"));

        return stockRepository.findTopByPortfolioIdOrderByProfitLossDesc(portfolioId).stream()
                .filter(s -> s.getProfitLossPercentage().compareTo(BigDecimal.ZERO) > 0)
                .map(this::mapToSummary)
                .collect(Collectors.toList());
    }

    @Transactional
    public List<StockDTO.StockSummary> getTopLosers(Long userId, Long portfolioId) {
        
        portfolioRepository.findByIdAndUserId(portfolioId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio not found"));

        return stockRepository.findTopByPortfolioIdOrderByProfitLossAsc(portfolioId).stream()
                .filter(s -> s.getProfitLossPercentage().compareTo(BigDecimal.ZERO) < 0)
                .map(this::mapToSummary)
                .collect(Collectors.toList());
    }

    @Transactional
    public StockDTO.StockResponse refreshStockPrice(Long userId, Long portfolioId, Long stockId) {
        
        portfolioRepository.findByIdAndUserId(portfolioId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio not found"));

        Stock stock = stockRepository.findById(stockId)
                .orElseThrow(() -> new ResourceNotFoundException("Stock not found"));

        BigDecimal currentPrice = marketDataService.getCurrentPrice(stock.getSymbol());
        stock.setCurrentPrice(currentPrice);
        stock.setCurrentValue(currentPrice.multiply(new BigDecimal(stock.getTotalQuantity())));
        stock.setProfitLoss(stock.getCurrentValue().subtract(stock.getTotalInvested()));
        
        if (stock.getTotalInvested().compareTo(BigDecimal.ZERO) > 0) {
            stock.setProfitLossPercentage(
                stock.getProfitLoss()
                    .multiply(new BigDecimal(100))
                    .divide(stock.getTotalInvested(), 2, RoundingMode.HALF_UP)
            );
        }

        stock = stockRepository.save(stock);

        return mapToResponse(stock);
    }

    private StockDTO.StockResponse mapToResponse(Stock stock) {
        return StockDTO.StockResponse.builder()
                .id(stock.getId())
                .symbol(stock.getSymbol())
                .companyName(stock.getCompanyName())
                .sector(stock.getSector())
                .industry(stock.getIndustry())
                .portfolioId(stock.getPortfolio().getId())
                .totalQuantity(stock.getTotalQuantity())
                .averageBuyPrice(stock.getAverageBuyPrice())
                .totalInvested(stock.getTotalInvested())
                .currentPrice(stock.getCurrentPrice())
                .currentValue(stock.getCurrentValue())
                .profitLoss(stock.getProfitLoss())
                .profitLossPercentage(stock.getProfitLossPercentage())
                .build();
    }

    private StockDTO.StockSummary mapToSummary(Stock stock) {
        return StockDTO.StockSummary.builder()
                .symbol(stock.getSymbol())
                .companyName(stock.getCompanyName())
                .quantity(stock.getTotalQuantity())
                .currentPrice(stock.getCurrentPrice())
                .currentValue(stock.getCurrentValue())
                .profitLoss(stock.getProfitLoss())
                .profitLossPercentage(stock.getProfitLossPercentage())
                .build();
    }
}

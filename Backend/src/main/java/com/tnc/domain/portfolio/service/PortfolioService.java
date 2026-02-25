package com.tnc.domain.portfolio.service;

import com.tnc.common.exception.BadRequestException;
import com.tnc.common.exception.ResourceNotFoundException;
import com.tnc.domain.portfolio.dto.PortfolioDTO;
import com.tnc.domain.portfolio.entity.Portfolio;
import com.tnc.domain.portfolio.repository.PortfolioRepository;
import com.tnc.domain.stock.entity.Stock;
import com.tnc.domain.stock.repository.StockRepository;
import com.tnc.domain.transaction.entity.Transaction;
import com.tnc.domain.transaction.repository.TransactionRepository;
import com.tnc.domain.user.entity.User;
import com.tnc.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PortfolioService {

    private final PortfolioRepository portfolioRepository;
    private final UserRepository userRepository;
    private final StockRepository stockRepository;
    private final TransactionRepository transactionRepository;
    private final MarketDataService marketDataService;

    @Transactional
    public PortfolioDTO.PortfolioResponse createPortfolio(Long userId, PortfolioDTO.PortfolioRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (portfolioRepository.existsByUserIdAndPortfolioName(userId, request.getPortfolioName())) {
            throw new BadRequestException("Portfolio with this name already exists");
        }

        Portfolio portfolio = new Portfolio();
        portfolio.setPortfolioName(request.getPortfolioName());
        portfolio.setDescription(request.getDescription());
        portfolio.setUser(user);
        portfolio.setTotalInvested(BigDecimal.ZERO);
        portfolio.setCurrentValue(BigDecimal.ZERO);

        portfolio = portfolioRepository.save(portfolio);

        return mapToResponse(portfolio);
    }

    @Transactional(readOnly = true)
    public List<PortfolioDTO.PortfolioSummary> getUserPortfolios(Long userId) {
        List<Portfolio> portfolios = portfolioRepository.findByUserId(userId);
        
        return portfolios.stream()
                .map(this::mapToSummary)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PortfolioDTO.PortfolioResponse getPortfolio(Long userId, Long portfolioId) {
        Portfolio portfolio = portfolioRepository.findByIdAndUserId(portfolioId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio not found"));

        return mapToResponse(portfolio);
    }

    @Transactional
    public PortfolioDTO.PortfolioResponse updatePortfolio(Long userId, Long portfolioId, PortfolioDTO.PortfolioRequest request) {
        Portfolio portfolio = portfolioRepository.findByIdAndUserId(portfolioId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio not found"));

        if (!portfolio.getPortfolioName().equals(request.getPortfolioName()) 
                && portfolioRepository.existsByUserIdAndPortfolioName(userId, request.getPortfolioName())) {
            throw new BadRequestException("Portfolio with this name already exists");
        }

        portfolio.setPortfolioName(request.getPortfolioName());
        portfolio.setDescription(request.getDescription());

        portfolio = portfolioRepository.save(portfolio);

        return mapToResponse(portfolio);
    }

    @Transactional
    public void deletePortfolio(Long userId, Long portfolioId) {
        Portfolio portfolio = portfolioRepository.findByIdAndUserId(portfolioId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio not found"));

        portfolioRepository.delete(portfolio);
    }

    @Transactional
    public PortfolioDTO.PortfolioSummary refreshPortfolioPrices(Long userId, Long portfolioId) {
        Portfolio portfolio = portfolioRepository.findByIdAndUserId(portfolioId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio not found"));

        List<Stock> stocks = stockRepository.findByPortfolioId(portfolioId);
        BigDecimal totalCurrentValue = BigDecimal.ZERO;

        for (Stock stock : stocks) {
            BigDecimal currentPrice = marketDataService.getCurrentPrice(stock.getSymbol());
            stock.setCurrentPrice(currentPrice);
            stock.setCurrentValue(currentPrice.multiply(new BigDecimal(stock.getTotalQuantity())));
            stock.setProfitLoss(stock.getCurrentValue().subtract(stock.getTotalInvested()));
            
            if (stock.getTotalInvested().compareTo(BigDecimal.ZERO) > 0) {
                stock.setProfitLossPercentage(
                    stock.getProfitLoss()
                        .multiply(new BigDecimal(100))
                        .divide(stock.getTotalInvested(), 2, java.math.RoundingMode.HALF_UP)
                );
            }
            
            totalCurrentValue = totalCurrentValue.add(stock.getCurrentValue());
        }

        stockRepository.saveAll(stocks);

        portfolio.setCurrentValue(totalCurrentValue);
        portfolio = portfolioRepository.save(portfolio);

        return mapToSummary(portfolio);
    }

    private PortfolioDTO.PortfolioResponse mapToResponse(Portfolio portfolio) {
        List<Stock> stocks = stockRepository.findByPortfolioId(portfolio.getId());
        List<Transaction> transactions = transactionRepository.findByPortfolioId(portfolio.getId());

        BigDecimal profitLoss = portfolio.getCurrentValue().subtract(portfolio.getTotalInvested());
        BigDecimal profitLossPercentage = BigDecimal.ZERO;
        
        if (portfolio.getTotalInvested().compareTo(BigDecimal.ZERO) > 0) {
            profitLossPercentage = profitLoss
                    .multiply(new BigDecimal(100))
                    .divide(portfolio.getTotalInvested(), 2, java.math.RoundingMode.HALF_UP);
        }

        return PortfolioDTO.PortfolioResponse.builder()
                .id(portfolio.getId())
                .portfolioName(portfolio.getPortfolioName())
                .description(portfolio.getDescription())
                .userId(portfolio.getUser().getId())
                .totalInvested(portfolio.getTotalInvested())
                .currentValue(portfolio.getCurrentValue())
                .profitLoss(profitLoss)
                .profitLossPercentage(profitLossPercentage)
                .stockCount(stocks.size())
                .transactionCount(transactions.size())
                .createdAt(portfolio.getCreatedAt())
                .build();
    }

    private PortfolioDTO.PortfolioSummary mapToSummary(Portfolio portfolio) {
        BigDecimal profitLoss = portfolio.getCurrentValue().subtract(portfolio.getTotalInvested());
        BigDecimal profitLossPercentage = BigDecimal.ZERO;
        
        if (portfolio.getTotalInvested().compareTo(BigDecimal.ZERO) > 0) {
            profitLossPercentage = profitLoss
                    .multiply(new BigDecimal(100))
                    .divide(portfolio.getTotalInvested(), 2, java.math.RoundingMode.HALF_UP);
        }

        return PortfolioDTO.PortfolioSummary.builder()
                .id(portfolio.getId())
                .portfolioName(portfolio.getPortfolioName())
                .totalInvested(portfolio.getTotalInvested())
                .currentValue(portfolio.getCurrentValue())
                .profitLoss(profitLoss)
                .profitLossPercentage(profitLossPercentage)
                .build();
    }
}

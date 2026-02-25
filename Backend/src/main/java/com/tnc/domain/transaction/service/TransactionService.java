package com.tnc.domain.transaction.service;

import com.tnc.common.exception.BadRequestException;
import com.tnc.common.exception.ResourceNotFoundException;
import com.tnc.domain.portfolio.entity.Portfolio;
import com.tnc.domain.portfolio.repository.PortfolioRepository;
import com.tnc.domain.portfolio.service.MarketDataService;
import com.tnc.domain.stock.dto.StockDTO;
import com.tnc.domain.stock.entity.Stock;
import com.tnc.domain.stock.repository.StockRepository;
import com.tnc.domain.transaction.dto.TransactionDTO;
import com.tnc.domain.transaction.entity.Transaction;
import com.tnc.domain.transaction.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final PortfolioRepository portfolioRepository;
    private final StockRepository stockRepository;
    private final MarketDataService marketDataService;

    @Transactional
    public TransactionDTO.TransactionResponse createTransaction(Long userId, Long portfolioId, 
            TransactionDTO.TransactionRequest request) {
        
        // Validate portfolio ownership
        Portfolio portfolio = portfolioRepository.findByIdAndUserId(portfolioId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio not found"));

        // Get or create stock
        Stock stock = getOrCreateStock(portfolio, request.getSymbol());

        // Validate sell transaction has sufficient quantity
        if (request.getTransactionType() == Transaction.TransactionType.SELL) {
            validateSufficientQuantity(stock, request.getQuantity());
        }

        // Create transaction
        Transaction transaction = new Transaction();
        transaction.setPortfolio(portfolio);
        transaction.setStock(stock);
        transaction.setTransactionType(request.getTransactionType());
        transaction.setQuantity(request.getQuantity());
        transaction.setPrice(request.getPrice());
        transaction.setBrokerage(request.getBrokerage() != null ? request.getBrokerage() : BigDecimal.ZERO);
        transaction.setTax(request.getTax() != null ? request.getTax() : BigDecimal.ZERO);
        transaction.setTransactionDate(request.getTransactionDate());
        transaction.setNotes(request.getNotes());
        transaction.setIsRealized(false);

        transaction = transactionRepository.save(transaction);

        // Update stock holdings
        updateStockHoldings(stock, request.getTransactionType(), request.getQuantity(), request.getPrice());

        // Update portfolio totals
        updatePortfolioTotals(portfolio);

        return mapToResponse(transaction, stock);
    }

    @Transactional(readOnly = true)
    public Page<TransactionDTO.TransactionResponse> getPortfolioTransactions(Long userId, 
            Long portfolioId, Pageable pageable) {
        
        portfolioRepository.findByIdAndUserId(portfolioId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio not found"));

        return transactionRepository.findByPortfolioId(portfolioId, pageable)
                .map(this::mapToResponseWithStock);
    }

    @Transactional(readOnly = true)
    public List<TransactionDTO.TransactionResponse> getStockTransactions(Long userId, 
            Long portfolioId, Long stockId) {
        
        portfolioRepository.findByIdAndUserId(portfolioId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio not found"));

        return transactionRepository.findByStockId(stockId).stream()
                .map(this::mapToResponseWithStock)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TransactionDTO.TransactionResponse getTransaction(Long userId, Long portfolioId, Long transactionId) {
        
        portfolioRepository.findByIdAndUserId(portfolioId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio not found"));

        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));

        return mapToResponseWithStock(transaction);
    }

    @Transactional
    public TransactionDTO.TransactionResponse updateTransaction(Long userId, Long portfolioId, 
            Long transactionId, TransactionDTO.TransactionUpdateRequest request) {
        
        portfolioRepository.findByIdAndUserId(portfolioId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio not found"));

        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));

        // If quantity or price is being updated, need to recalculate holdings
        if (request.getQuantity() != null || request.getPrice() != null) {
            // This is complex - for simplicity, we'll just update the fields
            // A real implementation would recalculate the entire position
        }

        if (request.getQuantity() != null) {
            transaction.setQuantity(request.getQuantity());
        }
        if (request.getPrice() != null) {
            transaction.setPrice(request.getPrice());
        }
        if (request.getBrokerage() != null) {
            transaction.setBrokerage(request.getBrokerage());
        }
        if (request.getTax() != null) {
            transaction.setTax(request.getTax());
        }
        if (request.getTransactionDate() != null) {
            transaction.setTransactionDate(request.getTransactionDate());
        }
        if (request.getNotes() != null) {
            transaction.setNotes(request.getNotes());
        }

        transaction = transactionRepository.save(transaction);

        return mapToResponseWithStock(transaction);
    }

    @Transactional
    public void deleteTransaction(Long userId, Long portfolioId, Long transactionId) {
        
        Portfolio portfolio = portfolioRepository.findByIdAndUserId(portfolioId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio not found"));

        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));

        // Reverse the transaction effect on holdings
        Stock stock = transaction.getStock();
        if (transaction.getTransactionType() == Transaction.TransactionType.BUY) {
            // Reverse buy = sell (reduce holdings)
            stock.setTotalQuantity(stock.getTotalQuantity() - transaction.getQuantity());
        } else {
            // Reverse sell = buy (increase holdings)
            stock.setTotalQuantity(stock.getTotalQuantity() + transaction.getQuantity());
        }

        stockRepository.save(stock);
        portfolio.getTransactions().remove(transaction);
        
        transactionRepository.delete(transaction);
        updatePortfolioTotals(portfolio);
    }

    private Stock getOrCreateStock(Portfolio portfolio, String symbol) {
        return stockRepository.findByPortfolioIdAndSymbol(portfolio.getId(), symbol.toUpperCase())
                .orElseGet(() -> {
                    Stock newStock = new Stock();
                    newStock.setSymbol(symbol.toUpperCase());
                    newStock.setCompanyName(marketDataService.getStockName(symbol));
                    newStock.setPortfolio(portfolio);
                    newStock.setTotalQuantity(0);
                    newStock.setAverageBuyPrice(BigDecimal.ZERO);
                    newStock.setTotalInvested(BigDecimal.ZERO);
                    newStock.setCurrentPrice(marketDataService.getCurrentPrice(symbol));
                    newStock.setCurrentValue(BigDecimal.ZERO);
                    newStock.setProfitLoss(BigDecimal.ZERO);
                    newStock.setProfitLossPercentage(BigDecimal.ZERO);
                    return stockRepository.save(newStock);
                });
    }

    private void validateSufficientQuantity(Stock stock, Integer sellQuantity) {
        if (stock.getTotalQuantity() < sellQuantity) {
            throw new BadRequestException("Insufficient stock quantity. Available: " + stock.getTotalQuantity());
        }
    }

    private void updateStockHoldings(Stock stock, Transaction.TransactionType type, 
            Integer quantity, BigDecimal price) {
        
        BigDecimal totalCost = price.multiply(new BigDecimal(quantity));
        
        if (type == Transaction.TransactionType.BUY) {
            // Calculate new average buy price
            BigDecimal newTotalQuantity = new BigDecimal(stock.getTotalQuantity() + quantity);
            BigDecimal newTotalInvested = stock.getTotalInvested().add(totalCost);
            
            stock.setTotalQuantity(stock.getTotalQuantity() + quantity);
            stock.setTotalInvested(newTotalInvested);
            stock.setAverageBuyPrice(newTotalInvested.divide(newTotalQuantity, 2, RoundingMode.HALF_UP));
        } else {
            // Sell - reduce quantity but keep average price same
            stock.setTotalQuantity(stock.getTotalQuantity() - quantity);
            
            BigDecimal proportionSold = new BigDecimal(quantity)
                    .divide(new BigDecimal(stock.getTotalQuantity() + quantity), 4, RoundingMode.HALF_UP);
            BigDecimal costReduction = stock.getTotalInvested().multiply(proportionSold);
            stock.setTotalInvested(stock.getTotalInvested().subtract(costReduction));
        }

        // Update current value and P&L
        stock.setCurrentValue(stock.getCurrentPrice().multiply(new BigDecimal(stock.getTotalQuantity())));
        stock.setProfitLoss(stock.getCurrentValue().subtract(stock.getTotalInvested()));
        
        if (stock.getTotalInvested().compareTo(BigDecimal.ZERO) > 0) {
            stock.setProfitLossPercentage(
                stock.getProfitLoss()
                    .multiply(new BigDecimal(100))
                    .divide(stock.getTotalInvested(), 2, RoundingMode.HALF_UP)
            );
        }

        stockRepository.save(stock);
    }

    private void updatePortfolioTotals(Portfolio portfolio) {
        BigDecimal totalInvested = transactionRepository.calculateTotalInvested(portfolio.getId());
        BigDecimal totalSold = transactionRepository.calculateTotalSold(portfolio.getId());
        
        if (totalInvested == null) totalInvested = BigDecimal.ZERO;
        if (totalSold == null) totalSold = BigDecimal.ZERO;
        
        portfolio.setTotalInvested(totalInvested.subtract(totalSold));
        
        // Calculate current value based on holdings
        List<Stock> stocks = stockRepository.findByPortfolioId(portfolio.getId());
        BigDecimal currentValue = stocks.stream()
                .map(Stock::getCurrentValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        portfolio.setCurrentValue(currentValue);
        portfolioRepository.save(portfolio);
    }

    private TransactionDTO.TransactionResponse mapToResponse(Transaction transaction, Stock stock) {
        return TransactionDTO.TransactionResponse.builder()
                .id(transaction.getId())
                .portfolioId(transaction.getPortfolio().getId())
                .stockId(stock.getId())
                .symbol(stock.getSymbol())
                .companyName(stock.getCompanyName())
                .transactionType(transaction.getTransactionType())
                .quantity(transaction.getQuantity())
                .price(transaction.getPrice())
                .totalAmount(transaction.getTotalAmount())
                .brokerage(transaction.getBrokerage())
                .tax(transaction.getTax())
                .transactionDate(transaction.getTransactionDate())
                .notes(transaction.getNotes())
                .isRealized(transaction.getIsRealized())
                .createdAt(transaction.getCreatedAt())
                .build();
    }

    private TransactionDTO.TransactionResponse mapToResponseWithStock(Transaction transaction) {
        Stock stock = transaction.getStock();
        return mapToResponse(transaction, stock);
    }
}

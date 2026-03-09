package com.tnc.service;

import com.tnc.domain.holdings.entity.Holding;
import com.tnc.domain.portfolio.entity.Portfolio;
import com.tnc.domain.transaction.entity.Transaction;
import com.tnc.domain.user.entity.User;
import com.tnc.repository.HoldingRepository;
import com.tnc.repository.PortfolioRepository;
import com.tnc.repository.TransactionRepository;
import com.tnc.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class TransactionsService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HoldingRepository holdingRepository;

    @Autowired
    private PortfolioRepository portfolioRepository;

    @Autowired
    private MarketDataService marketDataService;

    @Autowired
    private WalletClientService walletClientService;

    public List<Transaction> getAllTransactions(String username, String type, Integer limit, Integer offset) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return List.of();
        }
        
        List<Transaction> transactions = transactionRepository.findByUserId(user.getId());
        
        if (type != null && !type.isEmpty()) {
            transactions = transactions.stream()
                    .filter(t -> t.getType().equalsIgnoreCase(type))
                    .toList();
        }
        
        int start = offset != null ? offset : 0;
        int end = limit != null ? Math.min(start + limit, transactions.size()) : transactions.size();
        
        if (start >= transactions.size()) {
            return List.of();
        }
        
        return transactions.subList(start, end);
    }

    public Optional<Transaction> getTransactionById(Long id, String username) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return Optional.empty();
        }
        return transactionRepository.findById(id);
    }

    public Map<String, Object> getWalletSummary(String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));

        walletClientService.ensureWallet(user.getUsername());

        Map<String, Object> wallet = walletClientService.getWalletSummary(user.getUsername());

        Map<String, Object> data = new HashMap<>();
        data.put("balance", wallet.get("balance"));
        data.put("minimumBalance", wallet.get("minimumBalance"));
        data.put("availableToTrade", wallet.get("availableToTrade"));

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Wallet summary retrieved");
        response.put("data", data);
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }

    public Map<String, Object> addMoneyToWallet(String username, double amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Amount must be greater than zero");
        }

        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));

        walletClientService.ensureWallet(user.getUsername());
        walletClientService.credit(user.getUsername(), amount);
        Map<String, Object> wallet = walletClientService.getWalletSummary(user.getUsername());

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Wallet funded successfully");
        response.put("data", wallet);
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }

    @Transactional
    public Transaction createTransaction(Transaction transaction, String username) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        validateTradeRequest(transaction);
        
        transaction.setUser(user);
        
        // Set order type default
        if (transaction.getOrderType() == null || transaction.getOrderType().isEmpty()) {
            transaction.setOrderType("MARKET");
        }
        
        // Set status default
        if (transaction.getStatus() == null || transaction.getStatus().isEmpty()) {
            transaction.setStatus("EXECUTED");
        }
        
        // Handle different order types
        String orderType = transaction.getOrderType();
        
        if ("MARKET".equals(orderType)) {
            // Market order - execute immediately at current price
            MarketDataService.StockData stock = marketDataService.getStockPrice(transaction.getSymbol());
            if (stock == null) {
                throw new RuntimeException("Unable to fetch live price for " + transaction.getSymbol());
            }
            transaction.setPrice(stock.getPrice());
        } else if ("LIMIT".equals(orderType)) {
            // Limit order - execute only at specified price or better
            if (transaction.getLimitPrice() == null) {
                throw new RuntimeException("Limit price required for limit order");
            }
            transaction.setPrice(transaction.getLimitPrice());
        } else if ("STOP_LOSS".equals(orderType)) {
            // Stop loss order - execute when price reaches stop price
            if (transaction.getStopPrice() == null) {
                throw new RuntimeException("Stop price required for stop loss order");
            }
            // For now, execute at market
            MarketDataService.StockData stock = marketDataService.getStockPrice(transaction.getSymbol());
            if (stock != null) {
                transaction.setPrice(stock.getPrice());
            }
        } else if ("STOP_LIMIT".equals(orderType)) {
            // Stop limit order - combination of stop loss and limit
            if (transaction.getStopPrice() == null || transaction.getLimitPrice() == null) {
                throw new RuntimeException("Stop price and limit price required for stop limit order");
            }
            MarketDataService.StockData stock = marketDataService.getStockPrice(transaction.getSymbol());
            if (stock != null) {
                transaction.setPrice(stock.getPrice());
            }
        }
        
        // Set transaction date/time
        if (transaction.getTransactionDate() == null) {
            transaction.setTransactionDate(new Date());
        }
        transaction.setTransactionTime(new Date());

        if ("SELL".equalsIgnoreCase(transaction.getType())) {
            validateSellInventory(user, transaction.getSymbol(), transaction.getQuantity());
        }
        
        Transaction savedTransaction = transactionRepository.save(transaction);
        
        // Update holdings if order is executed
        if ("EXECUTED".equals(savedTransaction.getStatus())) {
            updateHoldingsAfterTransaction(savedTransaction, user);
        }
        
        return savedTransaction;
    }

    @Transactional
    public Transaction placeAdvancedOrder(Transaction transaction, String username) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        validateTradeRequest(transaction);
        
        transaction.setUser(user);
        transaction.setStatus("PENDING");
        
        // Calculate execution based on order type
        String orderType = transaction.getOrderType();
        MarketDataService.StockData stock = marketDataService.getStockPrice(transaction.getSymbol());
        
        if (stock == null) {
            transaction.setStatus("FAILED");
            return transactionRepository.save(transaction);
        }
        
        boolean shouldExecute = false;
        double executionPrice = stock.getPrice();
        
        switch (orderType) {
            case "MARKET":
                shouldExecute = true;
                executionPrice = stock.getPrice();
                break;
                
            case "LIMIT":
                // Execute if current price is at or better than limit price
                double limitPrice = transaction.getLimitPrice();
                if ("BUY".equalsIgnoreCase(transaction.getType())) {
                    shouldExecute = executionPrice <= limitPrice;
                } else {
                    shouldExecute = executionPrice >= limitPrice;
                }
                break;
                
            case "STOP_LOSS":
                // Execute when stop price is triggered
                double stopPrice = transaction.getStopPrice();
                if ("BUY".equalsIgnoreCase(transaction.getType())) {
                    shouldExecute = executionPrice >= stopPrice;
                } else {
                    shouldExecute = executionPrice <= stopPrice;
                }
                break;
                
            case "STOP_LIMIT":
                // Combination - execute when stop triggered, then at limit or better
                double stop = transaction.getStopPrice();
                double limit = transaction.getLimitPrice();
                boolean stopTriggered = ("BUY".equalsIgnoreCase(transaction.getType())) 
                    ? executionPrice >= stop : executionPrice <= stop;
                if (stopTriggered) {
                    if ("BUY".equalsIgnoreCase(transaction.getType())) {
                        shouldExecute = executionPrice <= limit;
                    } else {
                        shouldExecute = executionPrice >= limit;
                    }
                }
                break;
                
            default:
                shouldExecute = true;
        }
        
        transaction.setPrice(executionPrice);
        
        if (shouldExecute) {
            if ("SELL".equalsIgnoreCase(transaction.getType())) {
                validateSellInventory(user, transaction.getSymbol(), transaction.getQuantity());
            }
            transaction.setStatus("EXECUTED");
            Transaction saved = transactionRepository.save(transaction);
            updateHoldingsAfterTransaction(saved, user);
            return saved;
        } else {
            // Keep as pending - would need a scheduler to check periodically
            return transactionRepository.save(transaction);
        }
    }

    private void updateHoldingsAfterTransaction(Transaction transaction, User user) {
        String symbol = transaction.getSymbol();
        String type = transaction.getType().toUpperCase();
        double quantity = transaction.getQuantity();
        double price = transaction.getPrice();
        double transactionAmount = quantity * price;
        
        Portfolio portfolio = getOrCreateDefaultPortfolio(user);
        
        List<Holding> userHoldings = holdingRepository.findByUserId(user.getId());
        Optional<Holding> existingHolding = userHoldings.stream()
                .filter(h -> h.getSymbol().equalsIgnoreCase(symbol))
                .findFirst();
        
        if ("BUY".equals(type)) {
            walletClientService.debit(user.getUsername(), transactionAmount);

            if (existingHolding.isPresent()) {
                Holding holding = existingHolding.get();
                double currentValue = holding.getQuantity() * holding.getAverageCost();
                double newValue = quantity * price;
                double totalQuantity = holding.getQuantity() + quantity;
                double newAverageCost = (currentValue + newValue) / totalQuantity;
                
                holding.setQuantity(totalQuantity);
                holding.setAverageCost(newAverageCost);
                holding.setTotalCost(totalQuantity * newAverageCost);
                
                MarketDataService.StockData stock = marketDataService.getStockPrice(symbol);
                if (stock != null) {
                    holding.setCurrentPrice(stock.getPrice());
                    holding.setCurrentValue(totalQuantity * stock.getPrice());
                    holding.setProfitLoss(holding.getCurrentValue() - holding.getTotalCost());
                    if (holding.getTotalCost() > 0) {
                        holding.setProfitLossPercentage((holding.getProfitLoss() / holding.getTotalCost()) * 100);
                    }
                }
                
                holdingRepository.save(holding);
            } else {
                Holding newHolding = new Holding();
                newHolding.setUser(user);
                newHolding.setPortfolio(portfolio);
                newHolding.setSymbol(symbol);
                newHolding.setQuantity(quantity);
                newHolding.setAverageCost(price);
                newHolding.setTotalCost(quantity * price);
                
                MarketDataService.StockData stock = marketDataService.getStockPrice(symbol);
                if (stock != null) {
                    newHolding.setCurrentPrice(stock.getPrice());
                    newHolding.setCurrentValue(quantity * stock.getPrice());
                    newHolding.setProfitLoss(newHolding.getCurrentValue() - newHolding.getTotalCost());
                    if (newHolding.getTotalCost() > 0) {
                        newHolding.setProfitLossPercentage((newHolding.getProfitLoss() / newHolding.getTotalCost()) * 100);
                    }
                }
                
                holdingRepository.save(newHolding);
            }
        } else if ("SELL".equals(type)) {
            if (existingHolding.isPresent()) {
                Holding holding = existingHolding.get();

                if (quantity > holding.getQuantity()) {
                    throw new IllegalArgumentException("Insufficient quantity in holdings for sell transaction.");
                }

                double newQuantity = holding.getQuantity() - quantity;
                
                if (newQuantity <= 0) {
                    holdingRepository.delete(holding);
                } else {
                    holding.setQuantity(newQuantity);
                    holding.setTotalCost(newQuantity * holding.getAverageCost());
                    
                    MarketDataService.StockData stock = marketDataService.getStockPrice(symbol);
                    if (stock != null) {
                        holding.setCurrentPrice(stock.getPrice());
                        holding.setCurrentValue(newQuantity * stock.getPrice());
                        holding.setProfitLoss(holding.getCurrentValue() - holding.getTotalCost());
                        if (holding.getTotalCost() > 0) {
                            holding.setProfitLossPercentage((holding.getProfitLoss() / holding.getTotalCost()) * 100);
                        }
                    }
                    
                    holdingRepository.save(holding);
                }
                walletClientService.credit(user.getUsername(), transactionAmount);
            } else {
                throw new IllegalArgumentException("Cannot sell a stock you do not currently hold.");
            }
        }
    }

    private void validateTradeRequest(Transaction transaction) {
        if (transaction.getSymbol() == null || transaction.getSymbol().trim().isEmpty()) {
            throw new IllegalArgumentException("Symbol is required");
        }
        if (transaction.getType() == null || transaction.getType().trim().isEmpty()) {
            throw new IllegalArgumentException("Transaction type is required");
        }
        if (transaction.getQuantity() <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than zero");
        }

        String normalizedType = transaction.getType().toUpperCase();
        if (!"BUY".equals(normalizedType) && !"SELL".equals(normalizedType)) {
            throw new IllegalArgumentException("Transaction type must be BUY or SELL");
        }
    }

    private void validateSellInventory(User user, String symbol, double quantityToSell) {
        List<Holding> userHoldings = holdingRepository.findByUserId(user.getId());
        Optional<Holding> existingHolding = userHoldings.stream()
            .filter(h -> h.getSymbol().equalsIgnoreCase(symbol))
            .findFirst();

        if (existingHolding.isEmpty()) {
            throw new IllegalArgumentException("Cannot sell a stock you do not currently hold.");
        }

        if (quantityToSell > existingHolding.get().getQuantity()) {
            throw new IllegalArgumentException("Insufficient quantity in holdings for sell transaction.");
        }
    }

    private Portfolio getOrCreateDefaultPortfolio(User user) {
        List<Portfolio> portfolios = portfolioRepository.findByUserId(user.getId());
        for (Portfolio p : portfolios) {
            if (p.getIsDefault() != null && p.getIsDefault()) {
                return p;
            }
        }
        
        Portfolio defaultPortfolio = new Portfolio();
        defaultPortfolio.setName("Default Portfolio");
        defaultPortfolio.setDescription("Auto-created default portfolio");
        defaultPortfolio.setIsDefault(true);
        defaultPortfolio.setUser(user);
        defaultPortfolio.setTotalValue(0.0);
        defaultPortfolio.setTotalCost(0.0);
        defaultPortfolio.setTotalProfitLoss(0.0);
        defaultPortfolio.setCreatedAt(new Date());
        return portfolioRepository.save(defaultPortfolio);
    }
}

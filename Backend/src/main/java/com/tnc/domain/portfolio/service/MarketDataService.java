package com.tnc.domain.portfolio.service;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

/**
 * Mock Market Data Service for Indian Stocks
 * In production, this would integrate with NSE India API or other stock APIs
 */
@Service
public class MarketDataService {

    // Mock stock prices for popular Indian stocks
    private static final Map<String, BigDecimal> MOCK_STOCK_PRICES = new HashMap<>();
    private static final Map<String, String> STOCK_NAMES = new HashMap<>();
    
    private final Random random = new Random();

    static {
        // Popular Indian NSE stocks with mock prices
        MOCK_STOCK_PRICES.put("RELIANCE", new BigDecimal("2850.00"));
        MOCK_STOCK_PRICES.put("TCS", new BigDecimal("3200.00"));
        MOCK_STOCK_PRICES.put("INFY", new BigDecimal("1450.00"));
        MOCK_STOCK_PRICES.put("HDFCBANK", new BigDecimal("1680.00"));
        MOCK_STOCK_PRICES.put("ICICIBANK", new BigDecimal("980.00"));
        MOCK_STOCK_PRICES.put("WIPRO", new BigDecimal("420.00"));
        MOCK_STOCK_PRICES.put("HINDUNILVR", new BigDecimal("2650.00"));
        MOCK_STOCK_PRICES.put("ITC", new BigDecimal("380.00"));
        MOCK_STOCK_PRICES.put("SBIN", new BigDecimal("580.00"));
        MOCK_STOCK_PRICES.put("BAJFINANCE", new BigDecimal("1850.00"));
        MOCK_STOCK_PRICES.put("MARUTI", new BigDecimal("9800.00"));
        MOCK_STOCK_PRICES.put("SUNPHARMA", new BigDecimal("1450.00"));
        MOCK_STOCK_PRICES.put("TITAN", new BigDecimal("3200.00"));
        MOCK_STOCK_PRICES.put("ADANIPORTS", new BigDecimal("1250.00"));
        MOCK_STOCK_PRICES.put("ASIANPAINT", new BigDecimal("3100.00"));
        
        // Stock names
        STOCK_NAMES.put("RELIANCE", "Reliance Industries Ltd");
        STOCK_NAMES.put("TCS", "Tata Consultancy Services Ltd");
        STOCK_NAMES.put("INFY", "Infosys Ltd");
        STOCK_NAMES.put("HDFCBANK", "HDFC Bank Ltd");
        STOCK_NAMES.put("ICICIBANK", "ICICI Bank Ltd");
        STOCK_NAMES.put("WIPRO", "Wipro Ltd");
        STOCK_NAMES.put("HINDUNILVR", "Hindustan Unilever Ltd");
        STOCK_NAMES.put("ITC", "ITC Ltd");
        STOCK_NAMES.put("SBIN", "State Bank of India");
        STOCK_NAMES.put("BAJFINANCE", "Bajaj Finance Ltd");
        STOCK_NAMES.put("MARUTI", "Maruti Suzuki India Ltd");
        STOCK_NAMES.put("SUNPHARMA", "Sun Pharmaceutical Industries Ltd");
        STOCK_NAMES.put("TITAN", "Titan Company Ltd");
        STOCK_NAMES.put("ADANIPORTS", "Adani Ports and Special Economic Zone Ltd");
        STOCK_NAMES.put("ASIANPAINT", "Asian Paints Ltd");
    }

    /**
     * Get current price for a stock symbol
     * Returns mock price with slight random variation for demonstration
     */
    public BigDecimal getCurrentPrice(String symbol) {
        BigDecimal basePrice = MOCK_STOCK_PRICES.get(symbol.toUpperCase());
        
        if (basePrice == null) {
            // Return a default price for unknown stocks
            return new BigDecimal("500.00");
        }
        
        // Add small random variation (±2%) to simulate real-time changes
        double variation = 1 + (random.nextDouble() * 0.04 - 0.02);
        return basePrice.multiply(BigDecimal.valueOf(variation))
                .setScale(2, java.math.RoundingMode.HALF_UP);
    }

    /**
     * Get stock name for a symbol
     */
    public String getStockName(String symbol) {
        return STOCK_NAMES.getOrDefault(symbol.toUpperCase(), symbol);
    }

    /**
     * Check if a stock symbol is valid/known
     */
    public boolean isValidStock(String symbol) {
        return MOCK_STOCK_PRICES.containsKey(symbol.toUpperCase());
    }

    /**
     * Get all available mock stocks
     */
    public Map<String, BigDecimal> getAllStockPrices() {
        Map<String, BigDecimal> prices = new HashMap<>();
        MOCK_STOCK_PRICES.forEach((symbol, price) -> {
            double variation = 1 + (random.nextDouble() * 0.04 - 0.02);
            prices.put(symbol, price.multiply(BigDecimal.valueOf(variation))
                    .setScale(2, java.math.RoundingMode.HALF_UP));
        });
        return prices;
    }

    /**
     * Get stock info with price
     */
    public StockInfo getStockInfo(String symbol) {
        return new StockInfo(
            symbol.toUpperCase(),
            getStockName(symbol),
            getCurrentPrice(symbol)
        );
    }

    public record StockInfo(String symbol, String name, BigDecimal price) {}
}

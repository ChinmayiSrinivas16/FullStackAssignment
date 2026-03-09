package com.tnc.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class MarketDataService {

    @Value("${market.data.base.url:http://localhost:7666}")
    private String marketDataBaseUrl;

    private final HttpClient httpClient = HttpClient.newHttpClient();

    // Fallback local cache (used if mock server isn't reachable)
    private final Map<String, StockData> stockDatabase = new ConcurrentHashMap<>();

    public MarketDataService() {
        // Initialize with Indian NSE/BSE stock data
        stockDatabase.put("RELIANCE", new StockData("RELIANCE", "Reliance Industries Ltd.", 2500.0, 16900000000000L, 25.0, 2750.0, 2200.0, 0.35));
        stockDatabase.put("TCS", new StockData("TCS", "Tata Consultancy Services Ltd.", 3200.0, 11700000000000L, 28.0, 3600.0, 3000.0, 1.2));
        stockDatabase.put("INFY", new StockData("INFY", "Infosys Ltd.", 1400.0, 5800000000000L, 22.0, 1600.0, 1200.0, 2.5));
        stockDatabase.put("HDFCBANK", new StockData("HDFCBANK", "HDFC Bank Ltd.", 1600.0, 8900000000000L, 18.5, 1800.0, 1400.0, 1.1));
        stockDatabase.put("ICICIBANK", new StockData("ICICIBANK", "ICICI Bank Ltd.", 900.0, 6300000000000L, 16.0, 1050.0, 800.0, 0.8));
        stockDatabase.put("SBIN", new StockData("SBIN", "State Bank of India", 600.0, 5300000000000L, 10.0, 700.0, 500.0, 1.5));
        stockDatabase.put("BHARTIARTL", new StockData("BHARTIARTL", "Bharti Airtel Ltd.", 800.0, 4500000000000L, 30.0, 950.0, 700.0, 0.5));
        stockDatabase.put("HCLTECH", new StockData("HCLTECH", "HCL Technologies Ltd.", 1100.0, 2900000000000L, 20.0, 1250.0, 950.0, 3.0));
        stockDatabase.put("WIPRO", new StockData("WIPRO", "Wipro Ltd.", 450.0, 2300000000000L, 19.0, 520.0, 380.0, 1.8));
        stockDatabase.put("ITC", new StockData("ITC", "ITC Ltd.", 430.0, 5400000000000L, 24.0, 500.0, 380.0, 3.2));
        stockDatabase.put("ADANIPORTS", new StockData("ADANIPORTS", "Adani Ports & SEZ Ltd.", 1200.0, 2600000000000L, 35.0, 1400.0, 900.0, 0.4));
        stockDatabase.put("ASIANPAINT", new StockData("ASIANPAINT", "Asian Paints Ltd.", 2800.0, 2700000000000L, 55.0, 3200.0, 2500.0, 0.7));
        stockDatabase.put("AXISBANK", new StockData("AXISBANK", "Axis Bank Ltd.", 950.0, 2900000000000L, 14.0, 1100.0, 800.0, 0.1));
        stockDatabase.put("BAJFINANCE", new StockData("BAJFINANCE", "Bajaj Finance Ltd.", 6500.0, 4000000000000L, 30.0, 7500.0, 5800.0, 0.3));
        stockDatabase.put("BAJAJFINSV", new StockData("BAJAJFINSV", "Bajaj Finserv Ltd.", 1500.0, 2400000000000L, 28.0, 1700.0, 1300.0, 0.1));
        stockDatabase.put("TITAN", new StockData("TITAN", "Titan Company Ltd.", 3000.0, 2600000000000L, 60.0, 3500.0, 2600.0, 0.4));
        stockDatabase.put("KOTAKBANK", new StockData("KOTAKBANK", "Kotak Mahindra Bank Ltd.", 1750.0, 3400000000000L, 20.0, 1950.0, 1550.0, 0.1));
        stockDatabase.put("LT", new StockData("LT", "Larsen & Toubro Ltd.", 2300.0, 3200000000000L, 27.0, 2600.0, 2000.0, 0.9));
        stockDatabase.put("MARUTI", new StockData("MARUTI", "Maruti Suzuki India Ltd.", 10500.0, 3100000000000L, 26.0, 12000.0, 9000.0, 0.8));
        stockDatabase.put("TATAMOTORS", new StockData("TATAMOTORS", "Tata Motors Ltd.", 650.0, 2400000000000L, 8.0, 800.0, 500.0, 0.3));
    }
    
    public List<StockData> getAllStocks() {
        List<StockData> stocks = new ArrayList<>();
        for (Map.Entry<String, StockData> entry : stockDatabase.entrySet()) {
            StockData base = entry.getValue();
            // Get live price
            StockData live = getStockPrice(entry.getKey());
            double price = live != null ? live.getPrice() : base.getPrice();
            stocks.add(new StockData(
                entry.getKey(),
                base.getName(),
                price,
                base.getMarketCap(),
                base.getPeRatio(),
                base.getWeek52High(),
                base.getWeek52Low(),
                base.getDividendYield()
            ));
        }
        return stocks;
    }
    
    public StockData getStockPrice(String symbol) {
        if (symbol == null || symbol.isBlank()) {
            return null;
        }

        String normalized = symbol.toUpperCase(Locale.ROOT);

        // Primary source: mock market-data server
        try {
            StockData fromMock = fetchFromMockServer(normalized);
            if (fromMock != null) {
                return fromMock;
            }
        } catch (Exception ignored) {
            // fall back to local cache
        }

        // Fallback: local cache with slight random variation
        StockData base = stockDatabase.get(normalized);
        if (base == null) {
            return null;
        }

        double variation = (Math.random() - 0.5) * 0.02; // +/- 1% variation
        double newPrice = base.getPrice() * (1 + variation);

        return new StockData(
            normalized,
            base.getName(),
            Math.round(newPrice * 100.0) / 100.0,
            base.getMarketCap(),
            base.getPeRatio(),
            base.getWeek52High(),
            base.getWeek52Low(),
            base.getDividendYield()
        );
    }

    public MockQuote fetchQuote(String symbol) throws IOException, InterruptedException {
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(marketDataBaseUrl + "/market/" + symbol))
            .GET()
            .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            return null;
        }

        String body = response.body();
        if (body == null || body.isBlank()) {
            return null;
        }

        // Minimal JSON parsing (avoid adding new dependencies):
        // expected shape: {"success":true,"data":{"symbol":"TCS","name":"...","current_price":3200.12,...}}
        String name = extractJsonString(body, "\"name\"");
        Double currentPrice = extractJsonNumber(body, "\"current_price\"");
        Double change = extractJsonNumber(body, "\"change\"");
        Double changePercent = extractJsonNumber(body, "\"change_percent\"");
        String timestamp = extractJsonString(body, "\"timestamp\"");

        if (name == null || currentPrice == null) {
            return null;
        }

        return new MockQuote(
            symbol,
            name,
            Math.round(currentPrice * 100.0) / 100.0,
            change != null ? change : 0.0,
            changePercent != null ? changePercent : 0.0,
            timestamp
        );
    }

    public StockData fetchFromMockServer(String symbol) throws IOException, InterruptedException {
        MockQuote quote = fetchQuote(symbol);
        if (quote == null) {
            return null;
        }

        // Reuse fundamentals from local cache (marketCap/PE/52W/divYield) if present, else default to 0.
        StockData base = stockDatabase.get(symbol);

        return new StockData(
            symbol,
            quote.name,
            quote.currentPrice,
            base != null ? base.getMarketCap() : 0L,
            base != null ? base.getPeRatio() : 0.0,
            base != null ? base.getWeek52High() : 0.0,
            base != null ? base.getWeek52Low() : 0.0,
            base != null ? base.getDividendYield() : 0.0
        );
    }

    public static class MockQuote {
        public final String symbol;
        public final String name;
        public final double currentPrice;
        public final double change;
        public final double changePercent;
        public final String timestamp;

        public MockQuote(String symbol, String name, double currentPrice, double change, double changePercent, String timestamp) {
            this.symbol = symbol;
            this.name = name;
            this.currentPrice = currentPrice;
            this.change = change;
            this.changePercent = changePercent;
            this.timestamp = timestamp;
        }
    }

    private static String extractJsonString(String json, String key) {
        int keyIndex = json.indexOf(key);
        if (keyIndex < 0) return null;
        int colon = json.indexOf(':', keyIndex);
        if (colon < 0) return null;
        int firstQuote = json.indexOf('"', colon + 1);
        if (firstQuote < 0) return null;
        int secondQuote = json.indexOf('"', firstQuote + 1);
        if (secondQuote < 0) return null;
        return json.substring(firstQuote + 1, secondQuote);
    }

    private static Double extractJsonNumber(String json, String key) {
        int keyIndex = json.indexOf(key);
        if (keyIndex < 0) return null;
        int colon = json.indexOf(':', keyIndex);
        if (colon < 0) return null;

        int i = colon + 1;
        while (i < json.length() && Character.isWhitespace(json.charAt(i))) i++;

        int start = i;
        while (i < json.length()) {
            char c = json.charAt(i);
            if ((c >= '0' && c <= '9') || c == '.' || c == '-' || c == '+') {
                i++;
            } else {
                break;
            }
        }
        if (start == i) return null;

        try {
            return Double.parseDouble(json.substring(start, i));
        } catch (NumberFormatException e) {
            return null;
        }
    }
    
    public StockData getStockInfo(String symbol) {
        return stockDatabase.get(symbol.toUpperCase());
    }
    
    public static class StockData {
        private String symbol;
        private String name;
        private double price;
        private long marketCap;
        private double peRatio;
        private double week52High;
        private double week52Low;
        private double dividendYield;
        
        public StockData(String symbol, String name, double price, long marketCap, 
                        double peRatio, double week52High, double week52Low, double dividendYield) {
            this.symbol = symbol;
            this.name = name;
            this.price = price;
            this.marketCap = marketCap;
            this.peRatio = peRatio;
            this.week52High = week52High;
            this.week52Low = week52Low;
            this.dividendYield = dividendYield;
        }
        
        // Getters
        public String getSymbol() { return symbol; }
        public String getName() { return name; }
        public double getPrice() { return price; }
        public long getMarketCap() { return marketCap; }
        public double getPeRatio() { return peRatio; }
        public double getWeek52High() { return week52High; }
        public double getWeek52Low() { return week52Low; }
        public double getDividendYield() { return dividendYield; }
    }
}

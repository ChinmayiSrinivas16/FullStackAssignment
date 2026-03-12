package com.tnc.controller;

import com.tnc.domain.market.entity.MarketDataHistory;
import com.tnc.service.MarketDataHistoryService;
import com.tnc.service.MarketDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.tnc.service.MarketDataService;

import java.util.*;

@RestController
@RequestMapping("/market")
@CrossOrigin(
    origins = {"http://stockfolio.duckdns.org", "https://stockfolio.duckdns.org", "http://localhost"}
)
public class MarketDataController {

    @Autowired
    private MarketDataService marketDataService;

    @Autowired
    private MarketDataHistoryService marketDataHistoryService;

    @GetMapping("/stocks")
    public ResponseEntity<?> getAllStocks() {
        Map<String, Object> response = new HashMap<>();
        List<Map<String, Object>> stocks = new ArrayList<>();
        
        List<MarketDataService.StockData> allStocks = marketDataService.getAllStocks();
        for (MarketDataService.StockData stock : allStocks) {
            Map<String, Object> stockMap = new HashMap<>();
            stockMap.put("symbol", stock.getSymbol());
            stockMap.put("name", stock.getName());
            stockMap.put("price", stock.getPrice());
            stocks.add(stockMap);
        }
        
        response.put("success", true);
        response.put("message", "All stocks retrieved");
        response.put("data", stocks);
        response.put("timestamp", System.currentTimeMillis());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchStocks(@RequestParam String query) {
        Map<String, Object> response = new HashMap<>();
        List<Map<String, Object>> stocks = new ArrayList<>();
        
        List<MarketDataService.StockData> allStocks = marketDataService.getAllStocks();
        String searchQuery = query.toUpperCase();
        
        for (MarketDataService.StockData stock : allStocks) {
            if (stock.getSymbol().contains(searchQuery) || 
                stock.getName().toUpperCase().contains(searchQuery)) {
                Map<String, Object> stockMap = new HashMap<>();
                stockMap.put("symbol", stock.getSymbol());
                stockMap.put("name", stock.getName());
                stockMap.put("price", stock.getPrice());
                stocks.add(stockMap);
            }
        }
        
        response.put("success", true);
        response.put("message", "Search results");
        response.put("data", stocks);
        response.put("timestamp", System.currentTimeMillis());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/price/{symbol}")
    public ResponseEntity<?> getStockPrice(@PathVariable String symbol) {
        Map<String, Object> response = new HashMap<>();
        MarketDataService.StockData stock = marketDataService.getStockPrice(symbol);
        
        if (stock == null) {
            response.put("success", false);
            response.put("message", "Stock not found");
            return ResponseEntity.badRequest().body(response);
        }
        
        response.put("success", true);
        response.put("message", "Stock price retrieved");
        
        Map<String, Object> data = new HashMap<>();
        data.put("symbol", stock.getSymbol());
        data.put("price", stock.getPrice());

        double change = 0.0;
        double changePercent = 0.0;
        try {
            MarketDataService.MockQuote quote = marketDataService.fetchQuote(symbol.toUpperCase());
            if (quote != null) {
                change = quote.change;
                changePercent = quote.changePercent;
            }
        } catch (Exception ignored) {
        }

        data.put("change", change);
        data.put("changePercent", changePercent);
        data.put("timestamp", System.currentTimeMillis());
        response.put("data", data);
        response.put("timestamp", System.currentTimeMillis());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/info/{symbol}")
    public ResponseEntity<?> getStockInfo(@PathVariable String symbol) {
        Map<String, Object> response = new HashMap<>();
        MarketDataService.StockData stock = marketDataService.getStockInfo(symbol);
        
        if (stock == null) {
            response.put("success", false);
            response.put("message", "Stock not found");
            return ResponseEntity.badRequest().body(response);
        }
        
        response.put("success", true);
        response.put("message", "Stock info retrieved");
        
        Map<String, Object> data = new HashMap<>();
        data.put("symbol", stock.getSymbol());
        data.put("name", stock.getName());
        data.put("price", stock.getPrice());
        data.put("marketCap", stock.getMarketCap());
        data.put("peRatio", stock.getPeRatio());
        data.put("52WeekHigh", stock.getWeek52High());
        data.put("52WeekLow", stock.getWeek52Low());
        data.put("dividendYield", stock.getDividendYield());
        response.put("data", data);
        response.put("timestamp", System.currentTimeMillis());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/history/{symbol}")
    public ResponseEntity<?> getStockHistory(@PathVariable String symbol, 
            @RequestParam(defaultValue = "60") int limit) {
        Map<String, Object> response = new HashMap<>();
        
        List<MarketDataHistory> history = marketDataHistoryService.getHistory(symbol.toUpperCase(), limit);
        
        List<Map<String, Object>> data = new ArrayList<>();
        for (MarketDataHistory h : history) {
            Map<String, Object> point = new HashMap<>();
            point.put("id", h.getId());
            point.put("symbol", h.getSymbol());
            point.put("name", h.getName());
            point.put("openPrice", h.getOpenPrice());
            point.put("highPrice", h.getHighPrice());
            point.put("lowPrice", h.getLowPrice());
            point.put("closePrice", h.getClosePrice());
            point.put("volume", h.getVolume());
            point.put("previousClose", h.getPreviousClose());
            point.put("change", h.getChange());
            point.put("changePercent", h.getChangePercent());
            point.put("recordedAt", h.getRecordedAt());
            data.add(point);
        }
        
        response.put("success", true);
        response.put("message", "History retrieved");
        response.put("data", data);
        response.put("timestamp", System.currentTimeMillis());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/chart/{symbol}")
    public ResponseEntity<?> getChartData(@PathVariable String symbol,
            @RequestParam(defaultValue = "60") int limit) {
        Map<String, Object> response = new HashMap<>();
        
        List<MarketDataHistory> history = marketDataHistoryService.getHistory(symbol.toUpperCase(), limit);
        
        // Reverse to get chronological order
        Collections.reverse(history);
        
        List<Map<String, Object>> data = new ArrayList<>();
        for (MarketDataHistory h : history) {
            Map<String, Object> point = new HashMap<>();
            point.put("time", h.getRecordedAt().toString());
            point.put("price", h.getClosePrice());
            point.put("volume", h.getVolume());
            data.add(point);
        }
        
        response.put("success", true);
        response.put("message", "Chart data retrieved");
        response.put("data", data);
        response.put("timestamp", System.currentTimeMillis());
        
        return ResponseEntity.ok(response);
    }
}

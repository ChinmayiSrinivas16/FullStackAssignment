package com.tnc.domain.marketdata.service;

import com.tnc.domain.marketdata.dto.PriceQuoteDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Slf4j
@Service
public class PriceCacheService {

    private static final long CACHE_VALIDITY_MINUTES = 5;
    private final Map<String, CachedPrice> priceCache = new HashMap<>();

    public void cache(PriceQuoteDTO quote) {
        priceCache.put(quote.getSymbol(), new CachedPrice(quote, LocalDateTime.now()));
        log.debug("Cached price for {}: {}", quote.getSymbol(), quote.getPrice());
    }

    public void cacheAll(List<PriceQuoteDTO> quotes) {
        LocalDateTime now = LocalDateTime.now();
        quotes.forEach(quote -> priceCache.put(quote.getSymbol(), new CachedPrice(quote, now)));
        log.debug("Cached {} prices", quotes.size());
    }

    public Optional<PriceQuoteDTO> get(String symbol) {
        CachedPrice cached = priceCache.get(symbol);
        if (cached == null) {
            return Optional.empty();
        }
        if (isExpired(cached.timestamp)) {
            priceCache.remove(symbol);
            return Optional.empty();
        }
        return Optional.of(cached.quote);
    }

    public List<PriceQuoteDTO> getAll(List<String> symbols) {
        List<PriceQuoteDTO> quotes = new ArrayList<>();
        List<String> expiredSymbols = new ArrayList<>();

        for (String symbol : symbols) {
            Optional<PriceQuoteDTO> cached = get(symbol);
            cached.ifPresentOrElse(quotes::add, () -> expiredSymbols.add(symbol));
        }

        if (!expiredSymbols.isEmpty()) {
            log.debug("Cache miss for symbols: {}", expiredSymbols);
        }

        return quotes;
    }

    public void clear() {
        priceCache.clear();
        log.info("Price cache cleared");
    }

    private boolean isExpired(LocalDateTime cachedTime) {
        return ChronoUnit.MINUTES.between(cachedTime, LocalDateTime.now()) >= CACHE_VALIDITY_MINUTES;
    }

    private static class CachedPrice {
        PriceQuoteDTO quote;
        LocalDateTime timestamp;

        CachedPrice(PriceQuoteDTO quote, LocalDateTime timestamp) {
            this.quote = quote;
            this.timestamp = timestamp;
        }
    }
}

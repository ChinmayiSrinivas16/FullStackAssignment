package com.tnc.domain.marketdata.service;

import com.tnc.domain.marketdata.dto.PriceQuoteDTO;
import com.tnc.domain.marketdata.dto.RefreshPricesResponse;
import com.tnc.domain.marketdata.provider.StockPriceProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MarketDataService {

    private final StockPriceProvider priceProvider;
    private final PriceCacheService cacheService;
    private final SymbolNormalizationService normalizationService;

    /**
     * Get current price for a symbol (from cache or provider)
     */
    public PriceQuoteDTO getPrice(String symbol) {
        String normalized = normalizationService.normalize(symbol);
        
        // Try cache first
        var cached = cacheService.get(normalized);
        if (cached.isPresent()) {
            log.debug("Returning cached price for {}", normalized);
            return cached.get();
        }

        // Fetch from provider
        PriceQuoteDTO quote = priceProvider.getPrice(normalized);
        if (quote != null) {
            cacheService.cache(quote);
        }
        return quote;
    }

    /**
     * Get current prices for multiple symbols
     */
    public List<PriceQuoteDTO> getPrices(List<String> symbols) {
        List<String> normalized = symbols.stream()
                .map(normalizationService::normalize)
                .collect(Collectors.toList());

        // Get from cache first
        List<PriceQuoteDTO> cached = cacheService.getAll(normalized);
        
        // Find missing symbols
        List<String> cachedSymbols = cached.stream().map(PriceQuoteDTO::getSymbol).collect(Collectors.toList());
        List<String> missing = normalized.stream()
                .filter(s -> !cachedSymbols.contains(s))
                .collect(Collectors.toList());

        if (!missing.isEmpty()) {
            log.debug("Fetching prices for {} missing symbols", missing.size());
            List<PriceQuoteDTO> fetched = priceProvider.getPrices(missing);
            cacheService.cacheAll(fetched);
            cached.addAll(fetched);
        }

        return cached;
    }

    /**
     * Refresh prices for given symbols
     */
    public RefreshPricesResponse refreshPrices(List<String> symbols) {
        List<String> normalized = symbols.stream()
                .map(normalizationService::normalize)
                .collect(Collectors.toList());

        List<PriceQuoteDTO> quotes = priceProvider.getPrices(normalized);
        cacheService.cacheAll(quotes);

        return RefreshPricesResponse.builder()
                .quotes(quotes)
                .refreshedAt(LocalDateTime.now())
                .totalSymbols(quotes.size())
                .success(true)
                .build();
    }
}

package com.tnc.domain.marketdata.provider;

import com.tnc.domain.marketdata.dto.PriceQuoteDTO;

import java.util.List;

public interface StockPriceProvider {
    /**
     * Get price quote for a single symbol
     */
    PriceQuoteDTO getPrice(String symbol);

    /**
     * Get price quotes for multiple symbols
     */
    List<PriceQuoteDTO> getPrices(List<String> symbols);
}

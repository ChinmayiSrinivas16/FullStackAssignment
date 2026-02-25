package com.tnc.domain.marketdata.service;

import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class SymbolNormalizationService {

    // Map of commonly used names to NSE symbol codes
    private static final Map<String, String> SYMBOL_MAPPING = new HashMap<String, String>() {{
        put("tcs", "TCS");
        put("infosys", "INFY");
        put("infosys", "INFY");
        put("reliance", "RELIANCE");
        put("hdfc bank", "HDFC");
        put("wipro", "WIPRO");
        put("larsen", "LT");
        put("maruti", "MARUTI");
        put("bajaj auto", "BAJAJ-AUTO");
        put("hcl", "HCLTECH");
        put("asian paint", "ASIANPAINT");
        put("itc", "ITC");
        put("sbi", "SBIN");
        put("icici", "ICICIBANK");
        put("hindunilvr", "HINDUNILVR");
        put("axis", "AXISBANK");
    }};

    /**
     * Normalize symbol to uppercase NSE code
     */
    public String normalize(String input) {
        if (input == null || input.trim().isEmpty()) {
            return "";
        }
        String lower = input.toLowerCase().trim();
        return SYMBOL_MAPPING.getOrDefault(lower, input.toUpperCase());
    }

    /**
     * Check if symbol is valid NSE format
     */
    public boolean isValidSymbol(String symbol) {
        if (symbol == null || symbol.trim().isEmpty()) {
            return false;
        }
        return symbol.matches("^[A-Z0-9-]{1,10}$");
    }
}

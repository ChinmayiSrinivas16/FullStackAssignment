package com.tnc.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;

import java.util.HashMap;
import java.util.Map;

@Service
public class WalletClientService {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private RestTemplate restTemplate;

    @Value("${wallet.service.url:http://localhost:8091}")
    private String walletServiceUrl;

    public void ensureWallet(String username) {
        String url = walletServiceUrl + "/wallets/" + username + "/ensure";
        callWallet(url, HttpMethod.POST, new HashMap<String, Object>());
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> getWalletSummary(String username) {
        String url = walletServiceUrl + "/wallets/" + username + "/summary";
        Map<String, Object> response = callWallet(url, HttpMethod.GET, null);
        Object data = response.get("data");
        if (data instanceof Map) {
            return (Map<String, Object>) data;
        }
        throw new IllegalArgumentException("Wallet service returned an invalid summary response");
    }

    public void debit(String username, double amount) {
        String url = walletServiceUrl + "/wallets/" + username + "/debit";
        Map<String, Object> request = new HashMap<>();
        request.put("amount", amount);
        callWallet(url, HttpMethod.POST, request);
    }

    public void credit(String username, double amount) {
        String url = walletServiceUrl + "/wallets/" + username + "/credit";
        Map<String, Object> request = new HashMap<>();
        request.put("amount", amount);
        callWallet(url, HttpMethod.POST, request);
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> callWallet(String url, HttpMethod method, Map<String, Object> body) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<Map<String, Object>>(body, headers);
            ResponseEntity<Map> responseEntity = restTemplate.exchange(url, method, entity, Map.class);

            Map<String, Object> response = responseEntity.getBody();
            if (response == null) {
                throw new IllegalArgumentException("Wallet service returned empty response");
            }

            Object success = response.get("success");
            if (!(success instanceof Boolean) || !((Boolean) success)) {
                Object message = response.get("message");
                throw new IllegalArgumentException(message != null ? String.valueOf(message) : "Wallet request failed");
            }

            return response;
        } catch (HttpStatusCodeException ex) {
            String responseBody = ex.getResponseBodyAsString();
            if (responseBody != null && !responseBody.trim().isEmpty()) {
                String parsedMessage = null;
                try {
                    Map<String, Object> response = objectMapper.readValue(responseBody, new TypeReference<Map<String, Object>>() {});
                    Object message = response.get("message");
                    if (message != null && !String.valueOf(message).trim().isEmpty()) {
                        parsedMessage = String.valueOf(message);
                    }
                } catch (Exception ignored) {
                    // Ignore parsing errors and use generic message fallback.
                }
                if (parsedMessage != null) {
                    throw new IllegalArgumentException(parsedMessage);
                }
            }
            throw new IllegalArgumentException("Wallet request failed");
        } catch (RestClientException ex) {
            throw new IllegalArgumentException("Wallet service is currently unavailable. Please try again.");
        }
    }
}

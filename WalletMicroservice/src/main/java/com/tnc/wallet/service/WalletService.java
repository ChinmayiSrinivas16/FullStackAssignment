package com.tnc.wallet.service;

import com.tnc.wallet.model.WalletSummary;
import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;

@Service
public class WalletService {

    private static final double DEFAULT_BALANCE = 25000.0;
    private static final double DEFAULT_MINIMUM_BALANCE = 5000.0;

    private final ConcurrentHashMap<String, WalletAccount> wallets = new ConcurrentHashMap<String, WalletAccount>();

    public WalletSummary ensureWallet(String username) {
        WalletAccount account = wallets.computeIfAbsent(username.toLowerCase(), key ->
                new WalletAccount(DEFAULT_BALANCE, DEFAULT_MINIMUM_BALANCE));
        return toSummary(account);
    }

    public WalletSummary getSummary(String username) {
        WalletAccount account = wallets.computeIfAbsent(username.toLowerCase(), key ->
                new WalletAccount(DEFAULT_BALANCE, DEFAULT_MINIMUM_BALANCE));
        return toSummary(account);
    }

    public WalletSummary debit(String username, double amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Debit amount must be greater than zero");
        }

        WalletAccount account = wallets.computeIfAbsent(username.toLowerCase(), key ->
                new WalletAccount(DEFAULT_BALANCE, DEFAULT_MINIMUM_BALANCE));

        synchronized (account) {
            double nextBalance = account.balance - amount;
            if (nextBalance < account.minimumBalance) {
                throw new IllegalArgumentException("Insufficient balance");
            }
            account.balance = round2(nextBalance);
            return toSummary(account);
        }
    }

    public WalletSummary credit(String username, double amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Credit amount must be greater than zero");
        }

        WalletAccount account = wallets.computeIfAbsent(username.toLowerCase(), key ->
                new WalletAccount(DEFAULT_BALANCE, DEFAULT_MINIMUM_BALANCE));

        synchronized (account) {
            account.balance = round2(account.balance + amount);
            return toSummary(account);
        }
    }

    private WalletSummary toSummary(WalletAccount account) {
        double available = Math.max(0.0, account.balance - account.minimumBalance);
        return new WalletSummary(round2(account.balance), round2(account.minimumBalance), round2(available));
    }

    private double round2(double value) {
        return Math.round(value * 100.0) / 100.0;
    }

    private static class WalletAccount {
        private double balance;
        private final double minimumBalance;

        private WalletAccount(double balance, double minimumBalance) {
            this.balance = balance;
            this.minimumBalance = minimumBalance;
        }
    }
}

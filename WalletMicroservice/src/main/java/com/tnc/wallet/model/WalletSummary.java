package com.tnc.wallet.model;

public class WalletSummary {

    private double balance;
    private double minimumBalance;
    private double availableToTrade;

    public WalletSummary() {
    }

    public WalletSummary(double balance, double minimumBalance, double availableToTrade) {
        this.balance = balance;
        this.minimumBalance = minimumBalance;
        this.availableToTrade = availableToTrade;
    }

    public double getBalance() {
        return balance;
    }

    public void setBalance(double balance) {
        this.balance = balance;
    }

    public double getMinimumBalance() {
        return minimumBalance;
    }

    public void setMinimumBalance(double minimumBalance) {
        this.minimumBalance = minimumBalance;
    }

    public double getAvailableToTrade() {
        return availableToTrade;
    }

    public void setAvailableToTrade(double availableToTrade) {
        this.availableToTrade = availableToTrade;
    }
}

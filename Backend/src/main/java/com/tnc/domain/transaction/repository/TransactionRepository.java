package com.tnc.domain.transaction.repository;

import com.tnc.domain.transaction.entity.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByPortfolioId(Long portfolioId);

    Page<Transaction> findByPortfolioId(Long portfolioId, Pageable pageable);

    List<Transaction> findByStockId(Long stockId);

    List<Transaction> findByPortfolioIdAndTransactionDateBetween(Long portfolioId, LocalDate startDate, LocalDate endDate);

    @Query("SELECT t FROM Transaction t WHERE t.portfolio.id = :portfolioId AND t.transactionType = :type ORDER BY t.transactionDate DESC")
    List<Transaction> findByPortfolioIdAndTransactionType(Long portfolioId, Transaction.TransactionType type);

    @Query("SELECT t FROM Transaction t WHERE t.stock.id = :stockId AND t.transactionType = 'BUY' ORDER BY t.transactionDate ASC")
    List<Transaction> findBuyTransactionsByStockIdOrderByDateAsc(Long stockId);

    @Query("SELECT t FROM Transaction t WHERE t.stock.id = :stockId AND t.transactionType = 'SELL' ORDER BY t.transactionDate ASC")
    List<Transaction> findSellTransactionsByStockIdOrderByDateAsc(Long stockId);

    @Query("SELECT SUM(t.totalAmount) FROM Transaction t WHERE t.portfolio.id = :portfolioId AND t.transactionType = 'BUY'")
    java.math.BigDecimal calculateTotalInvested(Long portfolioId);

    @Query("SELECT SUM(t.totalAmount) FROM Transaction t WHERE t.portfolio.id = :portfolioId AND t.transactionType = 'SELL'")
    java.math.BigDecimal calculateTotalSold(Long portfolioId);
}

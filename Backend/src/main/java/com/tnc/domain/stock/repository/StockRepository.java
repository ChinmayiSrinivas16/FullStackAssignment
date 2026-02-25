package com.tnc.domain.stock.repository;

import com.tnc.domain.stock.entity.Stock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StockRepository extends JpaRepository<Stock, Long> {

    List<Stock> findByPortfolioId(Long portfolioId);

    Optional<Stock> findByPortfolioIdAndSymbol(Long portfolioId, String symbol);

    @Query("SELECT s FROM Stock s WHERE s.portfolio.id = :portfolioId ORDER BY s.profitLoss DESC")
    List<Stock> findTopByPortfolioIdOrderByProfitLossDesc(Long portfolioId);

    @Query("SELECT s FROM Stock s WHERE s.portfolio.id = :portfolioId ORDER BY s.profitLoss ASC")
    List<Stock> findTopByPortfolioIdOrderByProfitLossAsc(Long portfolioId);

    boolean existsByPortfolioIdAndSymbol(Long portfolioId, String symbol);
}

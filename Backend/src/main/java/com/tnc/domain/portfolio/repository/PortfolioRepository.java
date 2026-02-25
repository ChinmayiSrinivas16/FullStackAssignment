package com.tnc.domain.portfolio.repository;

import com.tnc.domain.portfolio.entity.Portfolio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {

    List<Portfolio> findByUserId(Long userId);

    Optional<Portfolio> findByIdAndUserId(Long id, Long userId);

    @Query("SELECT p FROM Portfolio p WHERE p.user.id = :userId AND p.portfolioName = :name")
    Optional<Portfolio> findByUserIdAndName(Long userId, String name);

    boolean existsByUserIdAndPortfolioName(Long userId, String name);
}

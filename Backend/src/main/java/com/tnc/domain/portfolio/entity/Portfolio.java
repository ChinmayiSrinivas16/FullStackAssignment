package com.tnc.domain.portfolio.entity;

import com.tnc.domain.stock.entity.Stock;
import com.tnc.domain.transaction.entity.Transaction;
import com.tnc.domain.user.entity.User;
import com.tnc.persistence.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "portfolios", indexes = {
    @Index(name = "idx_portfolio_user", columnList = "user_id")
})
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class Portfolio extends BaseEntity {

    @Column(name = "portfolio_name", nullable = false)
    private String portfolioName;

    @Column(name = "description")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "portfolio", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("createdAt DESC")
    private List<Stock> stocks = new ArrayList<>();

    @OneToMany(mappedBy = "portfolio", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("transactionDate DESC")
    private List<Transaction> transactions = new ArrayList<>();

    @Column(name = "total_invested")
    private BigDecimal totalInvested = BigDecimal.ZERO;

    @Column(name = "current_value")
    private BigDecimal currentValue = BigDecimal.ZERO;
}

package com.tnc.domain.stock.entity;

import com.tnc.domain.portfolio.entity.Portfolio;
import com.tnc.domain.transaction.entity.Transaction;
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
@Table(name = "stocks", indexes = {
    @Index(name = "idx_stock_symbol", columnList = "symbol"),
    @Index(name = "idx_stock_portfolio", columnList = "portfolio_id")
})
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class Stock extends BaseEntity {

    @Column(name = "symbol", nullable = false, length = 10)
    private String symbol;

    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(name = "sector")
    private String sector;

    @Column(name = "industry")
    private String industry;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "portfolio_id", nullable = false)
    private Portfolio portfolio;

    @OneToMany(mappedBy = "stock", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("transactionDate DESC")
    private List<Transaction> transactions = new ArrayList<>();

    @Column(name = "total_quantity")
    private Integer totalQuantity = 0;

    @Column(name = "average_buy_price", precision = 15, scale = 2)
    private BigDecimal averageBuyPrice = BigDecimal.ZERO;

    @Column(name = "total_invested", precision = 15, scale = 2)
    private BigDecimal totalInvested = BigDecimal.ZERO;

    @Column(name = "current_price", precision = 15, scale = 2)
    private BigDecimal currentPrice = BigDecimal.ZERO;

    @Column(name = "current_value", precision = 15, scale = 2)
    private BigDecimal currentValue = BigDecimal.ZERO;

    @Column(name = "profit_loss", precision = 15, scale = 2)
    private BigDecimal profitLoss = BigDecimal.ZERO;

    @Column(name = "profit_loss_percentage", precision = 10, scale = 2)
    private BigDecimal profitLossPercentage = BigDecimal.ZERO;
}

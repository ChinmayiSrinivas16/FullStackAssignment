package com.tnc.domain.transaction.entity;

import com.tnc.domain.portfolio.entity.Portfolio;
import com.tnc.domain.stock.entity.Stock;
import com.tnc.persistence.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions", indexes = {
    @Index(name = "idx_transaction_portfolio", columnList = "portfolio_id"),
    @Index(name = "idx_transaction_stock", columnList = "stock_id"),
    @Index(name = "idx_transaction_date", columnList = "transaction_date")
})
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class Transaction extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "portfolio_id", nullable = false)
    private Portfolio portfolio;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stock_id", nullable = false)
    private Stock stock;

    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_type", nullable = false)
    private TransactionType transactionType;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "price", nullable = false, precision = 15, scale = 2)
    private BigDecimal price;

    @Column(name = "total_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "brokerage", precision = 15, scale = 2)
    private BigDecimal brokerage = BigDecimal.ZERO;

    @Column(name = "tax", precision = 15, scale = 2)
    private BigDecimal tax = BigDecimal.ZERO;

    @Column(name = "transaction_date", nullable = false)
    private LocalDate transactionDate;

    @Column(name = "notes")
    private String notes;

    @Column(name = "is_realized")
    private Boolean isRealized = false;

    public enum TransactionType {
        BUY, SELL
    }

    @PrePersist
    public void calculateTotal() {
        this.totalAmount = this.price.multiply(new BigDecimal(this.quantity));
    }
}

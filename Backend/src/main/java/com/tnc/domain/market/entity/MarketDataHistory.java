package com.tnc.domain.market.entity;

import com.tnc.persistence.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;
import java.util.Date;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "market_data_history")
public class MarketDataHistory extends BaseEntity {

    @Column(nullable = false)
    private String symbol;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Double openPrice;

    @Column(nullable = false)
    private Double highPrice;

    @Column(nullable = false)
    private Double lowPrice;

    @Column(nullable = false)
    private Double closePrice;

    @Column(nullable = false)
    private Long volume;

    @Column(name = "previous_close")
    private Double previousClose;

    @Column(name = "price_change")
    private Double change;

    @Column(name = "change_percent")
    private Double changePercent;

    @Column(name = "recorded_at", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date recordedAt;
}

package com.heartop.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * Represents an alert triggered when a sensor reading
 * exceeds a defined threshold.
 */
@Entity
@Table(name = "alerts")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Alert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AlertType type;        // TEMPERATURE, HUMIDITY, GAS

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AlertSeverity severity; // WARNING, DANGER

    @Column(nullable = false)
    private String message;         // Human-readable alert description

    @Column(nullable = false)
    private Float triggeredValue;   // The value that triggered the alert

    @Column(nullable = false)
    private Float threshold;        // The threshold that was exceeded

    @Column(name = "triggered_at", nullable = false, updatable = false)
    private Instant triggeredAt;

    // Link back to the reading that caused this alert
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sensor_reading_id")
    @JsonIgnore
    private SensorReading sensorReading;

    @PrePersist
    protected void onCreate() {
        this.triggeredAt = Instant.now();
    }

    public enum AlertType {
        TEMPERATURE, HUMIDITY, GAS
    }

    public enum AlertSeverity {
        WARNING, DANGER
    }
}
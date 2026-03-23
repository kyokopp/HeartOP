package com.heartop.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * Represents a single sensor reading from the ESP32.
 * Stored in the 'sensor_readings' PostgreSQL table.
 */
@Entity
@Table(name = "sensor_readings")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SensorReading {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(nullable = false)
    private Float temperature;   // Celsius

    @NotNull
    @Column(nullable = false)
    private Float humidity;      // Percentage (0-100)

    @NotNull
    @Column(nullable = false)
    private Integer light;       // Percentage (0-100, converted from raw)

    @NotNull
    @Column(nullable = false)
    private Integer gas;         // Raw ADC value (0-4095)

    @Column(name = "received_at", nullable = false, updatable = false)
    private Instant receivedAt;  // Server-side timestamp (always reliable)

    @Column(name = "device_timestamp")
    private Long deviceTimestamp; // Unix timestamp from ESP32 (NTP or millis fallback)

    @Column(name = "time_synced")
    @Builder.Default
    private Boolean timeSynced = true; // False if ESP32 used millis() fallback

    @PrePersist
    protected void onCreate() {
        this.receivedAt = Instant.now();
    }
}

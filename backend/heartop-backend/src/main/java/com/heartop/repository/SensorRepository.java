package com.heartop.repository;

import com.heartop.model.SensorReading;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface SensorRepository extends JpaRepository<SensorReading, Long> {

    // Most recent reading
    Optional<SensorReading> findTopByOrderByReceivedAtDesc();

    // Readings within a time range (for historical queries)
    List<SensorReading> findByReceivedAtBetweenOrderByReceivedAtAsc(
            Instant start, Instant end);

    // Average temperature over a time range
    @Query("SELECT AVG(s.temperature) FROM SensorReading s WHERE s.receivedAt >= :since")
    Double averageTemperatureSince(@Param("since") Instant since);

    // Average humidity over a time range
    @Query("SELECT AVG(s.humidity) FROM SensorReading s WHERE s.receivedAt >= :since")
    Double averageHumiditySince(@Param("since") Instant since);
}

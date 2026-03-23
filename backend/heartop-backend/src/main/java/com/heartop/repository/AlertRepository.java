package com.heartop.repository;

import com.heartop.model.Alert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Long> {

    // All alerts of a specific type (e.g. only GAS alerts)
    List<Alert> findByTypeOrderByTriggeredAtDesc(Alert.AlertType type);

    // All alerts of a specific severity
    List<Alert> findBySeverityOrderByTriggeredAtDesc(Alert.AlertSeverity severity);

    // Recent alerts since a given time
    List<Alert> findByTriggeredAtAfterOrderByTriggeredAtDesc(Instant since);

    // Latest N alerts regardless of type
    List<Alert> findTop10ByOrderByTriggeredAtDesc();
}

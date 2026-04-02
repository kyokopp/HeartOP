package com.heartop.service;

import com.heartop.model.Alert;
import com.heartop.model.Alert.AlertSeverity;
import com.heartop.model.Alert.AlertType;
import com.heartop.model.SensorReading;
import com.heartop.repository.AlertRepository;
import com.heartop.repository.SensorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class SensorService {

    private final SensorRepository sensorRepository;
    private final AlertRepository alertRepository;

    @Value("${heartop.alerts.temperature.max}")
    private float tempMax;

    @Value("${heartop.alerts.temperature.min}")
    private float tempMin;

    @Value("${heartop.alerts.humidity.max}")
    private float humidityMax;

    @Value("${heartop.alerts.humidity.min}")
    private float humidityMin;

    @Value("${heartop.alerts.gas.danger}")
    private int gasDanger;

    @Value("${heartop.alerts.gas.warning}")
    private int gasWarning;

    @Transactional
    public SensorReading saveReading(SensorReading reading) {
        SensorReading saved = sensorRepository.save(reading);
        log.info("[SensorService] Reading saved: id={}, temp={}C, humidity={}%, gas={}",
                saved.getId(), saved.getTemperature(), saved.getHumidity(), saved.getGas());

        evaluateAlerts(saved);
        return saved;
    }

    private void evaluateAlerts(SensorReading reading) {
        List<Alert> triggered = new ArrayList<>();

        if (reading.getTemperature() > tempMax) {
            triggered.add(Alert.builder()
                    .type(AlertType.TEMPERATURE)
                    .severity(AlertSeverity.DANGER)
                    .message(String.format("Temperatura crítica: %.1f°C (máximo: %.1f°C)",
                            reading.getTemperature(), tempMax))
                    .triggeredValue(reading.getTemperature())
                    .threshold(tempMax)
                    .sensorReading(reading)
                    .build());
        } else if (reading.getTemperature() < tempMin) {
            triggered.add(Alert.builder()
                    .type(AlertType.TEMPERATURE)
                    .severity(AlertSeverity.WARNING)
                    .message(String.format("Temperatura baixa: %.1f°C (mínimo: %.1f°C)",
                            reading.getTemperature(), tempMin))
                    .triggeredValue(reading.getTemperature())
                    .threshold(tempMin)
                    .sensorReading(reading)
                    .build());
        }

        if (reading.getHumidity() > humidityMax) {
            triggered.add(Alert.builder()
                    .type(AlertType.HUMIDITY)
                    .severity(AlertSeverity.WARNING)
                    .message(String.format("Umidade alta: %.1f%% (máximo: %.1f%%)",
                            reading.getHumidity(), humidityMax))
                    .triggeredValue(reading.getHumidity())
                    .threshold(humidityMax)
                    .sensorReading(reading)
                    .build());
        } else if (reading.getHumidity() < humidityMin) {
            triggered.add(Alert.builder()
                    .type(AlertType.HUMIDITY)
                    .severity(AlertSeverity.WARNING)
                    .message(String.format("Umidade baixa: %.1f%% (mínimo: %.1f%%)",
                            reading.getHumidity(), humidityMin))
                    .triggeredValue(reading.getHumidity())
                    .threshold(humidityMin)
                    .sensorReading(reading)
                    .build());
        }

        if (reading.getGas() >= gasDanger) {
            triggered.add(Alert.builder()
                    .type(AlertType.GAS)
                    .severity(AlertSeverity.DANGER)
                    .message(String.format("Nível de gás perigoso: %d (limite: %d)",
                            reading.getGas(), gasDanger))
                    .triggeredValue(reading.getGas().floatValue())
                    .threshold((float) gasDanger)
                    .sensorReading(reading)
                    .build());
        } else if (reading.getGas() >= gasWarning) {
            triggered.add(Alert.builder()
                    .type(AlertType.GAS)
                    .severity(AlertSeverity.WARNING)
                    .message(String.format("Nível de gás elevado: %d (alerta: %d)",
                            reading.getGas(), gasWarning))
                    .triggeredValue(reading.getGas().floatValue())
                    .threshold((float) gasWarning)
                    .sensorReading(reading)
                    .build());
        }

        if (!triggered.isEmpty()) {
            alertRepository.saveAll(triggered);
            log.warn("[SensorService] {} alert(s) triggered for reading id={}", triggered.size(), reading.getId());
        }
    }

    public List<SensorReading> getAllReadings() {
        return sensorRepository.findAll();
    }

    public Optional<SensorReading> getLatestReading() {
        return sensorRepository.findTopByOrderByReceivedAtDesc();
    }

    public List<SensorReading> getHistory(int hours) {
        Instant since = Instant.now().minus(hours, ChronoUnit.HOURS);
        return sensorRepository.findByReceivedAtBetweenOrderByReceivedAtAsc(since, Instant.now());
    }

    public List<Alert> getAllAlerts() {
        return alertRepository.findAll();
    }

    public List<Alert> getLatestAlerts() {
        return alertRepository.findTop10ByOrderByTriggeredAtDesc();
    }

    public List<Alert> getAlertsByType(Alert.AlertType type) {
        return alertRepository.findByTypeOrderByTriggeredAtDesc(type);
    }
}

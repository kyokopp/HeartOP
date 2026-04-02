package com.heartop.controller;

import com.heartop.model.Alert;
import com.heartop.model.SensorReading;
import com.heartop.service.SensorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class SensorController {

    private final SensorService sensorService;

    @PostMapping("/sensor-data")
    public ResponseEntity<SensorReading> receiveSensorData(
            @Valid @RequestBody SensorReading reading) {

        log.info("[SensorController] Received sensor data: temp={}, humidity={}, gas={}",
                reading.getTemperature(), reading.getHumidity(), reading.getGas());

        SensorReading saved = sensorService.saveReading(reading);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping("/sensor-data")
    public ResponseEntity<List<SensorReading>> getAllReadings() {
        return ResponseEntity.ok(sensorService.getAllReadings());
    }

    @GetMapping("/sensor-data/latest")
    public ResponseEntity<?> getLatestReading() {
        return sensorService.getLatestReading()
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "No readings found yet")));
    }

    @GetMapping("/sensor-data/history")
    public ResponseEntity<List<SensorReading>> getHistory(
            @RequestParam(defaultValue = "24") int hours) {

        if (hours < 1 || hours > 720) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(sensorService.getHistory(hours));
    }

    @GetMapping("/alerts")
    public ResponseEntity<List<Alert>> getLatestAlerts() {
        return ResponseEntity.ok(sensorService.getLatestAlerts());
    }

    @GetMapping("/alerts/all")
    public ResponseEntity<List<Alert>> getAllAlerts() {
        return ResponseEntity.ok(sensorService.getAllAlerts());
    }

    @GetMapping("/alerts/type/{type}")
    public ResponseEntity<?> getAlertsByType(@PathVariable String type) {
        try {
            Alert.AlertType alertType = Alert.AlertType.valueOf(type.toUpperCase());
            return ResponseEntity.ok(sensorService.getAlertsByType(alertType));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Invalid alert type. Use: TEMPERATURE, HUMIDITY, GAS"));
        }
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "HeartOP API"
        ));
    }
}

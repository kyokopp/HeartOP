# HeartOP Backend API

Spring Boot REST API for the HeartOP Smart Environment Monitoring System.

## Requirements
- Java 21
- Maven 3.8+
- PostgreSQL 14+

## Setup

### 1. Create the PostgreSQL database
```sql
CREATE DATABASE heartop;
CREATE USER heartop WITH PASSWORD 'heartop';
GRANT ALL PRIVILEGES ON DATABASE heartop TO heartop;
```

### 2. Configure environment variables (optional)
```bash
export DB_USERNAME=heartop
export DB_PASSWORD=heartop
export API_KEY=your-secret-key-here
```
If not set, defaults from `application.properties` are used.

### 3. Run the API
```bash
mvn spring-boot:run
```
API will start at `http://localhost:8080`

---

## Endpoints

All requests require the header:
```
X-API-Key: heartop-dev-key-2026
```

| Method | Endpoint                        | Description                        |
|--------|---------------------------------|------------------------------------|
| POST   | `/api/sensor-data`              | Receive reading from ESP32         |
| GET    | `/api/sensor-data`              | Get all readings                   |
| GET    | `/api/sensor-data/latest`       | Get most recent reading            |
| GET    | `/api/sensor-data/history?hours=24` | Get readings from last N hours |
| GET    | `/api/alerts`                   | Get latest 10 alerts               |
| GET    | `/api/alerts/all`               | Get all alerts                     |
| GET    | `/api/alerts/type/{type}`       | Filter alerts by type              |
| GET    | `/api/health`                   | Health check                       |

### Alert types: `TEMPERATURE`, `HUMIDITY`, `GAS`

---

## Example POST payload (from ESP32)
```json
{
  "temperature": 28.5,
  "humidity": 65.0,
  "light": 72,
  "gas": 850,
  "timestamp": 1711234567,
  "time_synced": true
}
```

## Alert Thresholds
| Sensor      | Warning            | Danger       |
|-------------|--------------------|--------------|
| Temperature | < 0°C              | > 35°C       |
| Humidity    | < 20% or > 80%     | -            |
| Gas         | >= 1000            | >= 2500      |

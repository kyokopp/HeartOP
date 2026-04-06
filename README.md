# HeartOP

<p align="center">
  <strong>IoT environmental monitoring system with real-time data acquisition, automated alerts, and an interactive dashboard.</strong>
</p>

<p align="center">
  <img src="./docs/dashboard-preview.png" alt="HeartOP Dashboard Preview" width="800"/>
</p>

---

## Architecture


ESP32 (Sensors)
↓ HTTP POST
Spring Boot API
↓
PostgreSQL
↓
React Dashboard


HeartOP collects environmental data (temperature, humidity, luminosity, gas levels) via ESP32, processes alert conditions in a Spring Boot backend, and presents real-time and historical data through a responsive React dashboard.

---

## Features

- Real-time sensor data acquisition via ESP32 (non-blocking loop)
- REST API secured with API Key authentication
- Automated alert generation based on configurable thresholds
- Interactive dashboard with polling and historical charts
- Integration with external weather data (OpenWeatherMap)
- Dynamic UI theme based on atmospheric conditions

---

## Requirements

- Java 21  
- Maven (`mvn` or `mvnd`)  
- Node.js 18+  
- PostgreSQL 14+  
- Wokwi account (optional, for ESP32 simulation)  

---

## Quick Start

### 1. Database (PostgreSQL)

``sql
CREATE DATABASE heartop;
CREATE USER heartop WITH PASSWORD 'heartop';
GRANT ALL PRIVILEGES ON DATABASE heartop TO heartop;
\c heartop
GRANT ALL ON SCHEMA public TO heartop;
2. Backend (Spring Boot)
cd backend/heartop-backend
mvn spring-boot:run

API available at:

http://localhost:8081

Test:

curl http://localhost:8081/api/health

Expected response:

{"status":"UP","service":"HeartOP API"}

Authentication (required for all endpoints except /api/health):

X-API-Key: heartop-dev-key-2026

Custom API key:

# Windows (PowerShell)
$env:API_KEY="your-key"
mvn spring-boot:run
3. Frontend (React)
cd app
cp .env.example .env
npm install
npm run dev

Access the dashboard:

http://localhost:5173

Environment variables (.env):

VITE_API_URL=http://localhost:8081
VITE_OPENWEATHER_API_KEY=your_api_key
4. Firmware (ESP32)

Update API_URL in config.h:

#define API_URL "http://YOUR-LOCAL-IP:8081/api/sensor-data"

Find your IP:

ipconfig   # Windows
ip a       # Linux/macOS

Run on hardware or Wokwi.

Expected Serial Monitor output:

[WiFi] Connected
[NTP] Synced
[Sensors] Temp: 24.5C | Humidity: 60.0% | Light: 45% | Gas: 1200
[API] POST sent. Status: 201
System Verification
curl http://localhost:8081/api/sensor-data/latest

A valid JSON response confirms end-to-end operation.

API Endpoints

Base URL:

http://localhost:8081
Method	Endpoint	Description
POST	/api/sensor-data	Receive sensor data
GET	/api/sensor-data	List all readings
GET	/api/sensor-data/latest	Latest reading
GET	/api/sensor-data/history?hours=24	Historical data
GET	/api/alerts	Recent alerts
GET	/api/alerts/all	All alerts
GET	/api/alerts/type/GAS	Alerts by type
GET	/api/health	API status
Alert Thresholds
Sensor	Warning	Critical
Temperature	< 0°C	> 35°C
Humidity	< 20% or > 80%	—
Gas (ADC)	≥ 1000	≥ 2500
Project Structure
HeartOP/
├── app/                # React frontend
├── backend/            # Spring Boot API
├── firmware/           # ESP32 code (Arduino/C++)
├── docs/               # Diagrams and assets
├── .env.example        # Environment template
├── TUTORIAL.md         # Extended setup guide
└── README.md
Technology Stack
Frontend
React
TypeScript
Vite
Tailwind CSS
Recharts
Framer Motion
Backend
Java 21
Spring Boot
Spring Data JPA
PostgreSQL
Firmware
ESP32
DHT22, MQ-2, LDR
SSD1306 OLED
ArduinoJson
Author

Davi Duarte
Project Integrator V – B — PUC Goiás, 2026

License

This project is licensed under the MIT License.

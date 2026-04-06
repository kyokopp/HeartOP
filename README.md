HeartOP
<p align="center">
  <strong>Sistema IoT de monitoramento ambiental com aquisição de dados em tempo real, geração de alertas e dashboard interativo.</strong>
</p>

---

Arquitetura
ESP32 (Sensores) ➔ HTTP POST ➔ API Spring Boot ➔ PostgreSQL ➔ Dashboard React
O HeartOP captura dados de temperatura, umidade, luminosidade e qualidade do ar por meio de um ESP32, processa alertas com base em limiares definidos no backend e apresenta os dados em tempo real e histórico por meio de uma interface web responsiva.

---

Funcionalidades

Coleta de dados em tempo real via ESP32 com loop não bloqueante
API REST protegida por autenticação via API Key
Geração automática de alertas com base em limiares configurados
Dashboard interativo com atualização periódica e gráficos históricos
Integração com dados meteorológicos externos (OpenWeatherMap)
Tema dinâmico baseado nas condições climáticas

---

Pré-requisitos

Java 21
Maven (mvn ou mvnd)
Node.js 18+
PostgreSQL 14+
Conta no Wokwi (opcional, para simulação do ESP32)

---

Execução
1. Banco de Dados (PostgreSQL)
sqlCREATE DATABASE heartop;
CREATE USER heartop WITH PASSWORD 'heartop';
GRANT ALL PRIVILEGES ON DATABASE heartop TO heartop;
\c heartop
GRANT ALL ON SCHEMA public TO heartop;
2. Backend (Spring Boot)
bashcd backend/heartop-backend
mvn spring-boot:run
A API estará disponível em http://localhost:8081.
Teste de funcionamento:
bashcurl http://localhost:8081/api/health
# {"status":"UP","service":"HeartOP API"}

Autenticação: Todos os endpoints (exceto /api/health) requerem o header X-API-Key: heartop-dev-key-2026.
Para utilizar uma chave personalizada:
powershell# Windows (PowerShell)
$env:API_KEY="sua-chave"
mvn spring-boot:run

3. Frontend (React)
bashcd app
cp .env.example .env
npm install
npm run dev
Acesse em http://localhost:5173.

Variáveis de ambiente necessárias no .env:
VITE_API_URL=http://localhost:8081
VITE_OPENWEATHER_API_KEY=sua-chave

4. Firmware (ESP32)
Atualize a URL da API no arquivo config.h:
cpp#define API_URL "http://SEU-IP-LOCAL:8081/api/sensor-data"
Para descobrir seu IP: ipconfig (Windows) ou ip a (Linux/macOS).
Execute no hardware físico ou no simulador Wokwi. Saída esperada no Serial Monitor:
[WiFi] Conectado
[NTP] Sincronizado
[Sensores] Temp: 24.5C | Umid: 60.0% | Luz: 45% | Gas: 1200
[API] POST enviado. Codigo: 201
O código 201 indica envio bem-sucedido para a API. Para confirmar o sistema operando de ponta a ponta:
bashcurl http://localhost:8081/api/sensor-data/latest

---

API
Base URL: http://localhost:8081
Método Endpoint                           Descrição
POST   /api/sensor-data -                 Recebe dados do ESP32
GET    /api/sensor-data -                 Lista todas as leituras
GET    /api/sensor-data/latest -          Retorna a leitura mais recente
GET    /api/sensor-data/history?hours=24  Retorna histórico filtrado
GET    /api/alerts -                      Retorna os últimos 10 alertas
GET    /api/alerts/all -                  Retorna todos os alertas
GET    /api/alerts/type/GAS -             Filtra alertas por tipo
GET    /api/health -                      Status da API

Limiares de alerta
SensorAvisoCríticoTemperatura< 0°C> 35°CUmidade< 20% ou > 80%—Gás (ADC)>= 1000>= 2500

---

Estrutura do Projeto
HeartOP/
├── app/                              # Frontend React + Vite + TypeScript
│   ├── public/                       # Assets estáticos
│   └── src/
│       ├── components/layout/        # Sidebar, Topbar, MainLayout
│       ├── context/                  # ThemeContext, WeatherContext
│       ├── hooks/                    # useSensorData, useWeather
│       └── pages/                    # Dashboard, Analytics
├── backend/heartop-backend/          # API Spring Boot
│   └── src/main/java/com/heartop/
│       ├── config/                   # CORS, ApiKeyFilter, ExceptionHandler
│       ├── controller/               # Endpoints REST
│       ├── model/                    # Entidades JPA (SensorReading, Alert)
│       ├── repository/               # Interfaces Spring Data JPA
│       └── service/                  # Lógica de negócio e avaliação de alertas
├── firmware/HeartOP/                 # Código-fonte ESP32 (Arduino/C++)
├── docs/                             # Diagramas e documentação auxiliar
├── .env.example                      # Template de variáveis de ambiente
├── TUTORIAL.md                       # Guia detalhado de execução
└── README.md

---

Tecnologias

- Frontend
  React
  TypeScript
  Vite
  TailwindCSS
  Framer Motion
  Recharts
  React Router

- Backend
  Java21
  Spring Boot3.2.4
  Spring Data JPA
  PostgreSQL14
  Lombok

- Firmware
  ESP32 - Microcontrolador
  Módulo Wi-Fi
  DHT22Sensor de temperatura e umidade
  MQ-2Sensor de qualidade do ar
  LDRSensor de luminosidade
  SSD1306 OLEDDisplay 128x64 via I²CArduino
  JsonSerialização JSON para microcontroladores

---

Autor
Davi Duarte (@kyokopp) — Projeto Integrador V – B, PUC Goiás, 2026.

Licença
Este projeto está licenciado sob a Licença MIT.

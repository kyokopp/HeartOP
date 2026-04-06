HeartOP

Estação meteorológica IoT com sensoriamento em tempo real, alertas automáticos e dashboard interativo.

Fluxo da Arquitetura:
ESP32 (Sensores) ➔ HTTP POST ➔ API Spring Boot ➔ PostgreSQL ➔ React Dashboard
O HeartOP captura dados de temperatura, umidade, luminosidade e qualidade do ar via ESP32, processa alertas de segurança no backend e exibe o histórico em uma interface web reativa com design glassmorphism.

✨ Funcionalidades

Hardware IoT: Leituras a cada 2 segundos via ESP32, sem delay() bloqueante.
API Segura: Endpoints REST protegidos por API Key com tratamento global de exceções.
Alertas Automáticos: Notificações geradas no backend quando limiares de segurança são ultrapassados.
Dashboard Reativo: Interface com polling otimizado a cada 5 segundos e gráficos históricos.
Clima Externo: Integração com OpenWeatherMap para contextualizar as leituras locais.
Tema Dinâmico: Alternância automática de tema baseada nas condições atmosféricas da região.


📋 Pré-requisitos

Java 21
Maven (mvn ou mvnd)
Node.js 18+
PostgreSQL 14+
Conta no Wokwi (para simulação do ESP32)


🚀 Quick Start
1. Banco de Dados (PostgreSQL)
Abra o SQL Shell (psql) e execute:
sql
CREATE DATABASE heartop;
CREATE USER heartop WITH PASSWORD 'heartop';
GRANT ALL PRIVILEGES ON DATABASE heartop TO heartop;
\c heartop
GRANT ALL ON SCHEMA public TO heartop;

### 2. Backend (Spring Boot)
``bash
cd backend/heartop-backend
mvn spring-boot:run
Aguarde a mensagem Started HeartOpApplication in X seconds. A API estará disponível em http://localhost:8081.
Confirme que está funcionando:
bashcurl http://localhost:8081/api/health
# {"status":"UP","service":"HeartOP API"}

🔐 Autenticação: Todos os endpoints (exceto /api/health) requerem o header:
X-API-Key: heartop-dev-key-2026
Para usar uma chave personalizada, defina a variável de ambiente antes de subir:
powershell$env:API_KEY = "sua-key-aqui"
mvn spring-boot:run

3. Frontend (React)
bashcd app
cp .env.example .env
npm install
npm run dev
Acesse o dashboard em http://localhost:5173.

⚙️ Variáveis de ambiente necessárias no .env:
VITE_API_URL=http://localhost:8081
VITE_OPENWEATHER_API_KEY=sua-chave-aqui

4. Firmware (ESP32)
Abra o arquivo config.h e atualize o IP local da máquina:
cpp#define API_URL "http://SEU-IP-LOCAL:8081/api/sensor-data"
Para descobrir seu IP: ipconfig (Windows) ou ip a (Linux/macOS).
Compile e rode no hardware físico ou na simulação Wokwi. No Serial Monitor, você verá:
[WiFi] Conectado! IP: ...
[NTP] Sincronizado! Hora: HH:MM:SS
[Sensores] Temp: 24.5C | Umid: 60.0% | Luz: 45% | Gas: 1200
[API] POST enviado. Codigo: 201
O código 201 confirma que os dados chegaram na API com sucesso.

📡 API Endpoints
Base URL: http://localhost:8081
MétodoEndpointDescriçãoPOST/api/sensor-dataRecebe leitura do ESP32GET/api/sensor-dataLista todas as leiturasGET/api/sensor-data/latestLeitura mais recenteGET/api/sensor-data/history?hours=24Histórico das últimas N horasGET/api/alertsÚltimos 10 alertasGET/api/alerts/allTodos os alertasGET/api/alerts/type/GASAlertas filtrados por tipoGET/api/healthStatus da API (sem autenticação)
Limiares de alerta
SensorAvisoPerigoTemperatura< 0°C> 35°CUmidade< 20% ou > 80%—Gás (Raw ADC)>= 1000>= 2500

🗂️ Estrutura do Projeto
HeartOP/
├── app/                          # Frontend React + Vite + TypeScript
│   ├── public/                   # Assets estáticos
│   └── src/
│       ├── components/           # Componentes reutilizáveis
│       │   └── layout/           # Sidebar, Topbar, MainLayout
│       ├── context/              # ThemeContext, WeatherContext
│       ├── hooks/                # useSensorData, useWeather
│       └── pages/                # Dashboard, Analytics
├── backend/
│   └── heartop-backend/          # API Spring Boot
│       └── src/main/java/com/heartop/
│           ├── config/           # CORS, ApiKeyFilter, ExceptionHandler
│           ├── controller/       # Endpoints REST
│           ├── model/            # Entidades JPA (SensorReading, Alert)
│           ├── repository/       # Interfaces Spring Data JPA
│           └── service/          # Lógica de negócio e avaliação de alertas
├── firmware/
│   └── HeartOP/                  # Código-fonte ESP32 (Arduino/C++)
├── docs/                         # Documentação auxiliar
│   ├── circuit-diagram.png       # Esquema elétrico do protótipo
│   └── dashboard-preview.png     # Screenshot do dashboard
├── .env.example                  # Template de variáveis de ambiente
├── TUTORIAL.md                   # Guia passo a passo de execução
└── README.md                     # Este arquivo

💻 Tech Stack
Frontend
TecnologiaVersãoDescriçãoReact19.xBiblioteca para interfaces declarativasVite8.xBuild tool com HMR ultrarrápidoTypeScript5.9Superset tipado de JavaScriptTailwind CSS4.xFramework CSS utilitárioFramer Motion12.xAnimações declarativasRecharts3.xGráficos baseados em D3React Router7.xRoteamento SPA
Backend
TecnologiaVersãoDescriçãoSpring Boot3.2.4Framework Java com auto-configuraçãoSpring Data JPA—Abstração de persistênciaPostgreSQL14+Banco de dados relacionalLombok1.18Geração de boilerplate via anotaçõesJakarta Validation—Validação declarativa de beans
Firmware
TecnologiaDescriçãoESP32Microcontrolador dual-core com Wi-FiDHT22Sensor de temperatura e umidadeMQ-2Sensor de qualidade do arLDRSensor de luminosidadeSSD1306 OLEDDisplay 128x64 via I²CArduinoJsonSerialização JSON para microcontroladores

👤 Autor
Desenvolvido por Davi Duarte (@kyokopp) como Projeto Integrador V – B — PUC Goiás, 2026.

📄 Licença
Este projeto está licenciado sob a Licença MIT.

#include "config.h"

#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <DHT.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <time.h>

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);
DHT dht(DHTPIN, DHTTYPE);

unsigned long lastSensorRead = 0;
unsigned long lastApiPost    = 0;
const unsigned long SENSOR_INTERVAL = 2000;
const unsigned long API_INTERVAL    = 10000;

float temperature = 0;
float humidity    = 0;
int   lightRaw    = 0;
int   gasRaw      = 0;

time_t getUnixTimestamp() {
  time_t now;
  time(&now);
  return now;
}

String getFormattedTime() {
  time_t now;
  struct tm timeinfo;
  time(&now);
  localtime_r(&now, &timeinfo);

  char buffer[9];
  strftime(buffer, sizeof(buffer), "%H:%M:%S", &timeinfo);
  return String(buffer);
}

bool isTimeSynced() {
  time_t now;
  time(&now);
  return now > 1000000000;
}

// CHANGED: Function now writes directly to the assigned PWM channels (0, 1, 2)
void setLEDColor(int r, int g, int b) {
  ledcWrite(0, r);
  ledcWrite(1, g);
  ledcWrite(2, b);
}

void updateLED() {
  if (gasRaw < 1000) {
    setLEDColor(0, 255, 0);
  } else if (gasRaw < 2500) {
    setLEDColor(255, 150, 0);
  } else {
    setLEDColor(255, 0, 0);
  }
}

void updateDisplay() {
  display.clearDisplay();
  
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0, 0);
  display.print(F("Sinais Vitais"));
  display.drawLine(0, 10, 128, 10, SSD1306_WHITE);

  display.setCursor(72, 0);
  if (WiFi.status() == WL_CONNECTED && isTimeSynced()) {
    display.print(getFormattedTime());
  } else {
    display.print(WiFi.status() == WL_CONNECTED ? F("W:OK") : F("W:--"));
  }

  display.setCursor(0, 15);
  if (isnan(temperature) || isnan(humidity)) {
    display.print(F("Erro no DHT!"));
  } else {
    display.print(F("Temp: ")); display.print(temperature, 1); display.print(F(" C"));
    display.setCursor(0, 25);
    display.print(F("Umid: ")); display.print(humidity, 1); display.print(F(" %"));
  }

  int lightPercent = map(lightRaw, 0, 4095, 0, 100);
  display.setCursor(0, 38);
  display.print(F("Luz: ")); display.print(lightPercent); display.print(F(" %"));

  display.setCursor(0, 50);
  display.print(F("Gas: ")); display.print(gasRaw);
  display.print(F(" "));
  if (gasRaw < 1000)       display.print(F("[OK]"));
  else if (gasRaw < 2500)  display.print(F("[ALERTA]"));
  else                     display.print(F("[PERIGO]"));

  display.display();
}

void postToAPI() {
  HTTPClient http;
  http.begin(API_URL);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("X-API-Key", API_KEY);
  http.setTimeout(5000);

  int lightPercent = map(lightRaw, 0, 4095, 0, 100);

  JsonDocument doc;
  doc["temperature"] = temperature;
  doc["humidity"]    = humidity;
  doc["light"]       = lightPercent;
  doc["gas"]         = gasRaw;

  if (isTimeSynced()) {
    doc["timestamp"] = (long)getUnixTimestamp();
  } else {
    doc["timestamp"] = (long)millis();
    doc["time_synced"] = false;
  }

  String payload;
  serializeJson(doc, payload);

  int responseCode = http.POST(payload);

  if (responseCode > 0) {
    Serial.printf("[API] POST enviado. Codigo: %d\n", responseCode);
  } else {
    Serial.printf("[API] Falha no POST. Erro: %s\n", http.errorToString(responseCode).c_str());
  }

  http.end();
}

void setup() {
  Serial.begin(115200);
  
  ledcSetup(0, 5000, 8);
  ledcSetup(1, 5000, 8);
  ledcSetup(2, 5000, 8);
  ledcAttachPin(LED_R, 0);
  ledcAttachPin(LED_G, 1);z
  ledcAttachPin(LED_B, 2);
  
  setLEDColor(0, 0, 255);

  dht.begin();

  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println(F("[OLED] Falha na alocacao!"));
    for (;;);
  }

  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(20, 20);
  display.println(F("Sistema HeartOP"));
  display.setCursor(20, 35);
  display.println(F("Inicializando..."));
  display.display();
  delay(1500);

  display.clearDisplay();
  display.setCursor(20, 25);
  display.println(F("Conectando WiFi..."));
  display.display();

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print(F("[WiFi] Conectando"));

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(F("."));
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.printf("\n[WiFi] Conectado! IP: %s\n", WiFi.localIP().toString().c_str());
    setLEDColor(0, 255, 0);
    display.clearDisplay();
    display.setCursor(15, 20);
    display.println(F("WiFi Conectado!"));
    display.setCursor(10, 35);
    display.println(WiFi.localIP().toString());
    display.display();

    display.clearDisplay();
    display.setCursor(20, 25);
    display.println(F("Sincronizando NTP..."));
    display.display();

    configTime(UTC_OFFSET_SEC, DST_OFFSET_SEC, NTP_SERVER);
    Serial.print(F("[NTP] Sincronizando"));

    int ntpAttempts = 0;
    while (!isTimeSynced() && ntpAttempts < 10) {
      delay(500);
      Serial.print(F("."));
      ntpAttempts++;
    }

    if (isTimeSynced()) {
      Serial.printf("\n[NTP] Sincronizado! Hora: %s\n", getFormattedTime().c_str());
      display.clearDisplay();
      display.setCursor(20, 20);
      display.println(F("NTP Sincronizado!"));
      display.setCursor(35, 35);
      display.println(getFormattedTime());
      display.display();
    } else {
      Serial.println(F("\n[NTP] Falha na sincronizacao. Usando millis() como fallback."));
      display.clearDisplay();
      display.setCursor(15, 25);
      display.println(F("NTP Falhou!"));
      display.setCursor(10, 40);
      display.println(F("Modo Offline..."));
      display.display();
    }

  } else {
    Serial.println(F("\n[WiFi] Falha ao conectar."));
    setLEDColor(255, 50, 0);
    display.clearDisplay();
    display.setCursor(20, 25);
    display.println(F("Falha no WiFi!"));
    display.display();
  }

  delay(1500);
}

void loop() {
  unsigned long now = millis();

  if (now - lastSensorRead >= SENSOR_INTERVAL) {
    lastSensorRead = now;

    temperature = dht.readTemperature();
    humidity    = dht.readHumidity();
    lightRaw    = analogRead(LDR_PIN);
    gasRaw      = analogRead(MQ_PIN);

    if (isnan(temperature) || isnan(humidity)) {
      Serial.println(F("[DHT] Leitura invalida!"));
      setLEDColor(128, 0, 128);
    } else {
      updateLED();
    }

    updateDisplay();

    Serial.printf("[Sensores] Temp: %.1fC | Umid: %.1f%% | Luz: %d%% | Gas: %d | Hora: %s\n",
                  temperature, humidity, map(lightRaw, 0, 4095, 0, 100), gasRaw,
                  isTimeSynced() ? getFormattedTime().c_str() : "N/A");
  }

  if (now - lastApiPost >= API_INTERVAL) {
    lastApiPost = now;

    if (WiFi.status() != WL_CONNECTED) {
      Serial.println(F("[WiFi] Desconectado. Tentando reconectar..."));
      WiFi.reconnect();
    } else {
      if (!isnan(temperature) && !isnan(humidity)) {
        postToAPI();
      } else {
        Serial.println(F("[API] Dados invalidos. POST ignorado."));
      }
    }
  }
}
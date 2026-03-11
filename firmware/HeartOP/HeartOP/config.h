#pragma once

// wifi (pls when u test the code on your home network dont forget to change the wowki boilerplate >:p)
#define WIFI_SSID     "Wokwi-GUEST"
#define WIFI_PASSWORD ""

#define API_URL "http://seu-dominio.com/api/sensor-data"

#define NTP_SERVER     "pool.ntp.org"
#define UTC_OFFSET_SEC -10800  // horario de brasilia
#define DST_OFFSET_SEC 0       

#define DHTPIN    32
#define DHTTYPE   DHT22
#define LDR_PIN   35
#define MQ_PIN    34

#define LED_R 2
#define LED_G 4
#define LED_B 15

#define SCREEN_WIDTH  128
#define SCREEN_HEIGHT 64
#define OLED_RESET    -1

#define SENSOR_INTERVAL 2000
#define API_INTERVAL    10000
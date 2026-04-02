# HeartOP — Tutorial de Execução

Guia completo para rodar o projeto HeartOP do zero.

---

## Pré-requisitos

Certifique-se de que os seguintes programas estão instalados:

- **Java 21** (Microsoft OpenJDK recomendado)
- **Maven** (mvnd ou mvn)
- **Node.js 18+** e **npm**
- **PostgreSQL 14+**
- Conta no **Wokwi** (wokwi.com)

---

## Passo 1 — Configurar o PostgreSQL

Abra o **SQL Shell (psql)** pelo menu iniciar. Pressione Enter em todos os campos e digite a senha do postgres quando solicitado. Execute:

```sql
CREATE DATABASE heartop;
CREATE USER heartop WITH PASSWORD 'heartop';
GRANT ALL PRIVILEGES ON DATABASE heartop TO heartop;
\c heartop
GRANT ALL ON SCHEMA public TO heartop;
\q
```

---

## Passo 2 — Rodar a API Spring Boot

Abra um terminal PowerShell e navegue até a pasta do backend:

```powershell
cd caminho\para\HeartOP\backend\heartop-backend
mvn spring-boot:run
```

Aguarde aparecer a mensagem:
```
Started HeartOpApplication in X seconds
```

A API estará rodando em `http://localhost:8081`.

**Teste rápido para confirmar que está funcionando:**
```powershell
curl http://localhost:8081/api/health
```

Resposta esperada:
```json
{"status":"UP","service":"HeartOP API"}
```

> **Não feche esse terminal.** A API precisa ficar rodando.

---

## Passo 3 — Obter a API Key

A API Key já está configurada no projeto. O valor padrão é:

```
heartop-dev-key-2026
```

Ela está definida em `application.properties`:
```properties
heartop.api.key=${API_KEY:heartop-dev-key-2026}
```

Essa key deve ser enviada em todo request no header `X-API-Key`. Se quiser usar uma key personalizada, defina a variável de ambiente antes de rodar:

```powershell
$env:API_KEY = "sua-key-aqui"
mvn spring-boot:run
```

---

## Passo 4 — Configurar o Firmware (ESP32)

No arquivo `config.h`, localize e atualize a URL da API com o IP local da sua máquina:

```cpp
#define API_URL "http://SEU-IP-LOCAL:8081/api/sensor-data"
```

Para descobrir seu IP local, execute no PowerShell:
```powershell
ipconfig
```

Procure pelo endereço IPv4 da sua interface de rede ativa (ex: `192.168.1.100`).

---

## Passo 5 — Rodar no Wokwi

1. Acesse [wokwi.com](https://wokwi.com) e abra o projeto HeartOP
2. Certifique-se de que as seguintes bibliotecas estão instaladas (Library Manager):
   - `DHT sensor library` (Adafruit)
   - `Adafruit Unified Sensor`
   - `Adafruit GFX Library`
   - `Adafruit SSD1306`
   - `ArduinoJson`
3. Cole o conteúdo atualizado do `HeartOP.ino` no editor
4. Clique em **Run** (▶)

Acompanhe o **Serial Monitor** — você deve ver:
```
[WiFi] Conectado! IP: ...
[NTP] Sincronizado! Hora: HH:MM:SS
[Sensores] Temp: XX.XC | Umid: XX.X% | Luz: XX% | Gas: XXXX
[API] POST enviado. Codigo: 201
```

O código `201` confirma que os dados chegaram na API com sucesso!

---

## Passo 6 — Rodar o Frontend (Dashboard Web)

Abra um **novo terminal** e navegue até a pasta do frontend:

```powershell
cd caminho\para\HeartOP\app
npm install
npm run dev
```

O Vite irá iniciar o servidor de desenvolvimento. Acesse no navegador:
```
http://localhost:5173
```

O dashboard estará disponível com dados em tempo real do backend.

> **Não feche esse terminal.** O frontend precisa ficar rodando.

---

## Passo 7 — Verificar os dados no banco

Com tudo rodando, abra um **novo terminal** e execute:

```powershell
# Ver a leitura mais recente
curl http://localhost:8081/api/sensor-data/latest

# Ver todas as leituras
curl http://localhost:8081/api/sensor-data

# Ver alertas gerados
curl http://localhost:8081/api/alerts
```

Se aparecerem dados JSON com temperatura, umidade, gás e luz — **o sistema está funcionando de ponta a ponta!** 🎉

---

## Visualizando os Logs

### Logs do Backend (Spring Boot)

Os logs são exibidos diretamente no terminal onde o `mvn spring-boot:run` está executando. Você verá mensagens como:

```
[SensorController] Received sensor data: temp=25.3, humidity=60.0, gas=450
[SensorService] Reading saved: id=42, temp=25.3C, humidity=60.0%, gas=450
```

Se um alerta for disparado:
```
[SensorService] 1 alert(s) triggered for reading id=42
```

### Logs do Frontend (Browser)

1. Abra o navegador em `http://localhost:5173`
2. Pressione **F12** para abrir o DevTools
3. Navegue até a aba **Console**
4. Erros de rede e requisições podem ser visualizados na aba **Network**

### Logs do Firmware (Serial Monitor)

No Wokwi, o Serial Monitor exibe automaticamente os logs do ESP32 incluindo:
- Status da conexão WiFi
- Sincronização NTP
- Leituras dos sensores a cada 2 segundos
- Resultado dos POSTs para a API a cada 10 segundos

---

## Resumo dos terminais necessários

| Terminal | Comando | Finalidade |
|---|---|---|
| Terminal 1 | `mvn spring-boot:run` | API Spring Boot |
| Terminal 2 | `npm run dev` | Frontend React (Dashboard) |
| Terminal 3 | `curl ...` | Verificação dos dados |

---

## Endpoints disponíveis

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/api/sensor-data` | Recebe leitura do ESP32 |
| GET | `/api/sensor-data` | Lista todas as leituras |
| GET | `/api/sensor-data/latest` | Leitura mais recente |
| GET | `/api/sensor-data/history?hours=24` | Histórico das últimas N horas |
| GET | `/api/alerts` | Últimos 10 alertas |
| GET | `/api/alerts/all` | Todos os alertas |
| GET | `/api/alerts/type/GAS` | Alertas por tipo |
| GET | `/api/health` | Status da API |

---

## Limiares de alerta

| Sensor | Aviso | Perigo |
|---|---|---|
| Temperatura | < 0°C | > 35°C |
| Umidade | < 20% ou > 80% | — |
| Gás | >= 1000 | >= 2500 |

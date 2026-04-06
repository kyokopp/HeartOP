# HeartOP — Sistema de Monitoramento Climático

<p align="center">
  <strong>Estação meteorológica IoT com sensoriamento em tempo real, análise atmosférica e dashboard interativo</strong>
</p>

---

## Descrição

O **HeartOP** é um sistema de monitoramento ambiental de arquitetura distribuída, projetado para capturar, processar e visualizar dados atmosféricos em tempo real. O projeto integra três camadas fundamentais: um **microcontrolador ESP32** equipado com sensores de temperatura, umidade, luminosidade e qualidade do ar; uma **API RESTful** construída com Spring Boot responsável pela persistência e processamento dos dados; e um **dashboard web** desenvolvido em React que apresenta as informações por meio de uma interface moderna com design responsivo inspirado no paradigma de [glassmorphism](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter).

A comunicação entre as camadas ocorre via protocolo HTTP sobre rede local (LAN), eliminando a dependência de túneis externos. O sistema implementa um mecanismo de **alertas automatizados** que dispara notificações quando os valores sensoriais ultrapassam limiares pré-configurados, além de integrar dados meteorológicos externos da [API OpenWeatherMap](https://openweathermap.org/api) para contextualizar as leituras locais com previsões atmosféricas regionais.

---

## Técnicas Interessantes

O código-fonte emprega diversas técnicas relevantes para o desenvolvimento web e embarcado contemporâneo:

- **[`backdrop-filter`](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter) e Glassmorphism**: Os painéis da interface utilizam a propriedade CSS `backdrop-filter` com `blur()` e `saturate()` para criar o efeito de vidro fosco sobre imagens de fundo dinâmicas, implementado na classe utilitária `glass-panel`.

- **[CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) para Tematização Dinâmica**: O sistema de temas utiliza variáveis CSS nativas (`--theme-*`) com seletor `[data-theme]`, permitindo transições suaves entre paletas de cores sem recarregamento da página.

- **[`Promise.all()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) para Requisições Paralelas**: Tanto o hook `useSensorData` quanto o `useWeather` utilizam `Promise.all()` para executar múltiplas chamadas HTTP simultaneamente, otimizando significativamente o tempo de carregamento dos dados.

- **[`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) para Persistência de Preferências**: A seleção de cidade e tema do usuário são armazenadas via `localStorage`, garantindo que as configurações persistam entre sessões do navegador.

- **[`setInterval`](https://developer.mozilla.org/en-US/docs/Web/API/setInterval) com Cleanup Pattern**: Os hooks de dados implementam o padrão de polling com limpeza adequada via `clearInterval` no retorno do `useEffect`, prevenindo [memory leaks](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_management) em componentes desmontados.

- **[Debounce Pattern](https://developer.mozilla.org/en-US/docs/Glossary/Debounce)**: A busca de cidades no `Topbar` implementa debounce com `setTimeout` de 150ms para evitar requisições excessivas durante a digitação do usuário.

- **[`@PrePersist`](https://jakarta.ee/specifications/persistence/3.1/) do JPA**: As entidades `SensorReading` e `Alert` utilizam callbacks de ciclo de vida JPA para atribuir timestamps automáticos no momento da persistência, garantindo consistência temporal.

- **[Derived Query Methods](https://docs.spring.io/spring-data/jpa/reference/jpa/query-methods.html) do Spring Data**: Os repositórios utilizam convenções de nomenclatura como `findTopByOrderByReceivedAtDesc()` e `findByReceivedAtBetweenOrderByReceivedAtAsc()` para gerar queries SQL automaticamente a partir dos nomes dos métodos.

- **[`ledcWrite()`](https://docs.espressif.com/projects/arduino-esp32/en/latest/api/ledc.html) do ESP32**: O firmware utiliza a API LEDC (LED Control) do ESP32 para controlar um LED RGB via PWM, fornecendo feedback visual do status do sistema diretamente no hardware.

- **[`configTime()` e NTP](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/system/system_time.html)**: O firmware sincroniza o relógio interno do ESP32 via protocolo NTP (Network Time Protocol), com fallback para `millis()` em caso de falha na sincronização.

---

## Tecnologias e Bibliotecas

### Frontend

| Tecnologia | Versão | Descrição |
|---|---|---|
| [React](https://react.dev/) | 19.x | Biblioteca para construção de interfaces declarativas |
| [Vite](https://vite.dev/) | 8.x | Build tool com HMR (Hot Module Replacement) ultrarrápido |
| [TypeScript](https://www.typescriptlang.org/) | 5.9 | Superset tipado de JavaScript |
| [Tailwind CSS](https://tailwindcss.com/) | 4.x | Framework CSS utilitário com engine JIT |
| [Framer Motion](https://motion.dev/) | 12.x | Biblioteca de animações declarativas para React |
| [Recharts](https://recharts.org/) | 3.x | Biblioteca de gráficos baseada em D3 e componentes React |
| [Lucide React](https://lucide.dev/) | 1.x | Conjunto de ícones SVG otimizados como componentes React |
| [React Router](https://reactrouter.com/) | 7.x | Roteamento SPA com suporte a layouts aninhados |

### Backend

| Tecnologia | Versão | Descrição |
|---|---|---|
| [Spring Boot](https://spring.io/projects/spring-boot) | 3.2.4 | Framework para aplicações Java com auto-configuração |
| [Spring Data JPA](https://spring.io/projects/spring-data-jpa) | — | Abstração de persistência com queries derivadas |
| [PostgreSQL](https://www.postgresql.org/) | 14+ | Sistema gerenciador de banco de dados relacional |
| [Lombok](https://projectlombok.org/) | 1.18 | Geração automática de boilerplate Java via anotações |
| [Jakarta Validation](https://jakarta.ee/specifications/bean-validation/) | — | Validação declarativa de beans via anotações `@NotNull` |

### Firmware

| Tecnologia | Descrição |
|---|---|
| [ESP32](https://www.espressif.com/en/products/socs/esp32) | Microcontrolador dual-core com Wi-Fi e Bluetooth |
| [DHT22](https://learn.adafruit.com/dht) | Sensor de temperatura e umidade de alta precisão |
| [MQ-2/MQ-135](https://www.sparkfun.com/products/9405) | Sensor de qualidade do ar (gases combustíveis) |
| [SSD1306 OLED](https://learn.adafruit.com/monochrome-oled-breakouts) | Display OLED 128x64 via protocolo I²C |
| [ArduinoJson](https://arduinojson.org/) | Serialização/deserialização JSON para microcontroladores |

### APIs Externas

| API | Finalidade |
|---|---|
| [OpenWeatherMap](https://openweathermap.org/api) | Dados meteorológicos em tempo real e previsões de 5 dias |

### Tipografia

| Fonte | Origem |
|---|---|
| [Inter](https://fonts.google.com/specimen/Inter) | Google Fonts — tipografia sans-serif otimizada para interfaces |

---

## Estrutura do Projeto

```
HeartOP/
├── app/                          # Frontend React + Vite
│   ├── public/                   # Assets estáticos (favicon, ícones SVG)
│   ├── src/
│   │   ├── assets/               # Imagens e recursos importáveis
│   │   ├── components/           # Componentes reutilizáveis da interface
│   │   │   └── layout/           # Componentes estruturais (Sidebar, Topbar, MainLayout)
│   │   ├── context/              # Providers do React Context (tema, clima)
│   │   ├── hooks/                # Custom hooks (polling de sensores, dados meteorológicos)
│   │   └── pages/                # Páginas da aplicação (Dashboard, Analytics)
│   └── dist/                     # Build de produção (gerado automaticamente)
├── backend/
│   └── heartop-backend/          # API Spring Boot
│       └── src/main/java/com/heartop/
│           ├── config/           # Configurações (CORS, filtro de API key, exception handler)
│           ├── controller/       # Endpoints REST da API
│           ├── model/            # Entidades JPA (SensorReading, Alert)
│           ├── repository/       # Interfaces Spring Data JPA
│           └── service/          # Lógica de negócio e avaliação de alertas
├── firmware/
│   └── HeartOP/                  # Código-fonte do ESP32 (Arduino)
├── docs/                         # Documentação auxiliar (diagramas de circuito)
├── TUTORIAL.md                   # Guia passo a passo de execução
├── LICENSE                       # Licença MIT
└── README.md                     # Este arquivo
```

- O diretório [components/layout](./app/src/components/layout) contém a arquitetura de layout com sidebar colapsável animada via Framer Motion e topbar com busca de cidades integrada à API de geocodificação.
- O diretório [hooks](./app/src/hooks) implementa os custom hooks `useSensorData` (polling HTTP para o backend local) e `useWeather` (integração com OpenWeatherMap via geocodificação reversa).
- O diretório [context](./app/src/context) gerencia o estado global de tema climático (`ThemeContext`) e dados meteorológicos (`WeatherContext`), com alternância automática de tema baseada nas condições atmosféricas da região selecionada.
- O diretório [config](./backend/heartop-backend/src/main/java/com/heartop/config) contém a configuração de [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS), o filtro de autenticação por API key e o tratamento global de exceções para respostas JSON padronizadas.
- O diretório [docs](./docs) armazena o diagrama de circuito elétrico do protótipo com as conexões dos sensores ao ESP32.

---

## Licença

Este projeto está licenciado sob a [Licença MIT](./LICENSE).
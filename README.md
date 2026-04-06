# Project Title: HeartOP

## Arquitetura
- A arquitetura do projeto é baseada em microserviços.
- Os componentes principais incluem:
  - Serviço de autenticação
  - Serviço de notificações
  - Banco de dados relacional

## Funcionalidades
- Autenticação de usuários.
- Envio de notificações em tempo real.
- Acesso ao histórico de mensagens.

## Pré-requisitos
- **Python 3.8+**
- **Node.js 14+**
- **Banco de dados:** MySQL ou PostgreSQL

## Execução
Para executar o projeto localmente, siga os passos abaixo:

```bash
# Clone o repositório
git clone https://github.com/kyokopp/HeartOP.git

# Navegue até o diretório do projeto
cd HeartOP

# Instale as dependências
pip install -r requirements.txt

# Execute o servidor
python app.py
```

## API Endpoints
| Método  | Endpoint                      | Descrição                           |
|---------|-------------------------------|-------------------------------------|
| GET     | /api/v1/users                 | Retorna todos os usuários           |
| POST    | /api/v1/login                 | Faz login de um usuário             |
| GET     | /api/v1/notifications         | Retorna todas as notificações       |
| POST    | /api/v1/notifications         | Envia uma nova notificação          |

## Alert Thresholds
| Tipo de Alerta       | Limite Inferior | Limite Superior | Ação a Tomar               |
|----------------------|-----------------|-----------------|----------------------------|
| Uso de CPU           | 70%             | 90%             | Enviar alerta              |
| Uso de Memória       | 60%             | 85%             | Iniciar procedimento de limpeza |
| Tempo de Resposta     | 200ms           | 500ms           | Registrar log e notificar   |
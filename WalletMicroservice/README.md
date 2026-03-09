# Wallet Microservice (Java)

Standalone Spring Boot microservice for wallet balance operations.

## Default behavior
- Default wallet balance: `25000`
- Minimum balance to keep: `5000`
- Service port: `8091`

## Run
```bash
mvn spring-boot:run
```

## Endpoints
- `POST /wallets/{username}/ensure`
- `GET /wallets/{username}/summary`
- `POST /wallets/{username}/debit` with body `{ "amount": 1000 }`
- `POST /wallets/{username}/credit` with body `{ "amount": 1000 }`
- `GET /health`

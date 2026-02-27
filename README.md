# StockFolio

StockFolio is a modern web application for managing stock portfolios and analyzing investment performance. It brings together portfolio tracking, transaction management, profit & loss analytics, and real-time market data into a clean, responsive UI so you can make data-driven investment decisions.

## Table of Contents
- Overview
- Features
- Tech Stack
- Quick Start
- Contributors
- License & Contributing

## Overview

StockFolio supports detailed transaction histories, and analytics including win rates, realized/unrealized gains, and asset distribution across stocks, bonds, and cash. The app is designed for both new and experienced investors who want clear insights and actionable views of their holdings.

## Features
- User management: sign-up, login, JWT-based authentication
- Portfolio management: create and track multiple portfolios
- Holdings: detailed view of current positions and cost basis
- Transactions: buy/sell entry, history, and filtering by date/asset
- Profit & Loss analytics: realized gains, unrealized gains, IRR-style summaries
- Reports: CSV/JSON export of holdings and transactions
- Real-time market feed: live prices to update P&L and charts
- Visualizations: charts for performance, allocation, and trade outcomes

## Tech Stack

- Backend
  - Language: Java (Spring Boot)
  - Build: Maven (`pom.xml` available in `Backend/`)
  - Auth: JWT-based authentication and request filters
  - Persistence: JPA repositories (configurable to MySQL `application.properties`)

- Frontend
  - Framework: Angular
  - Language: TypeScript, SCSS for styles
  - Tooling: Angular CLI, Webpack (via `package.json` in `Frontend/`)

- Market Data Engine
  - Small Python market feed (`Backend/market_data_server.py`) to simulate/stream price updates

- Security
  - JWT tokens, request filters, and authentication entry point

- DevOps & Tooling
  - Docker-friendly layout (Dockerfile can be added for each service)
  - CI: GitHub Actions (recommended) for build & test
  - Testing: JUnit for backend, Karma/Jasmine for frontend

## Quick Start

1. Backend (Java Spring Boot)

```bash
cd Backend
mvn clean install
mvn spring-boot:run
```

2. Market data (optional / local)

```bash
python Backend/market_data_server.py
```

3. Frontend (Angular)

```bash
cd Frontend
npm install
npm start
# or: ng serve --open
```
For local server:
Open the frontend in your browser (usually `http://localhost:4200`) and the backend API on its configured port (Spring Boot default `http://localhost:8080`).

## Contributors

- Thriam — Thriam bakesvar B — @Thriam
- Chinmayi — Chinmayi Srinivas — @ChinmayiSrinivas16
- Navtika Lipi — Navtika Lipi — @navtikalipi

Thank you to all contributors who improve StockFolio — submissions are welcome via pull requests.

## Contributing

- Fork the repository and open a PR with a clear description.
- Follow existing styles: Java code uses project formatting; Angular uses TypeScript + SCSS conventions.
- Add tests for new functionality and update documentation.

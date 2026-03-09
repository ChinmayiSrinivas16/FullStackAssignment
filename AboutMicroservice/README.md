# About Microservice (Java)

Standalone Java Spring Boot microservice for footer/about metadata.
This service is intentionally separate from the main backend application.

## Tech Stack

- Java 8
- Spring Boot 2.6.6
- Maven

## Endpoints

- `GET /about` - Returns company/legal details for footer
- `GET /health` - Health check

## Run

```bash
cd AboutMicroservice
mvn spring-boot:run
```

Default URL: `http://localhost:8090/about`

## Configuration

Set values in `src/main/resources/application.properties`:

- `app.about.company-name`
- `app.about.company-id`
- `app.about.gst-number`
- `app.about.pan-number`
- `app.about.cin-number`
- `app.about.support-email`
- `app.about.support-phone`
- `app.about.website`
- `app.about.registered-office`

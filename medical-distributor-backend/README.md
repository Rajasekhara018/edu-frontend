# Medical Distributor ERP Backend

## Requirements
- Java 17+
- Maven 3.9+
- Docker (for local PostgreSQL)

## Local database
```bash
cd medical-distributor-backend
docker compose up -d
```

## Run the API
```bash
cd medical-distributor-backend
mvn spring-boot:run
```

API base: `http://localhost:8081`
Swagger UI: `http://localhost:8081/swagger-ui`
OpenAPI: `http://localhost:8081/api-docs`

## Seed data
Flyway seeds a default admin user:
- Username: `admin`
- Password: `password`

Roles created: SUPER_ADMIN, SALES_REP, SALES_MANAGER, WAREHOUSE, FINANCE, SUPPORT, AUDITOR.

## Tests
```bash
mvn test
```

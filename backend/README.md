# Portfolio Backend

Spring Boot REST API for portfolio application with JWT authentication.

## Technology Stack

- **Spring Boot 3.2.5** with Java 17
- **Spring Security 6.x** with JWT authentication
- **Spring Data JPA** with MySQL 8.x
- **Flyway** for database migrations
- **MapStruct** for DTO mapping
- **JUnit 5 + Mockito** for testing

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+

## Database Setup

```bash
mysql -u root -p
CREATE DATABASE portfolio_db;
```

## Configuration

Update `src/main/resources/application.properties` with your MySQL credentials:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/portfolio_db
spring.datasource.username=your_username
spring.datasource.password=your_password
```

## Build and Run

```bash
# Clean and build
mvn clean install

# Run the application
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

## Run Tests

```bash
# Run all tests
mvn test

# Run with coverage
mvn verify
```

## Default Admin User

- **Username**: admin
- **Password**: admin123

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login and get JWT token

### Public Endpoints
- `GET /api/profile` - Get profile with social links
- `GET /api/skills` - Get all skills
- `GET /api/experiences` - Get all experiences
- `GET /api/projects` - Get all projects
- `GET /api/blogs` - Get published blogs
- `GET /api/blogs/{slug}` - Get blog by slug
- `POST /api/contacts` - Submit contact form

### Admin Endpoints (JWT Required)
- `PUT /api/profile` - Update profile
- `POST /api/skills` - Create skill
- `PUT /api/skills/{id}` - Update skill
- `DELETE /api/skills/{id}` - Delete skill
- Similar CRUD for experiences, projects, blogs
- `GET /api/contacts` - Get all contacts
- `PATCH /api/contacts/{id}` - Mark contact as read
- `DELETE /api/contacts/{id}` - Delete contact

## Testing Login

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

Expected response:
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "expiresIn": 3600,
  "user": {
    "id": "admin-user-id-001",
    "username": "admin",
    "role": "admin"
  }
}
```

## Using JWT Token

Include the token in the Authorization header for protected endpoints:

```bash
curl -X GET http://localhost:8080/api/contacts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Project Structure

```
backend/
├── src/main/java/com/portfolio/
│   ├── PortfolioApplication.java
│   ├── config/                 # Security, JWT, and system configuration
│   ├── security/              # JWT provider, filter, and entry point
│   ├── common/exception/      # Global exception handler
│   ├── auth/                  # Authentication controller and DTOs
│   ├── user/                  # User entity, repository, and service
│   ├── profile/               # Profile domain
│   ├── skill/                 # Skills domain
│   ├── experience/            # Experience domain
│   ├── project/               # Projects domain
│   ├── blog/                  # Blog domain
│   └── contact/               # Contact domain
├── src/main/resources/
│   ├── application.properties
│   └── db/migration/          # Flyway migration scripts
└── src/test/java/             # Test files mirroring main structure
```

## Database Migrations

Flyway migrations are located in `src/main/resources/db/migration/`:

- `V1__init_schema.sql` - Creates all database tables
- `V2__seed_admin_user.sql` - Creates default admin user
- `V3__seed_sample_data.sql` - Inserts sample data

## CORS Configuration

CORS is configured to allow requests from `http://localhost:4200` (Angular dev server).

Update `SecurityConfig.java` to add additional origins if needed.

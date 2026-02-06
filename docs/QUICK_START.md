# Portfolio Application - Quick Start Guide

This guide will help you get the full-stack portfolio application running quickly.

## Prerequisites

- **Java 17** or higher
- **Maven 3.6+**
- **MySQL 8.0+**
- **Node.js 18+** and npm
- **Angular CLI** (`npm install -g @angular/cli`)

## Step 1: Database Setup

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE portfolio_db;

# Exit MySQL
exit;
```

## Step 2: Configure Backend

Edit `backend/src/main/resources/application.properties`:

```properties
spring.datasource.username=root
spring.datasource.password=your_mysql_password
```

## Step 3: Start Backend

```bash
# Navigate to backend directory
cd backend

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The backend will start on **http://localhost:8080**

Flyway will automatically:
- Create all database tables
- Insert admin user (username: `admin`, password: `admin123`)
- Insert sample data

## Step 4: Start Frontend

Open a new terminal:

```bash
# Install dependencies (first time only)
npm install

# Start Angular development server
ng serve
```

The frontend will start on **http://localhost:4200**

## Step 5: Verify Installation

1. **Open browser**: Navigate to http://localhost:4200
2. **Test public pages**: You should see the portfolio with sample data
3. **Test login**:
   - Click on the admin/login button (if available)
   - Username: `admin`
   - Password: `admin123`
4. **Test backend directly**:
   ```bash
   # Test login endpoint
   curl -X POST http://localhost:8080/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"admin123"}'

   # Test public endpoint
   curl http://localhost:8080/api/skills
   ```

## Default Credentials

- **Username**: `admin`
- **Password**: `admin123`

⚠️ **Important**: Change the default admin password in production!

## Architecture Overview

### Backend (Spring Boot)
- **Port**: 8080
- **API Base**: http://localhost:8080/api
- **Authentication**: JWT tokens
- **Database**: MySQL

### Frontend (Angular)
- **Port**: 4200
- **Dev Server**: http://localhost:4200
- **Proxy**: Forwards `/api` requests to backend

### API Endpoints

#### Public Endpoints (No Authentication)
- `GET /api/profile` - Get profile information
- `GET /api/skills` - Get all skills
- `GET /api/experiences` - Get work experiences
- `GET /api/projects` - Get projects
- `GET /api/blogs` - Get published blogs
- `GET /api/blogs/{slug}` - Get specific blog
- `POST /api/contacts` - Submit contact form
- `POST /api/auth/login` - Login

#### Admin Endpoints (JWT Required)
- `PUT /api/profile` - Update profile
- `POST /api/skills` - Create skill
- `PUT /api/skills/{id}` - Update skill
- `DELETE /api/skills/{id}` - Delete skill
- Similar CRUD for experiences, projects, blogs
- `GET /api/contacts` - View contacts
- `PATCH /api/contacts/{id}` - Mark as read
- `DELETE /api/contacts/{id}` - Delete contact

## Project Structure

```
portfolio/
├── backend/                    # Spring Boot application
│   ├── src/main/java/          # Java source code
│   │   └── com/portfolio/      # Main package
│   │       ├── config/         # Configuration
│   │       ├── security/       # JWT security
│   │       ├── auth/           # Authentication
│   │       ├── user/           # User management
│   │       ├── profile/        # Profile domain
│   │       ├── skill/          # Skills domain
│   │       ├── experience/     # Experience domain
│   │       ├── project/        # Projects domain
│   │       ├── blog/           # Blog domain
│   │       └── contact/        # Contact domain
│   ├── src/main/resources/     # Resources
│   │   ├── application.properties
│   │   └── db/migration/       # Flyway SQL scripts
│   └── src/test/              # Tests
├── src/                        # Angular application
│   ├── app/                    # Angular components
│   └── ...
├── proxy.conf.json             # Angular proxy config
└── package.json                # npm dependencies
```

## Common Issues & Solutions

### Issue: "Access denied for user"
**Solution**: Check MySQL credentials in `application.properties`

### Issue: "Table doesn't exist"
**Solution**:
- Verify database was created
- Check Flyway migrations ran successfully
- Look for migration errors in Spring Boot logs

### Issue: "Port 8080 already in use"
**Solution**:
- Stop other applications using port 8080
- Or change port in `application.properties`: `server.port=8081`

### Issue: "CORS error in browser"
**Solution**:
- Verify backend is running on port 8080
- Check `SecurityConfig.java` CORS configuration
- Ensure Angular proxy is configured correctly

### Issue: "401 Unauthorized for admin endpoints"
**Solution**:
- Verify you have a valid JWT token
- Check token is included in `Authorization: Bearer {token}` header
- Ensure token hasn't expired (1 hour expiration)

## Testing

### Run Backend Tests
```bash
cd backend
mvn test
```

### Run Frontend Tests
```bash
ng test
```

### Run E2E Tests
```bash
ng e2e
```

## Development Workflow

1. **Start backend**: `cd backend && mvn spring-boot:run`
2. **Start frontend**: `ng serve` (in project root)
3. **Make changes**: Both support hot reload
4. **Test changes**: Use browser at http://localhost:4200

## Building for Production

### Backend
```bash
cd backend
mvn clean package
java -jar target/portfolio-backend-1.0.0.jar
```

### Frontend
```bash
ng build --configuration production
# Deploy dist/ folder to web server
```

## Next Steps

1. **Customize Data**: Replace sample data in Flyway migration V3
2. **Change Admin Password**: Update V2 migration or create new admin user
3. **Update Profile**: Use PUT /api/profile endpoint
4. **Add Content**: Use admin endpoints to add skills, projects, blogs, etc.
5. **Configure Production**:
   - Set strong JWT secret
   - Configure production database
   - Update CORS origins
   - Enable HTTPS

## Support & Documentation

- **Backend README**: `backend/README.md`
- **Implementation Checklist**: `backend/IMPLEMENTATION_CHECKLIST.md`
- **API Documentation**: Use tools like Postman or Swagger
- **Spring Boot Docs**: https://spring.io/projects/spring-boot
- **Angular Docs**: https://angular.io/docs

## Security Notes

🔒 **Production Security Checklist**:
- [ ] Change default admin password
- [ ] Use strong JWT secret (environment variable)
- [ ] Enable HTTPS
- [ ] Configure proper CORS origins
- [ ] Use secure MySQL password
- [ ] Enable SQL logging only in dev
- [ ] Review security headers
- [ ] Implement rate limiting
- [ ] Add request logging
- [ ] Regular security updates

---

**Happy Coding! 🚀**

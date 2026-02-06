# Backend Testing Guide

This guide explains how to run and verify all tests for the Spring Boot backend.

## Prerequisites

- **Java 17** or higher
- **Maven 3.6+**

Verify installation:
```bash
java -version
mvn --version
```

## Running Tests

### Method 1: Using Test Runner Scripts

#### Linux/macOS
```bash
cd backend
chmod +x run-tests.sh
./run-tests.sh
```

#### Windows
```cmd
cd backend
run-tests.bat
```

### Method 2: Using Maven Directly

```bash
cd backend

# Run all tests
mvn test

# Run tests with detailed output
mvn test -X

# Run specific test class
mvn test -Dtest=SkillServiceTest

# Run specific test method
mvn test -Dtest=SkillServiceTest#shouldGetAllSkills

# Skip tests during build
mvn clean install -DskipTests

# Run tests and generate coverage report
mvn clean verify
```

## Test Structure

### Test Categories

1. **Unit Tests**
   - Entity tests (UUID generation, timestamps)
   - JWT provider tests
   - Service tests (mocked dependencies)

2. **Integration Tests**
   - Repository tests (@DataJpaTest with H2)
   - Named query tests
   - JSON serialization tests

3. **API Tests**
   - Controller tests (@WebMvcTest)
   - Security tests (@WithMockUser)
   - Validation tests

4. **Full Integration Tests**
   - End-to-end authentication flow
   - Complete API workflows

### Test Files (26 Test Classes)

```
src/test/java/com/portfolio/
├── PortfolioApplicationTests.java          # Context loading
├── integration/
│   └── AuthenticationIntegrationTest.java  # Full auth flow
├── security/
│   └── JwtTokenProviderTest.java           # JWT token tests
├── user/
│   ├── entity/UserTest.java                # User entity tests
│   ├── repository/UserRepositoryTest.java  # User repository tests
│   └── service/UserServiceTest.java        # User service tests
├── auth/controller/
│   └── AuthControllerTest.java             # Login endpoint tests
├── profile/
│   ├── repository/
│   │   ├── ProfileRepositoryTest.java      # Profile repository tests
│   │   └── SocialLinkRepositoryTest.java   # SocialLink repository tests
│   ├── service/ProfileServiceTest.java     # Profile service tests
│   └── controller/ProfileControllerTest.java # Profile API tests
├── skill/
│   ├── repository/SkillRepositoryTest.java # Skill repository tests
│   ├── service/SkillServiceTest.java       # Skill service tests
│   └── controller/SkillControllerTest.java # Skill API tests
├── experience/
│   ├── repository/ExperienceRepositoryTest.java
│   ├── service/ExperienceServiceTest.java
│   └── controller/ExperienceControllerTest.java
├── project/
│   ├── repository/ProjectRepositoryTest.java
│   ├── service/ProjectServiceTest.java
│   └── controller/ProjectControllerTest.java
├── blog/
│   ├── repository/BlogRepositoryTest.java
│   ├── service/BlogServiceTest.java
│   └── controller/BlogControllerTest.java
└── contact/
    ├── repository/ContactRepositoryTest.java
    ├── service/ContactServiceTest.java
    └── controller/ContactControllerTest.java
```

## Test Coverage

### What Is Tested

#### JWT Security (JwtTokenProviderTest)
- ✓ Token generation
- ✓ Username extraction from token
- ✓ Token validation
- ✓ Invalid token rejection
- ✓ Expired token handling

#### User Authentication (UserServiceTest, AuthControllerTest)
- ✓ Load user by username
- ✓ User not found exception
- ✓ Login success with valid credentials
- ✓ Login failure with invalid credentials
- ✓ Validation errors

#### Repository Layer (All *RepositoryTest.java)
- ✓ CRUD operations
- ✓ Named queries execution
- ✓ Custom query methods
- ✓ JSON field serialization/deserialization
- ✓ Relationship management (Profile ↔ SocialLinks)
- ✓ Cascade operations

#### Service Layer (All *ServiceTest.java)
- ✓ All CRUD operations
- ✓ Exception handling (ResourceNotFoundException)
- ✓ Business logic validation
- ✓ DTO mapping
- ✓ Transactional behavior

#### Controller Layer (All *ControllerTest.java)
- ✓ Public endpoint access
- ✓ Admin endpoint authorization
- ✓ Request validation
- ✓ Response format
- ✓ HTTP status codes
- ✓ Security integration

#### Integration Tests (AuthenticationIntegrationTest)
- ✓ Complete authentication flow
- ✓ JWT token lifecycle
- ✓ Public endpoint access without token
- ✓ Protected endpoint access with token
- ✓ Invalid credentials rejection
- ✓ Invalid token rejection

## Expected Test Results

When all tests pass, you should see output similar to:

```
[INFO] -------------------------------------------------------
[INFO]  T E S T S
[INFO] -------------------------------------------------------
[INFO] Running com.portfolio.PortfolioApplicationTests
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.portfolio.security.JwtTokenProviderTest
[INFO] Tests run: 5, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.portfolio.user.entity.UserTest
[INFO] Tests run: 2, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.portfolio.user.repository.UserRepositoryTest
[INFO] Tests run: 4, Failures: 0, Errors: 0, Skipped: 0
... (more test classes)
[INFO]
[INFO] Results:
[INFO]
[INFO] Tests run: 100+, Failures: 0, Errors: 0, Skipped: 0
[INFO]
[INFO] -------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] -------------------------------------------------------
```

## Troubleshooting

### Tests Fail to Compile

**Issue**: Compilation errors or missing dependencies

**Solution**:
```bash
# Clean and reinstall dependencies
mvn clean install -DskipTests

# Update dependencies
mvn dependency:resolve

# Force update snapshots
mvn clean install -U
```

### H2 Database Errors

**Issue**: Test database initialization fails

**Solution**:
- Verify `src/test/resources/application.properties` exists
- Check H2 dependency in `pom.xml`
- Ensure `spring.flyway.enabled=false` in test properties

### MapStruct Compilation Errors

**Issue**: Mapper implementations not generated

**Solution**:
```bash
# Force recompilation with annotation processors
mvn clean compile

# Check generated sources
ls -la target/generated-sources/annotations/
```

### Security Test Failures

**Issue**: @WithMockUser tests fail

**Solution**:
- Verify `spring-security-test` dependency
- Check security configuration
- Ensure proper role naming (ROLE_ prefix)

### Out of Memory Errors

**Issue**: Tests fail with OutOfMemoryError

**Solution**:
```bash
# Increase Maven memory
export MAVEN_OPTS="-Xmx1024m"

# Or set in pom.xml
<plugin>
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-surefire-plugin</artifactId>
  <configuration>
    <argLine>-Xmx1024m</argLine>
  </configuration>
</plugin>
```

## Test Reports

After running tests, detailed reports are available:

### Surefire Reports
```bash
# Text reports
ls target/surefire-reports/*.txt

# XML reports
ls target/surefire-reports/*.xml
```

### Generate HTML Reports
```bash
mvn surefire-report:report
open target/site/surefire-report.html
```

### Code Coverage (Optional)

Add JaCoCo plugin to `pom.xml`:
```xml
<plugin>
    <groupId>org.jacoco</groupId>
    <artifactId>jacoco-maven-plugin</artifactId>
    <version>0.8.10</version>
    <executions>
        <execution>
            <goals>
                <goal>prepare-agent</goal>
            </goals>
        </execution>
        <execution>
            <id>report</id>
            <phase>test</phase>
            <goals>
                <goal>report</goal>
            </goals>
        </execution>
    </executions>
</plugin>
```

Then run:
```bash
mvn test jacoco:report
open target/site/jacoco/index.html
```

## Continuous Integration

### GitHub Actions Example

```yaml
name: Backend Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up JDK 17
        uses: actions/setup-java@v3
        with:
          java-version: '17'
          distribution: 'temurin'
      - name: Run tests
        run: |
          cd backend
          mvn clean test
```

## Testing Best Practices

1. **Run tests before committing**
   ```bash
   mvn clean test
   ```

2. **Run specific tests during development**
   ```bash
   mvn test -Dtest=SkillServiceTest
   ```

3. **Check test coverage regularly**
   ```bash
   mvn verify jacoco:report
   ```

4. **Keep tests fast**
   - Use @DataJpaTest for repository tests (H2 in-memory)
   - Mock external dependencies
   - Avoid Thread.sleep() in tests

5. **Keep tests isolated**
   - Each test should be independent
   - Use @Transactional for database tests
   - Clean up test data properly

## Next Steps

After verifying all tests pass:

1. ✓ Tests pass - Backend is working correctly
2. Set up database: `CREATE DATABASE portfolio_db`
3. Run application: `mvn spring-boot:run`
4. Test API endpoints with provided scripts
5. Start frontend and test full integration

## Support

If tests fail:
1. Read the error messages carefully
2. Check the specific test file for context
3. Verify dependencies are installed
4. Ensure Java 17 is being used
5. Check logs in `target/surefire-reports/`

---

**Happy Testing! 🧪**

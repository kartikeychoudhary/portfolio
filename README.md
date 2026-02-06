# KartikeyPortfolio

A full-stack portfolio application built with Angular (frontend), Spring Boot (backend), and MySQL (database).

## Quick Start with Docker

The easiest way to run the application is using Docker:

```bash
# Copy environment template
cp .env.example .env

# Start all services (MySQL, Backend, Frontend)
docker-compose up -d

# Access the application at http://localhost
# Default credentials: admin / admin
```

For detailed Docker deployment instructions, configuration options, and troubleshooting, see [DOCKER_README.md](docs/DOCKER_README.md).

## Development Setup

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.1.2.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

- [Docker Deployment Guide](docs/DOCKER_README.md) - Complete Docker deployment documentation
- [Quick Start Guide](docs/QUICK_START.md) - Getting started guide
- [Backend Implementation](docs/BACKEND_IMPLEMENTATION_SUMMARY.md) - Backend details
- [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) - Angular CLI documentation

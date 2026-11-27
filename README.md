# CostosIndustrial

## Estructura

| Carpeta | Contenido |
|---|---|
| `src/` | Front Angular 21 |
| [`backend/`](backend/README.md) | API FastAPI + SQLAlchemy (SQLite en local, PostgreSQL en Docker) |
| [`despliegue/`](despliegue/README.md) | Docker Compose, Dockerfiles, Nginx y Makefile |
| [`docs/`](docs/README.md) | Documentación: casos de uso, diagramas UML, manuales de instalación, usuario y funcionalidad |

Arranque rápido con Docker: `cd despliegue && make up` → http://localhost:8080

Desarrollo local: `npm start` usa el API en `localhost:8000` (proxy `proxy.conf.json`);
`npx ng serve --configuration mock` trabaja con datos mock, sin backend.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.10.

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

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

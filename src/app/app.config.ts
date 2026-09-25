import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { ProjectService } from './core/services/project.service';
import { environment } from '../environments/environment';
import { BomService } from './core/services/bom.service';
import { CatalogService } from './core/services/catalog.service';
import { CatalogMockService } from './core/services/mock/catalog-mock.service';
import { CatalogApiService } from './core/services/api/catalog-api.service';
import { ProjectApiService } from './core/services/api/project-api.service';
import { BomMockService } from './core/services/mock/bom-mock.service';
import { BomApiService } from './core/services/api/bom-api.service';
import { NotificationService } from './core/services/notification.service';
import { NotificationMockService } from './core/services/mock/notification-mock.service';
import { NotificationApiService } from './core/services/api/notification-api.service';
import { ProjectMockService } from './core/services/mock/project-mock.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    {
      provide: ProjectService,
      useClass: environment.useMock ? ProjectMockService : ProjectApiService,
    },
    { provide: BomService, useClass: environment.useMock ? BomMockService : BomApiService },
    {
      provide: CatalogService,
      useClass: environment.useMock ? CatalogMockService : CatalogApiService,
    },
    {
      provide: NotificationService,
      useClass: environment.useMock ? NotificationMockService : NotificationApiService,
    },
  ],
};

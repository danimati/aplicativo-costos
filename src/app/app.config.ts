import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';

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
import { ProjectNoteService } from './core/services/project-notes.service';
import { ProjectNoteMockService } from './core/services/mock/mock-notes.repository';
import { ProjectNoteApiService } from './core/services/api/project-notes-api.service';
import { ProjectDocumentApiService } from './core/services/api/project-document-api.service';
import { ProjectDocumentService } from './core/services/project-document.service';
import { ProjectDocumentMockService } from './core/services/mock/project-document-mock.service';
import { ProjectTemplateApiService } from './core/services/api/project-template-api.service';
import { LaborMockService } from './core/services/mock/labor-mock.service';
import { LaborApiService } from './core/services/api/labor-api.service';
import { ProjectTemplateService } from './core/services/project-template.service';
import { LaborService } from './core/services/labor.service';
import { ProjectTemplateMockService } from './core/services/mock/project-template-mock.service';
import { ProcurementService } from './core/services/procurement.service';
import { ReceptionService } from './core/services/reception.service';
import { ProductionService } from './core/services/production.service';
import { ProductionMockService } from './core/services/mock/production-mock.service';
import { ProductionApiService } from './core/services/api/production-api.service';
import { ReceptionApiService } from './core/services/api/reception-api.service';
import { ReceptionMockService } from './core/services/mock/reception-mock.service';
import { ProcurementMockService } from './core/services/mock/procurement-mock.service';
import { ProcurementApiService } from './core/services/api/procurement-api.service';
import { InstallationService } from './core/services/installation.service';
import { InstallationMockService } from './core/services/mock/installation-mock.service';
import { InstallationApiService } from './core/services/api/installation-api.service';
import { ProjectCostMockService } from './core/services/mock/project-cost-mock.service';
import { ProjectCostService } from './core/services/project-cost.service';
import { ReportService } from './core/services/report.service';
import { ReportMockService } from './core/services/mock/report-mock.service';
import { ReportApiService } from './core/services/api/report-api.service';
import { ProjectCostApiService } from './core/services/api/project-cost-api.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withFetch()),
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
    {
      provide: ProjectNoteService,
      useClass: environment.useMock ? ProjectNoteMockService : ProjectNoteApiService,
    },
    {
      provide: ProjectDocumentService,
      useClass: environment.useMock ? ProjectDocumentMockService : ProjectDocumentApiService,
    },
    {
      provide: LaborService,
      useClass: environment.useMock ? LaborMockService : LaborApiService,
    },
    {
      provide: ProjectTemplateService,
      useClass: environment.useMock ? ProjectTemplateMockService : ProjectTemplateApiService,
    },
    {
      provide: ProcurementService,
      useClass: environment.useMock ? ProcurementMockService : ProcurementApiService,
    },
    {
      provide: ReceptionService,
      useClass: environment.useMock ? ReceptionMockService : ReceptionApiService,
    },
    {
      provide: ProductionService,
      useClass: environment.useMock ? ProductionMockService : ProductionApiService,
    },
    {
      provide: InstallationService,
      useClass: environment.useMock ? InstallationMockService : InstallationApiService,
    },
    {
      provide: ProjectCostService,
      useClass: environment.useMock ? ProjectCostMockService : ProjectCostApiService,
    },
    {
      provide: ReportService,
      useClass: environment.useMock ? ReportMockService : ReportApiService,
    },
  ],
};

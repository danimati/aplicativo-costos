import { Routes } from '@angular/router';
import { LoginComponent } from './core/features/login/login.component';
import { ShellComponent } from './core/features/shell/shell.component';
import { ProjectHubComponent } from './core/features/project-hub/project-hub.component';
import { ProjectDetailComponent } from './core/features/project-detail/project-detail.component';

import { BomPage } from './core/features/project-detail/pages/ciclo-i/bom/bom.page';
import { ManoObraPage } from './core/features/project-detail/pages/ciclo-i/mano-obra/mano-obra.page';
import { PlantillasPage } from './core/features/project-detail/pages/ciclo-i/plantillas/plantillas.page';

import { ComprasPage } from './core/features/project-detail/pages/ciclo-ii/compras/compras.page';
import { RecepcionPage } from './core/features/project-detail/pages/ciclo-ii/recepcion/recepcion.page';
import { FabricacionPage } from './core/features/project-detail/pages/ciclo-ii/fabricacion/fabricacion.page';
import { EnsamblePage } from './core/features/project-detail/pages/ciclo-ii/ensamble/ensamble.page';

import { InstalacionPage } from './core/features/project-detail/pages/ciclo-iii/instalacion/instalacion.page';
import { CableadoPage } from './core/features/project-detail/pages/ciclo-iii/cableado/cableado.page';
import { ProgramacionPage } from './core/features/project-detail/pages/ciclo-iii/programacion/programacion.page';
import { PruebasPage } from './core/features/project-detail/pages/ciclo-iii/pruebas/pruebas.page';

import { DatosPage } from './core/features/project-detail/pages/configuracion/datos/datos.page';
import { UsuariosPage } from './core/features/project-detail/pages/configuracion/usuarios/usuarios.page';
import { PermisosPage } from './core/features/project-detail/pages/configuracion/permisos/permisos.page';
import { AvancePage } from './core/features/project-detail/pages/reportes/avance/avance.page';
import { CostosPage } from './core/features/project-detail/pages/reportes/costos/costos.page';
import { HorasPage } from './core/features/project-detail/pages/reportes/horas/horas.page';
import { IndicadoresPage } from './core/features/project-detail/pages/reportes/indicadores/indicadores.page';
import { DocumentacionPage } from './core/features/project-detail/pages/ciclo-i/documentacion/documentacion.page';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'app',
    component: ShellComponent,
    children: [
      { path: '', redirectTo: 'proyectos', pathMatch: 'full' },
      {
        path: 'proyectos',
        component: ProjectHubComponent,
        data: { isRoot: true, title: 'EXPEDIENTES ACTIVOS' },
      },
      {
        path: 'proyectos/:id',
        component: ProjectDetailComponent,
        data: { isRoot: false, title: 'EXPEDIENTE ACTIVO' },
        children: [
          {
            path: 'documentacion',
            component: DocumentacionPage,
            data: { title: 'NOTAS & DOCUMENTACIÓN', cycle: 'CICLO I', leaf: '01' },
          },
          {
            path: 'bom',
            component: BomPage,
            data: { title: 'LISTA DE MATERIALES / BOM', cycle: 'CICLO I', leaf: '02' },
          },
          {
            path: 'mano-obra',
            component: ManoObraPage,
            data: { title: 'MANO DE OBRA & ETAPAS', cycle: 'CICLO I', leaf: '03' },
          },
          {
            path: 'plantillas',
            component: PlantillasPage,
            data: { title: 'PLANTILLAS BASE', cycle: 'CICLO I', leaf: '04' },
          },

          {
            path: 'compras',
            component: ComprasPage,
            data: { title: 'COMPRAS', cycle: 'CICLO II', leaf: '05' },
          },
          {
            path: 'recepcion',
            component: RecepcionPage,
            data: { title: 'RECEPCIÓN DE MATERIALES', cycle: 'CICLO II', leaf: '06' },
          },
          {
            path: 'fabricacion',
            component: FabricacionPage,
            data: { title: 'FABRICACIÓN', cycle: 'CICLO II', leaf: '07' },
          },
          {
            path: 'ensamble',
            component: EnsamblePage,
            data: { title: 'ENSAMBLE', cycle: 'CICLO II', leaf: '08' },
          },

          {
            path: 'instalacion',
            component: InstalacionPage,
            data: { title: 'INSTALACIÓN', cycle: 'CICLO III', leaf: '09' },
          },
          {
            path: 'cableado',
            component: CableadoPage,
            data: { title: 'CABLEADO', cycle: 'CICLO III', leaf: '10' },
          },
          {
            path: 'programacion',
            component: ProgramacionPage,
            data: { title: 'PROGRAMACIÓN', cycle: 'CICLO III', leaf: '11' },
          },
          {
            path: 'pruebas',
            component: PruebasPage,
            data: { title: 'PRUEBAS', cycle: 'CICLO III', leaf: '12' },
          },

          {
            path: 'avance',
            component: AvancePage,
            data: { title: 'AVANCE DEL PROYECTO', cycle: 'REPORTES', leaf: '13' },
          },
          {
            path: 'costos',
            component: CostosPage,
            data: { title: 'COSTOS', cycle: 'REPORTES', leaf: '14' },
          },
          {
            path: 'horas',
            component: HorasPage,
            data: { title: 'HORAS', cycle: 'REPORTES', leaf: '15' },
          },
          {
            path: 'indicadores',
            component: IndicadoresPage,
            data: { title: 'INDICADORES', cycle: 'REPORTES', leaf: '16' },
          },

          {
            path: 'datos',
            component: DatosPage,
            data: { title: 'DATOS DEL PROYECTO', cycle: 'CONFIGURACIÓN', leaf: '17' },
          },
          {
            path: 'usuarios',
            component: UsuariosPage,
            data: { title: 'USUARIOS', cycle: 'CONFIGURACIÓN', leaf: '18' },
          },
          {
            path: 'permisos',
            component: PermisosPage,
            data: { title: 'PERMISOS', cycle: 'CONFIGURACIÓN', leaf: '19' },
          },

          { path: '', pathMatch: 'full', redirectTo: 'documentacion' }, // ← antes apuntaba a 'folios', que no existe
        ],
      },
    ],
  },
  { path: '**', redirectTo: '' },
];

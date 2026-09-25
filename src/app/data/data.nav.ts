import { NavCycle } from '../core/models/nav.model';

export const INDUSTRIAL_NAV_TEMPLATE: NavCycle[] = [
  {
    id: 'CICLO I',
    label: 'INGENIERÍA & ESTIMACIÓN',
    leaves: [
      { id: '01', label: 'FOLIOS & PROYECTOS', route: 'folios' },
      { id: '02', label: 'LISTA DE MATERIALES / BOM', route: 'bom' },
      { id: '03', label: 'MANO DE OBRA & ETAPAS', route: 'mano-obra' },
      { id: '04', label: 'PLANTILLAS BASE', route: 'plantillas' },
    ],
  },
  {
    id: 'CICLO II',
    label: 'TALLER & PRODUCCIÓN', // O como lo tengas definido
    leaves: [
      { id: '05', label: 'COMPRAS', route: 'compras' }, // <-- CORREGIDO
      { id: '06', label: 'RECEPCIÓN DE MATERIALES', route: 'recepcion' }, // <-- CORREGIDO
      { id: '07', label: 'FABRICACIÓN', route: 'fabricacion' }, // <-- CORREGIDO
      { id: '08', label: 'ENSAMBLE', route: 'ensamble' }, // <-- CORREGIDO
    ],
  },
  {
    id: 'CICLO III',
    label: 'INSTALACIÓN & PUESTA EN MARCHA',
    leaves: [
      { id: '09', label: 'INSTALACIÓN', route: 'instalacion' },
      { id: '10', label: 'CABLEADO', route: 'cableado' },
      { id: '11', label: 'PROGRAMACIÓN', route: 'programacion' },
      { id: '12', label: 'PRUEBAS', route: 'pruebas' },
    ],
  },
  {
    id: 'REPORTES',
    label: 'REPORTES & CONTROL',
    leaves: [
      { id: '13', label: 'AVANCE DEL PROYECTO', route: 'avance' },
      { id: '14', label: 'COSTOS', route: 'costos' },
      { id: '15', label: 'HORAS', route: 'horas' },
      { id: '16', label: 'INDICADORES', route: 'indicadores' },
    ],
  },
  {
    id: 'CONFIGURACIÓN',
    label: 'CONFIGURACIÓN',
    leaves: [
      { id: '17', label: 'DATOS DEL PROYECTO', route: 'datos' },
      { id: '18', label: 'USUARIOS', route: 'usuarios' },
      { id: '19', label: 'PERMISOS', route: 'permisos' },
    ],
  },
];

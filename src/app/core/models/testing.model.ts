export type TestResult = 'PENDIENTE' | 'APROBADA' | 'FALLIDA' | 'CON OBSERVACIONES';

export interface TestCase {
  id: string;
  projectId: string;
  protocol: string; // nombre del caso/protocolo de prueba
  owner: string;
  result: TestResult;
  date: string; // ISO
  evidenceRef?: string; // referencia a evidencia, sin subida real de archivo
  notes?: string;
}

export type TemplateStatus = 'VIGENTE' | 'BORRADOR' | 'HISTÓRICA';

export interface TemplateInheritedBlock {
  label: string; // 'Materiales', 'Mano de obra', 'Parámetros eléctricos'
  source: string; // nombre de la plantilla origen
  overridden: boolean; // true si el proyecto lo modificó respecto a la plantilla
}

export interface ProjectTemplateSnapshot {
  projectId: string;
  templateName: string;
  version: string;
  family: string;
  author: string;
  appliedAt: string; // ISO
  status: TemplateStatus;
  blocks: TemplateInheritedBlock[];
}

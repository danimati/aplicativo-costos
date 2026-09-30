export interface CycleProgress {
  cycle: string;
  progress: number; // 0-100
}

export interface ProgressMilestone {
  label: string;
  done: boolean;
  date: string;
}

export interface ProjectProgressReport {
  overallProgress: number;
  cycles: CycleProgress[];
  milestones: ProgressMilestone[];
  blockers: string[];
}

export interface CostBreakdownItem {
  label: string;
  amount: number;
}

export interface ProjectCostReport {
  materials: number;
  labor: number;
  fixedCosts: number;
  variableCosts: number;
  indirectCosts: number;
  totalCost: number;
  marginPercent: number;
  estimatedProfit: number;
  finalEstimatedValue: number;
  breakdown: CostBreakdownItem[];
  actualCostAvailable: boolean; // RE-027 / RE-037: false hasta que exista costo ejecutado real
}

export interface HoursStageReport {
  name: string;
  hours: number;
  hourlyRate: number;
  cost: number;
}

export interface ProjectHoursReport {
  stages: HoursStageReport[];
  totalHours: number;
  totalCost: number;
  capacityStatus: 'PENDIENTE_DE_CARACTERIZACION'; // RE-015
}

export interface ProjectIndicator {
  id: string;
  label: string;
  value: string;
  source: string;
  isDemo: boolean;
}

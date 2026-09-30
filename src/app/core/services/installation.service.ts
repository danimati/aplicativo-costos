import { Observable } from 'rxjs';
import { InstallationActivity } from '../models/installation.model';
import { WiringCircuit } from '../models/wiring.model';
import { ProgrammingEntry } from '../models/programming.model';
import { TestCase } from '../models/testing.model';

export abstract class InstallationService {
  abstract getInstalacion(projectId: string): Observable<InstallationActivity[]>;
  abstract getCableado(projectId: string): Observable<WiringCircuit[]>;
  abstract getProgramacion(projectId: string): Observable<ProgrammingEntry[]>;
  abstract getPruebas(projectId: string): Observable<TestCase[]>;
}

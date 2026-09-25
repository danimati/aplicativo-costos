import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NavCycle } from '../models/nav.model';

@Injectable({ providedIn: 'root' })
export class NavStateService {
  private router = inject(Router); // inyectamos royter

  private _navTemplate = signal<NavCycle[]>([]);
  activeCycle = signal<string>('');
  activeLeaf = signal<string>('');
  nav = this._navTemplate.asReadonly();

  currentLeaves = computed(() => {
    const cycle = this._navTemplate().find((c) => c.id === this.activeCycle());
    return cycle?.leaves ?? [];
  });

  isMobileMenuOpen = signal(false);
  notice = signal('');

  private noticeTimeout?: ReturnType<typeof setTimeout>;

  loadTemplate(template: NavCycle[]): void {
    this._navTemplate.set(template);
    if (!template.length) {
      this.activeCycle.set('');
      this.activeLeaf.set('');
      return;
    }
    this.activeCycle.set(template[0].id);
    this.activeLeaf.set(template[0].leaves[0]?.id ?? '');
  }

  clearTemplate(): void {
    this._navTemplate.set([]);
    this.activeCycle.set('');
    this.activeLeaf.set('');
    this.isMobileMenuOpen.set(false);
    this.notice.set('');
    clearTimeout(this.noticeTimeout);
  }

  setCycle(cycleId: string): void {
    this.activeCycle.set(cycleId);
    const cycle = this._navTemplate().find((c) => c.id === cycleId);

    // 2. Si cambiamos de ciclo, navegamos automáticamente a su primera hoja
    if (cycle && cycle.leaves.length > 0) {
      this.navigateLeaf(cycle.leaves[0].id, cycle.leaves[0].route);
    }
  }

  // 3. Recibimos el leafId y la ruta (route) para navegar
  navigateLeaf(leafId: string, routePath: string): void {
    this.activeLeaf.set(leafId);

    // Mostrar aviso visual
    const leaf = this.currentLeaves().find((l) => l.id === leafId);
    if (leaf) {
      this.showNotice(`Cargando ${leaf.label} · datos de demostración`);
    }
    const currentUrl = this.router.url.split('/');
    const projectId = currentUrl[2]; // /proyectos/PRY-2024-089/bom -> [2] = 'PRY-2024-089'
    console.log('DATOS DE NAVEGACIÓN:', { leafId, routePath, projectId });

    if (projectId && routePath) {
      this.router.navigate(['/app/proyectos', projectId, routePath]);
    }
  }

  toggleMobileMenu(open?: boolean): void {
    this.isMobileMenuOpen.update((current) => open ?? !current);
  }

  showNotice(message: string): void {
    this.notice.set(message);
    clearTimeout(this.noticeTimeout);
    this.noticeTimeout = setTimeout(() => {
      this.notice.set('');
    }, 2400);
  }
}

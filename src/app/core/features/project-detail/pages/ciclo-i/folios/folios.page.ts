import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StampComponent } from '../../../../../shared/stamp/stamp.component';

@Component({
  selector: 'app-folios-page',
  imports: [StampComponent],
  template: `
    <div class="page-heading">
      <div class="section-mark">01</div>
      <div>
        <p class="eyebrow copper-text">CICLO I / INGENIERÍA & ESTIMACIÓN</p>
        <h1>Folios & Proyectos</h1>
        <p class="subheading">
          Registro maestro de documentos técnicos y parámetros base del proyecto.
        </p>
      </div>
      <div class="heading-actions">
        <button class="black-button small">+ NUEVO FOLIO</button>
      </div>
    </div>

    <div class="ledger-wrap compact-ledger">
      <div class="ledger-top">
        <span class="folio-label">RE-001 — REGISTRO PRINCIPAL</span>
        <span class="folio-label">03 FOLIOS</span>
      </div>

      <div class="table-scroll">
        <table class="ledger">
          <thead>
          <tr>
            <th>FOLIO</th>
            <th>CONCEPTO</th>
            <th>RESPONSABLE</th>
            <th>ESTADO</th>
            <th>FECHA</th>
          </tr>
          </thead>
          <tbody>
          <!-- Aquí después harás un @for con datos del backend -->
          <tr>
            <td class="mono">01</td>
            <td><strong>Parámetros base del proyecto</strong></td>
            <td>A. Morales</td>
            <td>
              <app-stamp [copperText]="true">VERIFICADO</app-stamp>
            </td>
            <td class="mono">22 SEP 2026</td>
          </tr>
          </tbody>
        </table>
      </div>

      <div class="ledger-footer">
        <span>TRAZABILIDAD COMPLETA</span>
        <span>METROLOGÍA CERTIFICADA</span>
      </div>
    </div>
  `,
  styles: [
    `
      /* Puedes poner CSS aquí o en un archivo externo */
    `,
  ],
})
export class FoliosPage {
  // Si necesitas saber el ID del proyecto para pedir datos al backend:
  private route = inject(ActivatedRoute);

  constructor() {
    const projectId = this.route.parent?.snapshot.paramMap.get('id');
    console.log('Cargando folios del proyecto:', projectId);
    // Aquí llamarías a tu proyectoService.getFolios(projectId)
  }
}

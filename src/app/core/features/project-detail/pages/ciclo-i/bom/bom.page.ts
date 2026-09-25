import { Component, inject, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { BomService } from '../../../../../services/bom.service';
import { BalancePanelComponent } from '../../../../../shared/balance-panel/balance-panel.component';
import { StampComponent } from '../../../../../shared/stamp/stamp.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { BomMaterial } from '../../../../../models/material.model';

@Component({
  selector: 'app-bom',
  imports: [BalancePanelComponent, StampComponent],
  templateUrl: './bom.page.html',
  styleUrl: './bom.page.css',
})
export class BomPage implements OnInit {
  private route = inject(ActivatedRoute);

  private bomService = inject(BomService);
  materials = toSignal(this.bomService.getMaterials('PRY-2024-089'), {
    initialValue: [] as BomMaterial[],
  });

  projectId = '';

  ngOnInit(): void {
    this.projectId = this.route.parent?.snapshot.paramMap.get('id') ?? '';

    console.log('Consultando BOM del proyecto:', this.projectId);

    // Aquí posteriormente:
    //
    // this.bomService.getBom(this.projectId)
    //
    // y cargamos los materiales.
  }

  specs = [
    ['TENSIÓN', '440 VCA'],
    ['PODER DE CORTE', '25 kA'],
    ['ENVOLVENTE', 'IP55 / TS8'],
    ['FAMILIA', 'CONTROL EXTRUSIÓN'],
    ['TC VIGENTE', '$ 18.42'],
  ];
}

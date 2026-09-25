export interface BomMaterial {
  id: string;
  description: string;
  supplier: string;
  calcType: 'EXACTO' | 'ESTIMADO';
  quantity: string;
  unitPrice: string;
  subtotal: string;
  note: string;
}

export interface CatalogMaterial {
  code: string;
  description: string;
  supplier: string;
  family: string;
  baseCost: string;
  status: string;
}

export interface CatalogProvider {
  code: string;
  supplier: string;
  specialty: string;
  location: string;
  catalogCount: string;
  status: string;
}

const MESES: Record<string, number> = {
  ENE: 0,
  FEB: 1,
  MAR: 2,
  ABR: 3,
  MAY: 4,
  JUN: 5,
  JUL: 6,
  AGO: 7,
  SEP: 8,
  OCT: 9,
  NOV: 10,
  DIC: 11,
};

/** Convierte 'DD MES AAAA' (ej. '22 SEP 2026') a Date */
export function parseSpanishDate(value: string): Date {
  const [day, mes, year] = value.trim().split(' ');
  const month = MESES[mes.toUpperCase().slice(0, 3)];
  if (month === undefined) throw new Error(`Mes no reconocido: "${mes}" en "${value}"`);
  return new Date(Number(year), month, Number(day));
}

export function toISO(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

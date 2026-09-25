/** Installed material prices per square foot (from the original tool). */
export const TILE_MATERIALS = [
  { key: 'vinyl', label: 'Vinyl', pricePerSqFt: 2 },
  { key: 'linoleum', label: 'Linoleum', pricePerSqFt: 3 },
  { key: 'cork', label: 'Cork', pricePerSqFt: 5 },
  { key: 'ceramic', label: 'Ceramic', pricePerSqFt: 7 },
  { key: 'travertine', label: 'Travertine', pricePerSqFt: 8 },
  { key: 'limestone', label: 'Limestone', pricePerSqFt: 9 },
  { key: 'porcelain', label: 'Porcelain', pricePerSqFt: 12 },
  { key: 'granite', label: 'Granite', pricePerSqFt: 15 },
  { key: 'pebble', label: 'Pebble', pricePerSqFt: 16 },
  { key: 'mosaic', label: 'Mosaic', pricePerSqFt: 17 },
  { key: 'glass', label: 'Glass', pricePerSqFt: 20 },
  { key: 'terrazzo', label: 'Terrazzo', pricePerSqFt: 25 },
  { key: 'metal', label: 'Metal', pricePerSqFt: 30 },
] as const;

export const TILE_EXTRAS = {
  suppliesPerSqFt: 1.06,
  disposalPerSqFt: 0.93,
  /** Tool rental: midpoint of $63–$95. */
  equipmentFlat: (63 + 95) / 2,
  /** Removing existing tile: midpoint of $210–$1,094 for a typical room. */
  removalFlat: (210 + 1094) / 2,
};

export interface TileFloorInput {
  areaSqFt: number;
  materialPricePerSqFt: number;
  wastePct: number;
  laborPerSqFt?: number;
  supplies?: boolean;
  equipment?: boolean;
  removal?: boolean;
  disposal?: boolean;
}

export interface TileFloorResult {
  materialSqFt: number;
  lines: { label: string; amount: number }[];
  total: number;
  perSqFt: number;
}

export function tileFloorCost(i: TileFloorInput): TileFloorResult | null {
  if (!(i.areaSqFt > 0)) return null;
  const materialSqFt = i.areaSqFt * (1 + i.wastePct / 100);
  const lines = [{ label: `Tile (${materialSqFt.toFixed(1)} sq ft incl. waste)`, amount: materialSqFt * i.materialPricePerSqFt }];
  if (i.laborPerSqFt) lines.push({ label: 'Installation labor', amount: i.areaSqFt * i.laborPerSqFt });
  if (i.supplies) lines.push({ label: 'Installation supplies', amount: i.areaSqFt * TILE_EXTRAS.suppliesPerSqFt });
  if (i.equipment) lines.push({ label: 'Equipment rental', amount: TILE_EXTRAS.equipmentFlat });
  if (i.removal) lines.push({ label: 'Remove existing flooring', amount: TILE_EXTRAS.removalFlat });
  if (i.disposal) lines.push({ label: 'Debris disposal', amount: i.areaSqFt * TILE_EXTRAS.disposalPerSqFt });
  const total = lines.reduce((s, l) => s + l.amount, 0);
  return { materialSqFt, lines, total, perSqFt: total / i.areaSqFt };
}

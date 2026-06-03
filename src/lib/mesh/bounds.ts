import type { ModelPrimitive } from "@/types";

export interface PrimitiveBounds {
  index: number;
  min: [number, number, number];
  max: [number, number, number];
  center: [number, number, number];
  minThicknessMm: number;
}

export function getPrimitiveBounds(
  primitives: ModelPrimitive[]
): PrimitiveBounds[] {
  return primitives.map((p, index) => {
    const [sx, sy, sz] = p.scale;
    const [px, py, pz] = p.position;
    const hx = Math.abs(sx) / 2;
    const hy = Math.abs(sy) / 2;
    const hz = Math.abs(sz) / 2;

    return {
      index,
      min: [px - hx, py - hy, pz - hz],
      max: [px + hx, py + hy, pz + hz],
      center: [px, py, pz],
      minThicknessMm: p.minThicknessMm ?? 2,
    };
  });
}

export function boundsOverlap(a: PrimitiveBounds, b: PrimitiveBounds): boolean {
  const pad = 0.02;
  return (
    a.min[0] - pad <= b.max[0] &&
    a.max[0] + pad >= b.min[0] &&
    a.min[1] - pad <= b.max[1] &&
    a.max[1] + pad >= b.min[1] &&
    a.min[2] - pad <= b.max[2] &&
    a.max[2] + pad >= b.min[2]
  );
}

export function findConnectedComponents(bounds: PrimitiveBounds[]): number[][] {
  const n = bounds.length;
  if (n === 0) return [];
  const parent = Array.from({ length: n }, (_, i) => i);

  function find(i: number): number {
    if (parent[i] !== i) parent[i] = find(parent[i]);
    return parent[i];
  }

  function union(i: number, j: number) {
    parent[find(i)] = find(j);
  }

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (boundsOverlap(bounds[i], bounds[j])) union(i, j);
    }
  }

  const groups = new Map<number, number[]>();
  for (let i = 0; i < n; i++) {
    const root = find(i);
    if (!groups.has(root)) groups.set(root, []);
    groups.get(root)!.push(i);
  }

  return Array.from(groups.values());
}

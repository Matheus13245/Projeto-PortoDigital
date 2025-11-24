// src/utils/route.ts
/**
 * Funções de rota / geodésicas simples.
 * - haversine: distância entre dois pontos em metros
 * - distanceBetweenKm: mesma coisa em km
 * - polylineLengthMeters: soma das distâncias entre uma lista de pontos
 */

export type LatLon = { lat: number; lon: number };

const EARTH_RADIUS_M = 6_371_000; // metros

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

/**
 * haversine - distância entre dois pontos (lat/lon) em metros
 * @param a { lat, lon }
 * @param b { lat, lon }
 * @returns distância em metros (number)
 */
export function haversine(a: LatLon, b: LatLon): number {
  if (a.lat === b.lat && a.lon === b.lon) return 0;

  const φ1 = toRad(a.lat);
  const φ2 = toRad(b.lat);
  const Δφ = toRad(b.lat - a.lat);
  const Δλ = toRad(b.lon - a.lon);

  const sinΔφ2 = Math.sin(Δφ / 2);
  const sinΔλ2 = Math.sin(Δλ / 2);

  const h =
    sinΔφ2 * sinΔφ2 +
    Math.cos(φ1) * Math.cos(φ2) * sinΔλ2 * sinΔλ2;

  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));

  return EARTH_RADIUS_M * c;
}

/**
 * distanceBetweenKm - wrapper que retorna a distância em quilômetros
 */
export function distanceBetweenKm(a: LatLon, b: LatLon): number {
  return haversine(a, b) / 1000;
}

/**
 * polylineLengthMeters - soma das distâncias entre os pontos em ordem
 * @param points array de {lat, lon}
 * @returns comprimento total em metros
 */
export function polylineLengthMeters(points: LatLon[]): number {
  if (!points || points.length < 2) return 0;
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    total += haversine(points[i - 1], points[i]);
  }
  return total;
}

/**
 * polylineLengthKm - mesmo que acima retornando km
 */
export function polylineLengthKm(points: LatLon[]): number {
  return polylineLengthMeters(points) / 1000;
}

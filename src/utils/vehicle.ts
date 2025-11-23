// src/utils/vehicle.ts
export type VehicleProfile = {
  id: string;
  name: string;
  range_km: number;
  battery_kwh: number;
};

export const VEHICLE_PROFILES: Record<string, VehicleProfile> = {
  economy: { id: 'economy', name: 'Economy', range_km: 400, battery_kwh: 75 },
  standard: { id: 'standard', name: 'Standard', range_km: 300, battery_kwh: 75 },
  performance: { id: 'performance', name: 'Performance', range_km: 220, battery_kwh: 85 },
};

export function consumptionKwhPerKm(profile: VehicleProfile): number {
  return profile.battery_kwh / profile.range_km;
}

export function availableRangeKm(profile: VehicleProfile, socPct: number): number {
  const soc = Math.max(0, Math.min(100, socPct || 0));
  return profile.range_km * (soc / 100);
}

export function energyNeededKwh(profile: VehicleProfile, distanceKm: number): number {
  const cons = consumptionKwhPerKm(profile);
  return cons * Math.max(0, distanceKm);
}

export function estimateChargeMinutes(
  kwhNeeded: number,
  stationKw: number,
  chargingEfficiency = 0.9
): number {
  if (!stationKw || stationKw <= 0) return Infinity;
  const effectiveKw = stationKw * chargingEfficiency;
  const hours = kwhNeeded / effectiveKw;
  return hours * 60;
}

export function socAfterCharging(currentSocPct: number, kwhAdded: number, profile: VehicleProfile): number {
  const battery = profile.battery_kwh;
  const currentKwh = (Math.max(0, Math.min(100, currentSocPct)) / 100) * battery;
  const finalKwh = Math.min(battery, currentKwh + Math.max(0, kwhAdded));
  return (finalKwh / battery) * 100;
}

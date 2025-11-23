// src/utils/autonomyHelpers.ts
import { haversine } from './route'; // assume já existe src/utils/route.ts
import {
  availableRangeKm,
  energyNeededKwh,
  estimateChargeMinutes,
  socAfterCharging,
  VehicleProfile
} from './vehicle';

/**
 * canReachPoint - verifica se com o SOC atual é possível alcançar dest a partir de origin
 */
export function canReachPoint(
  origin: { lat: number; lon: number },
  dest: { lat: number; lon: number },
  profile: VehicleProfile,
  socPct: number
) {
  const distMeters = haversine(origin, dest);
  const distKm = distMeters / 1000;
  const availableKm = availableRangeKm(profile, socPct);
  return { reachable: distKm <= availableKm, distKm, availableKm };
}

/**
 * simulateChargeThenReach - simula ir até station, carregar o mínimo para alcançar target
 */
export function simulateChargeThenReach(
  origin: { lat: number; lon: number },
  station: { lat: number; lon: number; tags?: any },
  targetPoint: { lat: number; lon: number },
  profile: VehicleProfile,
  currentSocPct: number,
  marginFactor = 1.1
) {
  const toStationMeters = haversine(origin, { lat: station.lat, lon: station.lon });
  const distToStationKm = toStationMeters / 1000;
  const availableKm = availableRangeKm(profile, currentSocPct);
  const canReachStation = distToStationKm <= availableKm;

  const stationToTargetMeters = haversine({ lat: station.lat, lon: station.lon }, targetPoint);
  const distStationToTargetKm = stationToTargetMeters / 1000;

  // energia necessária da estação ao target (com margem)
  const neededForTargetKwh = energyNeededKwh(profile, distStationToTargetKm * marginFactor);

  // kWh atual ao chegar na estação (consumo desde origin -> station)
  const kwhToStation = energyNeededKwh(profile, distToStationKm);
  const batteryKwh = profile.battery_kwh;
  const currentKwh = (currentSocPct / 100) * batteryKwh;
  const kwhAfterArrive = Math.max(0, currentKwh - kwhToStation);

  // quanto adicionar para garantir chegada ao target
  let kwhToAdd = Math.max(0, neededForTargetKwh - kwhAfterArrive);
  kwhToAdd = Math.min(kwhToAdd, Math.max(0, batteryKwh - kwhAfterArrive));

  // descobrir power do posto (fallback 50 kW)
  const stationKw = (() => {
    if (!station.tags) return 50;
    const p = station.tags.power_kw || station.tags['charging:power'] || station.tags.max_power_kw || station.tags.output_kw;
    const n = Number(p);
    return isFinite(n) && n > 0 ? n : 50;
  })();

  const chargeMinutes = estimateChargeMinutes(kwhToAdd, stationKw);
  const socAfter = socAfterCharging((kwhAfterArrive / batteryKwh) * 100, kwhToAdd, profile);
  const availableKmAfter = availableRangeKm(profile, socAfter);
  const canReachTargetAfterCharge = distStationToTargetKm <= availableKmAfter;

  return {
    canReachStation,
    distToStationKm,
    distStationToTargetKm,
    kwhToStation,
    kwhAfterArrive,
    neededForTargetKwh,
    kwhToAdd,
    stationKw,
    chargeMinutes,
    socAfter,
    canReachTargetAfterCharge,
    availableKm,
    availableKmAfter
  };
}

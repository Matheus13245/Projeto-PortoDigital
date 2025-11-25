// autonomyHelpers.ts
// Centraliza utilitários de autonomia / recomendações.
// Cole este arquivo na raiz do projeto (ex: /path/to/project/autonomyHelpers.ts)

// Se você já tem um arquivo vehicle_model_profiles.ts em src/utils,
// importe a função findModelProfile para derivar consumo por modelo:
import { findModelProfile } from '../utils/vehicle_model_profiles'; // ajuste se seu arquivo estiver em outro lugar

type Posto = {
  id: number;
  nome: string;
  latitude: number;
  longitude: number;
  endereco?: string;
  fila?: {
    lenta?: { vagas: number; fila: number };
    media?: { vagas: number; fila: number };
    rapida?: { vagas: number; fila: number };
  };
};

type CarInfo = {
  modelo?: string;
  autonomiaKm?: number;
  bateriaPercent: number;
  bateriaKwh?: number;
};

export type RecoOptions = {
  consumptionKwhPerKm?: number;
  avgServiceMinutes?: number;
  travelSpeedKmh?: number;
  preferConnector?: 'rapida' | 'media' | 'lenta' | null;
  typicalPowers?: { rapida: number; media: number; lenta: number };
  efficiency?: number;
};

function haversineKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }) {
  const R = 6371.0;
  const lat1 = (a.lat * Math.PI) / 180.0;
  const lon1 = (a.lon * Math.PI) / 180.0;
  const lat2 = (b.lat * Math.PI) / 180.0;
  const lon2 = (b.lon * Math.PI) / 180.0;
  const dlat = lat2 - lat1;
  const dlon = lon2 - lon1;
  const sa =
    Math.sin(dlat / 2) * Math.sin(dlat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) * Math.sin(dlon / 2);
  const c = 2 * Math.atan2(Math.sqrt(sa), Math.sqrt(1 - sa));
  return R * c;
}

function estimateWaitMinutes(queueCount: number, slots: number, avgServiceMinutes = 30) {
  if (!isFinite(queueCount) || !isFinite(slots) || slots <= 0) return Number.POSITIVE_INFINITY;
  const rounds = queueCount / slots;
  return rounds * avgServiceMinutes;
}

export function simulateChargeThenReach(
  origin: { lat: number; lon: number },
  station: { lat: number; lon: number },
  target: { lat: number; lon: number },
  profile: { range_km: number; battery_kwh?: number },
  socPercent: number,
  consumptionFactor = 1.1
) {
  // consumo médio baseado na autonomia do carro
  const batteryKwh = profile?.battery_kwh ?? 50;
  const consumptionKwhPerKm =
    batteryKwh / profile.range_km || 0.18;

  const availableKwh = batteryKwh * (socPercent / 100);
  const availableKm = availableKwh / consumptionKwhPerKm;

  const distToStationKm = haversineKm(origin, station);
  const distStationToTargetKm = haversineKm(station, target);

  const canReachStation = distToStationKm <= availableKm;

  // se não alcança o posto, retorna imediatamente
  if (!canReachStation) {
    return {
      canReachStation: false,
      canReachTargetAfterCharge: false,
      distToStationKm,
      distStationToTargetKm,
      kwhToAdd: 0,
      chargeMinutes: 0,
    };
  }

  // kWh necessários para completar a rota
  const kmNeeded = distStationToTargetKm * consumptionFactor;
  const kwhNeeded = kmNeeded * consumptionKwhPerKm;

  const remainingKwhAfterArrival = availableKwh - distToStationKm * consumptionKwhPerKm;
  const kwhToAdd = Math.max(0, kwhNeeded - remainingKwhAfterArrival);

  // assumir potência média do carregador rápido
  const chargerKw = 50;
  const chargeHours = kwhToAdd / chargerKw;
  const chargeMinutes = chargeHours * 60;

  const canReachTargetAfterCharge = kwhToAdd <= batteryKwh;

  return {
    canReachStation,
    canReachTargetAfterCharge,
    distToStationKm,
    distStationToTargetKm,
    kwhToAdd,
    chargeMinutes,
  };
}

function estimateChargeHours(kwhToAdd: number, chargerKw: number, efficiency = 0.9) {
  if (!isFinite(kwhToAdd) || !isFinite(chargerKw) || chargerKw <= 0) return NaN;
  return kwhToAdd / (chargerKw * efficiency);
}

/**
 * Deriva consumo (kWh/km) e batteryKwh a partir do carro e dos perfis de modelo.
 */
function deriveConsumptionAndBattery(userCar: CarInfo, opts: RecoOptions) {
  const profile = findModelProfile(userCar?.modelo);
  let consumption = opts.consumptionKwhPerKm ?? 0.18;
  let batteryKwh = userCar?.bateriaKwh;
  if (userCar?.bateriaKwh && userCar?.autonomiaKm) {
    consumption = userCar.bateriaKwh / userCar.autonomiaKm;
    batteryKwh = userCar.bateriaKwh;
  } else if (profile && (profile as any).consumption_kwh_per_km) {
    consumption = (profile as any).consumption_kwh_per_km;
    batteryKwh = batteryKwh ?? (profile as any).battery_kwh;
  } else if (profile && (profile as any).battery_kwh && userCar?.autonomiaKm) {
    consumption = (profile as any).battery_kwh / userCar.autonomiaKm;
    batteryKwh = (profile as any).battery_kwh;
  } else {
    consumption = (profile as any).consumption_kwh_per_km ?? consumption;
  }

  return { consumptionKwhPerKm: consumption, batteryKwh };
}

/**
 * recommendStationsForAuthUser:
 * - userCar: objeto do AuthContext (user.carro)
 * - userLocation: { latitude, longitude }
 * - postos: array de postos (fonte: src/data/postos)
 * - options: heurísticas
 *
 * Retorna { userCar, availableKm, results[] } com results ordenados por scoreMinutes.
 */
export function recommendStationsForAuthUser(
  userCar: CarInfo,
  userLocation: { latitude: number; longitude: number },
  postos: Posto[],
  options?: RecoOptions
) {
  const opts: RecoOptions = {
    consumptionKwhPerKm: 0.18,
    avgServiceMinutes: 30,
    travelSpeedKmh: 70,
    preferConnector: null,
    typicalPowers: { rapida: 150, media: 50, lenta: 7.4 },
    efficiency: 0.9,
    ...(options ?? {}),
  };

  const derived = deriveConsumptionAndBattery(userCar, opts);
  const consumption = derived.consumptionKwhPerKm;
  const batteryKwh = derived.batteryKwh;

  let availableKm = 0;
  if (userCar?.autonomiaKm) {
    availableKm = userCar.autonomiaKm * ((userCar?.bateriaPercent ?? 0) / 100.0);
  } else if (batteryKwh && consumption > 0) {
    availableKm = (batteryKwh * ((userCar?.bateriaPercent ?? 0) / 100.0)) / consumption;
  } else {
    availableKm = 0;
  }

  const results = postos.map((posto) => {
    const origin = { lat: userLocation.latitude, lon: userLocation.longitude };
    const dest = { lat: posto.latitude, lon: posto.longitude };
    const distKm = haversineKm(origin, dest);
    const canReach = distKm <= availableKm + 1e-9;

    const rapidaSlots = (posto.fila?.rapida?.vagas ?? 0);
    const mediaSlots = (posto.fila?.media?.vagas ?? 0);
    const lentaSlots = (posto.fila?.lenta?.vagas ?? 0);

    let chosenType: 'rapida' | 'media' | 'lenta' = 'rapida';
    if (opts.preferConnector) chosenType = opts.preferConnector;
    else if (rapidaSlots > 0) chosenType = 'rapida';
    else if (mediaSlots > 0) chosenType = 'media';
    else chosenType = 'lenta';

    const queueCount = posto.fila?.[chosenType]?.fila ?? 0;
    const slots = posto.fila?.[chosenType]?.vagas ?? 0;
    const waitMin = estimateWaitMinutes(queueCount, slots, opts.avgServiceMinutes);

    const deficitKm = Math.max(0, distKm - availableKm);
    const deficitKwh = deficitKm * consumption;

    const chargerKw = opts.typicalPowers?.[chosenType] ?? 7.4;
    const chargeHours = isFinite(deficitKwh) && chargerKw > 0 ? estimateChargeHours(deficitKwh, chargerKw, opts.efficiency) : 0;
    const chargeMin = (chargeHours || 0) * 60;

    const travelMin = (distKm / (opts.travelSpeedKmh || 70)) * 60;

    const totalMin = canReach ? travelMin + waitMin + chargeMin : travelMin + waitMin + chargeMin + 10000;

    return {
      postoId: posto.id,
      nome: posto.nome,
      distKm: Number(distKm.toFixed(2)),
      canReach,
      availableKm: Number(availableKm.toFixed(2)),
      deficitKm: Number(deficitKm.toFixed(2)),
      deficitKwh: Number(deficitKwh.toFixed(3)),
      chosenType,
      waiterMinutes: Number(waitMin === Number.POSITIVE_INFINITY ? -1 : Number(waitMin.toFixed(1))),
      chargeMinutes: Number(chargeMin.toFixed(1)),
      travelMinutes: Number(travelMin.toFixed(1)),
      scoreMinutes: Number(totalMin.toFixed(1)),
      raw: { consumption, batteryKwh, derived },
    };
  });

  results.sort((a, b) => a.scoreMinutes - b.scoreMinutes);
  return { userCar, availableKm: Number(availableKm.toFixed(2)), results };
}

// src/utils/vehicle_model_profiles.ts
// Perfil de modelos — números aproximados e conservadores para estimativas.
// Valores são estimativas para simulação, ajuste conforme dados reais.
export type ModelProfile = {
  modelMatch: string; // substring para casar com o nome do modelo (lowercase compare)
  battery_kwh?: number; // capacidade nominal da bateria (kWh)
  consumption_kwh_per_km?: number; // consumo típico (kWh/km)
  notes?: string;
};

export const MODEL_PROFILES: ModelProfile[] = [
  { modelMatch: 'tesla model x', battery_kwh: 100, consumption_kwh_per_km: 0.22, notes: 'SUV elétrico grande — consumo conservador' },
  { modelMatch: 'tesla model 3', battery_kwh: 75, consumption_kwh_per_km: 0.16, notes: 'Sedan eficiente' },
  { modelMatch: 'nissan leaf', battery_kwh: 40, consumption_kwh_per_km: 0.18, notes: 'Compacto elétrico' },
  { modelMatch: 'vw id.4', battery_kwh: 77, consumption_kwh_per_km: 0.17, notes: 'SUV médio elétrico' },
  { modelMatch: 'byd', battery_kwh: 60, consumption_kwh_per_km: 0.15, notes: 'BYD (Atto/Seal) estimativa média' },
  { modelMatch: 'hyundai kona', battery_kwh: 64, consumption_kwh_per_km: 0.14, notes: 'Compact SUV eficiente' },
  // fallback (se nenhum casar)
  { modelMatch: '', battery_kwh: undefined, consumption_kwh_per_km: 0.18, notes: 'padrão genérico' },
];

export function findModelProfile(modelName?: string) {
  if (!modelName || modelName.trim() === '') {
    return MODEL_PROFILES[MODEL_PROFILES.length - 1];
  }
  const low = modelName.toLowerCase();
  for (const p of MODEL_PROFILES) {
    if (p.modelMatch && low.includes(p.modelMatch)) return p;
  }
  // fallback genérico
  return MODEL_PROFILES[MODEL_PROFILES.length - 1];
}

// src/context/VehicleContext.tsx
import React, { createContext, useState, ReactNode } from 'react';
import { VEHICLE_PROFILES } from '../utils/vehicle';

type VehicleProfile = typeof VEHICLE_PROFILES[keyof typeof VEHICLE_PROFILES];

type VehicleState = {
  profile: VehicleProfile;
  soc: number;
  setProfile: (p: VehicleProfile) => void;
  setSoc: (s: number) => void;
};

export const VehicleContext = createContext<VehicleState>({
  profile: VEHICLE_PROFILES.standard,
  soc: 80,
  setProfile: () => {},
  setSoc: () => {},
});

export function VehicleProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<VehicleProfile>(VEHICLE_PROFILES.standard);
  const [soc, setSoc] = useState<number>(80);

  return (
    <VehicleContext.Provider value={{ profile, soc, setProfile, setSoc }}>
      {children}
    </VehicleContext.Provider>
  );
}

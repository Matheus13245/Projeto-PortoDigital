// src/components/ProfileSelector.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { RadioButton, Text, Button, TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VEHICLE_PROFILES, VehicleProfile, availableRangeKm } from '../../utils/vehicle';

const STORAGE_KEY = '@ev_profile';

type Props = {
  onChange?: (profile: VehicleProfile, soc: number) => void;
};

export default function ProfileSelector({ onChange }: Props) {
  const [profileId, setProfileId] = useState<string>('standard');
  const [soc, setSoc] = useState<string>('80');

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.profileId) setProfileId(parsed.profileId);
          if (parsed.soc !== undefined) setSoc(String(parsed.soc));
        }
      } catch (e) {}
    })();
  }, []);

  useEffect(() => {
    const profile = VEHICLE_PROFILES[profileId];
    const socNum = Number(soc) || 0;
    if (onChange) onChange(profile, socNum);
  }, [profileId, soc]);

  const save = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ profileId, soc }));
    } catch (e) {}
  };

  const profile = VEHICLE_PROFILES[profileId];
  const available = Math.round(availableRangeKm(profile, Number(soc || 0)));

  return (
    <View style={styles.container}>
      <Text variant="titleMedium">Perfil do veículo</Text>

      <RadioButton.Group onValueChange={(v) => setProfileId(v)} value={profileId}>
        {Object.values(VEHICLE_PROFILES).map((p) => (
          <View key={p.id} style={styles.row}>
            <RadioButton value={p.id} />
            <View>
              <Text>{`${p.name} — ${p.range_km} km nominal`}</Text>
              <Text variant="bodySmall">{`${p.battery_kwh} kWh`}</Text>
            </View>
          </View>
        ))}
      </RadioButton.Group>

      <TextInput
        label="SOC inicial (%)"
        value={String(soc)}
        keyboardType="numeric"
        onChangeText={(t) => setSoc(t.replace(/[^0-9]/g, ''))}
        style={{ marginTop: 8, marginBottom: 8 }}
      />
      <Text>{`Autonomia disponível estimada: ${available} km`}</Text>

      <View style={{ height: 8 }} />
      <Button mode="contained" onPress={save}>
        Salvar perfil
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12, backgroundColor: 'white', borderRadius: 8, elevation: 2 },
  row: { flexDirection: 'row', alignItems: 'center', marginVertical: 6 },
});

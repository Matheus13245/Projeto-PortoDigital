// src/screens/Tabs/ProfileSelector.tsx
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import {
  RadioButton,
  Text,
  Button,
  TextInput,
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  VEHICLE_PROFILES,
  VehicleProfile,
  availableRangeKm,
} from "../../utils/vehicle";
import { COLORS } from "../../styles/theme";
import { styles } from "./ProfileSelector.styles";

const STORAGE_KEY = "@ev_profile";

type Props = {
  onChange?: (profile: VehicleProfile, soc: number) => void;
};

export default function ProfileSelector({ onChange }: Props) {
  const [profileId, setProfileId] = useState<string>("standard");
  const [soc, setSoc] = useState<string>("80");

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.profileId) setProfileId(parsed.profileId);
          if (parsed.soc !== undefined) setSoc(String(parsed.soc));
        }
      } catch (e) {
        // silencioso por enquanto
      }
    })();
  }, []);

  useEffect(() => {
    const profile = VEHICLE_PROFILES[profileId];
    const socNum = Number(soc) || 0;
    if (onChange) onChange(profile, socNum);
  }, [profileId, soc, onChange]);

  const save = async () => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ profileId, soc })
      );
    } catch (e) {
      // silencioso por enquanto
    }
  };

  const profile = VEHICLE_PROFILES[profileId];
  const available = Math.round(
    availableRangeKm(profile, Number(soc || 0))
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil do veículo</Text>

      <RadioButton.Group
        onValueChange={(v) => setProfileId(v)}
        value={profileId}
      >
        {Object.values(VEHICLE_PROFILES).map((p) => (
          <View key={p.id} style={styles.row}>
            <RadioButton
              value={p.id}
              color={COLORS.primaryButton}
              uncheckedColor={COLORS.textMuted}
            />
            <View>
              <Text style={styles.profileName}>
                {`${p.name} — ${p.range_km} km nominal`}
              </Text>
              <Text style={styles.profileDetails}>
                {`${p.battery_kwh} kWh`}
              </Text>
            </View>
          </View>
        ))}
      </RadioButton.Group>

      <TextInput
        label="SOC inicial (%)"
        value={String(soc)}
        keyboardType="numeric"
        onChangeText={(t) => setSoc(t.replace(/[^0-9]/g, ""))}
        mode="flat"
        style={styles.input}
        underlineColor="transparent"
        textColor={COLORS.textPrimary}
        theme={{
          colors: {
            primary: COLORS.primaryButton,
            background: COLORS.inputBackground,
            placeholder: COLORS.textMuted,
            onSurface: COLORS.textPrimary,
          },
        }}
      />

      <Text style={styles.availableText}>
        {`Autonomia disponível estimada: ${available} km`}
      </Text>

      <Button
        mode="contained"
        onPress={save}
        style={styles.saveButton}
        labelStyle={styles.saveButtonLabel}
      >
        Salvar perfil
      </Button>
    </View>
  );
}

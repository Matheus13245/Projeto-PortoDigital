// src/screens/CarInfoScreen.tsx
import React, { useContext } from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { VehicleContext } from '../../context/VehicleContext';
import { availableRangeKm } from '../../utils/vehicle';
import ProfileSelector from './ProfileSelector';

export default function CarInfoScreen() {
  const { profile, soc, setProfile, setSoc } = useContext(VehicleContext);

  if (!profile) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ color: '#fff' }}>Perfil do veículo não configurado.</Text>
      </SafeAreaView>
    );
  }

  const autonomiaDisponivel = Math.round(availableRangeKm(profile, soc));
  const kmText = `${autonomiaDisponivel} km`;
  const percentText = `${Math.round(soc)}% • ${profile.battery_kwh} kWh`;

  const batteryLevelStyle = {
    height: `${Math.max(0, Math.min(100, soc))}%` as any,
    backgroundColor: soc > 60 ? '#4dff4d' : soc > 25 ? '#ffdd57' : '#ff6b6b',
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Feather name="x" size={26} color="#ffffff" />
        <View style={styles.headerRight}>
          <Ionicons name="wifi" size={20} color="#ffffff" style={{ marginRight: 12 }} />
          <Ionicons name="battery-half" size={22} color="#ffffff" />
        </View>
      </View>

      <View style={styles.carPlaceholder}>
        <MaterialCommunityIcons name="car-electric" size={90} color="#00eaff" />
      </View>

      <View style={styles.centerText}>
        <Text style={styles.modelTitle}>Tesla Model X</Text>
        <Text style={styles.modelSub}>{autonomiaDisponivel} km • recarregue</Text>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Bateria</Text>
          <Text style={styles.infoSmall}>Última recarga 4 dias atrás</Text>

          <View style={styles.batteryRow}>
            <View style={styles.batteryBar}>
              <View style={[styles.batteryLevel, batteryLevelStyle]} />
            </View>

            <View>
              <Text style={styles.kmText}>{kmText}</Text>
              <Text style={styles.percentText}>{percentText}</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Clima</Text>
          <Text style={styles.infoSmall}>Interior 22°</Text>

          <View style={styles.climateCircle}>
            <Text style={styles.climateValue}>18°</Text>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 18 }}>
        <ProfileSelector onChange={(p, s) => { setProfile(p); setSoc(s); }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1216',
    padding: 20,
    paddingTop: 45,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  carPlaceholder: {
    width: '100%',
    height: 180,
    backgroundColor: '#1a1f25',
    borderRadius: 18,
    marginTop: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00eaff33',
  },
  centerText: { alignItems: 'center', marginTop: 15 },
  modelTitle: { color: '#fff', fontSize: 22, fontWeight: '600' },
  modelSub: { color: '#9ca3af', marginTop: 3 },
  infoContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 25 },
  infoBox: { width: '47%', padding: 18, backgroundColor: '#171c22', borderRadius: 18 },
  infoTitle: { color: '#fff', fontSize: 15, fontWeight: '600' },
  infoSmall: { color: '#7d7d7d', fontSize: 12, marginBottom: 12 },
  batteryRow: { flexDirection: 'row', alignItems: 'center' },
  batteryBar: { width: 26, height: 60, borderRadius: 8, backgroundColor: '#0d4d0d', justifyContent: 'flex-end', padding: 2, marginRight: 12, overflow: 'hidden' },
  batteryLevel: { width: '100%', borderRadius: 6 },
  kmText: { color: '#fff', fontSize: 20, fontWeight: '700' },
  percentText: { color: '#aaa', fontSize: 12 },
  climateCircle: { width: 74, height: 74, backgroundColor: '#1d242b', borderRadius: 50, borderWidth: 5, borderColor: '#00eaff55', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 10 },
  climateValue: { color: '#00d4ff', fontSize: 21, fontWeight: '700' },
});

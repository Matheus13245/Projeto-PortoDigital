// src/screens/Tabs/StationRecommendationsAuth.tsx
import React, { useMemo } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { postos } from '../../data/postos';
import { recommendStationsForAuthUser } from '../../utils/autonomyHelpers';

export default function StationRecommendationsAuth() {
  const { user } = useAuth();
  const route = useRoute();
  const routeParams: any = (route && (route.params as any)) || {};

  if (!user) {
    return (
      <View style={{ padding: 16 }}>
        <Text>Nenhum usuário autenticado (mock).</Text>
      </View>
    );
  }

  const userLocation = routeParams.userLocation ?? user.location ?? { latitude: -7.9367, longitude: -34.8708 };

  // fallback seguro caso user.carro seja undefined
  const fallbackCar = {
    modelo: 'Veículo padrão',
    bateriaPercent: user.carro?.bateriaPercent ?? 50,
    batteryKwh: user.carro?.bateriaPercent ?? 60,
    range_km: user.carro?.autonomiaKm ?? 200,
  };

  const rec = useMemo(() => {
    const car = user.carro ?? fallbackCar;
    return recommendStationsForAuthUser(car, userLocation, postos, {
      consumptionKwhPerKm: 0.18,
      avgServiceMinutes: 30,
      travelSpeedKmh: 70,
    });
  }, [user, JSON.stringify(userLocation)]);

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <Text style={{ fontWeight: '700', fontSize: 18, marginBottom: 8 }}>
        Recomendações para {user.name} — {user.carro?.modelo ?? 'Veículo não informado'}
      </Text>
      <Text style={{ marginBottom: 8 }}>
        Nível bateria: {user.carro?.bateriaPercent ?? '—'}% • Alcance teórico: {rec.availableKm ?? '—'} km
      </Text>

      <FlatList
        data={rec.results}
        keyExtractor={(item) => String(item.postoId)}
        renderItem={({ item, index }) => (
          <View style={{ paddingVertical: 10, borderBottomWidth: 1, borderColor: '#eee' }}>
            <Text style={{ fontWeight: '700' }}>
              {index + 1}. {item.nome} — {item.distKm} km
            </Text>
            <Text>
              {item.canReach ? 'Alcançável' : 'Inalcançável'} • Tempo estimado (min):{' '}
              {item.scoreMinutes === Number.POSITIVE_INFINITY ? '—' : item.scoreMinutes}
            </Text>
            <Text>
              Viagem {item.travelMinutes} • Espera {item.waiterMinutes >= 0 ? item.waiterMinutes + ' min' : '—'} • Carga{' '}
              {item.chargeMinutes} min
            </Text>
            <Text>
              Deficit: {item.deficitKm} km ({item.deficitKwh} kWh) • Conector: {item.chosenType}
            </Text>
            <Text style={{ color: '#666', marginTop: 6 }}>
              Detalhes técnicos: consumo {item.raw?.consumption?.toFixed?.(3) ?? '—'} kWh/km • batteryKwh:{' '}
              {item.raw?.batteryKwh ?? '—'}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

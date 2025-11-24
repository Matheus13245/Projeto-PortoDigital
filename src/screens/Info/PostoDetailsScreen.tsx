import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/RootNavigator";
import FavoriteButton from "../../components/FavoriteButton";
import { postos, Posto } from "../../data/postos";
import * as Location from "expo-location";
import { VehicleContext } from "../../context/VehicleContext";
import { simulateChargeThenReach } from "../../utils/autonomyHelpers";

type PostoDetailsRouteProps = RouteProp<RootStackParamList, "PostoDetails">;
type NavigationProps = NativeStackNavigationProp<RootStackParamList, "PostoDetails">;

export default function PostoDetailsScreen() {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<PostoDetailsRouteProps>();

  // Recebe os parâmetros básicos do posto
  const { id, nome, latitude, longitude, userLocation } = route.params as any;

  // Busca o posto completo na base de dados (para pegar a fila)
  const postoCompleto: Posto | undefined = postos.find((p) => p.id === id);

  const { profile, soc } = useContext(VehicleContext);

  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(
    userLocation ?? null
  );
  const [checking, setChecking] = useState<boolean>(false);
  const [canCreate, setCanCreate] = useState<boolean | null>(null);
  const [checkMsg, setCheckMsg] = useState<string | null>(null);

  // Se não recebeu userLocation pelos params, tenta obter a localização do aparelho
  useEffect(() => {
    if (currentLocation) return;
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setCheckMsg("Permissão de localização necessária para verificar autonomia.");
          setCanCreate(false);
          return;
        }
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        if (loc?.coords) {
          setCurrentLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
        } else {
          setCheckMsg("Não foi possível obter localização para checar autonomia.");
          setCanCreate(false);
        }
      } catch (err) {
        console.error("Erro ao obter localização:", err);
        setCheckMsg("Erro ao obter localização.");
        setCanCreate(false);
      }
    })();
  }, []);

  // Faz a checagem de autonomia automaticamente quando tiver localização e perfil
  useEffect(() => {
    if (!currentLocation || !profile) return;

    let mounted = true;
    (async () => {
      try {
        setChecking(true);
        const origin = { lat: currentLocation.latitude, lon: currentLocation.longitude };
        const station = { lat: latitude, lon: longitude };
        const target = origin; // queremos só ir até o posto

        // simulateChargeThenReach é síncrona no seu projeto — usamos diretamente.
        const result = simulateChargeThenReach(origin, station, target, profile, soc, 1.1);

        if (!mounted) return;
        setCanCreate(result?.canReachStation ?? false);
        if (!result?.canReachStation) {
          const add = typeof result?.kwhToAdd === 'number' ? result.kwhToAdd : null;
          setCheckMsg(
            add !== null
              ? `Impossível: precisa de ${add.toFixed(2)} kWh (SOC atual insuficiente).`
              : 'Impossível com a autonomia atual.'
          );
        } else {
          setCheckMsg(null);
        }
      } catch (err) {
        console.error("Erro ao checar autonomia:", err);
        setCheckMsg("Falha ao simular autonomia.");
        setCanCreate(false);
      } finally {
        if (mounted) setChecking(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [currentLocation, profile, soc, latitude, longitude]);

  const handleCriarRota = async () => {
    // antes de criar rota, garante que checagem final é feita
    if (!currentLocation) {
      Alert.alert("Localização ausente", "Não foi possível obter sua localização para criar a rota.");
      return;
    }
    if (!profile) {
      Alert.alert("Dados do veículo ausentes", "Profile do veículo não está disponível.");
      return;
    }

    try {
      setChecking(true);
      const origin = { lat: currentLocation.latitude, lon: currentLocation.longitude };
      const station = { lat: latitude, lon: longitude };
      const target = origin;
      const result = simulateChargeThenReach(origin, station, target, profile, soc, 1.1);

      if (!result?.canReachStation) {
        const add = typeof result?.kwhToAdd === 'number' ? result.kwhToAdd : null;
        Alert.alert(
          'Impossível criar rota',
          add !== null
            ? `Com o SOC atual o veículo NÃO alcança este posto. Necessita de ${add.toFixed(2)} kWh.`
            : 'Com o SOC atual o veículo NÃO alcança este posto.',
          [{ text: 'OK' }]
        );
        setCanCreate(false);
        setCheckMsg('Impossível com a autonomia atual.');
        return;
      }

      // alcançável: navega para Map (Main -> Map) entregando rotaDestino
      navigation.navigate('Main', {
        screen: 'Map',
        params: {
          rotaDestino: {
            latitude,
            longitude,
            nome,
          },
        },
      });
    } catch (err) {
      console.error('Erro ao criar rota:', err);
      Alert.alert('Erro', 'Falha ao verificar autonomia: ' + String(err));
    } finally {
      setChecking(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{nome}</Text>

      {/* Card da fila */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Fila de Espera</Text>

        <View style={styles.queueContainer}>
          {postoCompleto?.fila ? (
            <>
              <Text style={styles.queueItem}>
                🔋 Carga Lenta — Vagas: {postoCompleto.fila.lenta.vagas} | Fila: {postoCompleto.fila.lenta.fila} pessoas
              </Text>

              <Text style={styles.queueItem}>
                ⚡ Carga Média — Vagas: {postoCompleto.fila.media.vagas} | Fila: {postoCompleto.fila.media.fila} pessoas
              </Text>

              <Text style={styles.queueItem}>
                🚀 Carga Rápida — Vagas: {postoCompleto.fila.rapida.vagas} | Fila: {postoCompleto.fila.rapida.fila} pessoas
              </Text>
            </>
          ) : (
            <Text style={styles.placeholder}>Nenhuma informação disponível.</Text>
          )}
        </View>
      </View>

      {/* Mensagem de checagem */}
      {checking && <ActivityIndicator style={{ marginVertical: 12 }} />}
      {checkMsg ? <Text style={{ color: canCreate ? 'green' : 'red', marginBottom: 12 }}>{checkMsg}</Text> : null}

      {/* Botão para criar rota */}
      <TouchableOpacity
        style={[styles.button, canCreate === false && { backgroundColor: '#aaa' }]}
        onPress={handleCriarRota}
        disabled={checking || canCreate === false}
      >
        <Text style={styles.buttonText}>{canCreate === false ? 'Criar rota (não possível)' : 'Criar rota até o posto'}</Text>
      </TouchableOpacity>

      {/* Botão de adicionar aos favoritos */}
      <FavoriteButton
        posto={{
          id,
          nome,
          latitude,
          longitude,
        }}
      />
    </View>
  );
}

// ------------------ STYLES ---------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    borderRadius: 10,
    marginBottom: 25,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
  },

  queueContainer: {
    marginTop: 10,
  },

  queueItem: {
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 8,
    borderRadius: 8,
    borderColor: "#ddd",
    borderWidth: 1,
    color: "#333",
  },

  placeholder: {
    marginTop: 10,
    color: "#555",
  },

  button: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});


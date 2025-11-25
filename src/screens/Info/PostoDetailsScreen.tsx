// src/screens/PostoDetailsScreen.tsx
import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import FavoriteButton from "../../components/FavoriteButton";
import { postos, Posto } from "../../data/postos";
import * as Location from "expo-location";
import { VehicleContext } from "../../context/VehicleContext";
import { availableRangeKm } from "../../utils/vehicle";

type PostoDetailsRouteProps = RouteProp<any, "PostoDetails">;

const CHARGE_OPTIONS = [
  { id: "lenta", label: "🔋 Lenta (10–12h)", kw: 7 },
  { id: "media", label: "⚡ Média (4–6h)", kw: 50 },
  { id: "rapida", label: "🚀 Rápida (~30 min)", kw: 150 },
];

export default function PostoDetailsScreen() {
  const route = useRoute<PostoDetailsRouteProps>();
  const navigation = useNavigation<any>();
  const { id, nome, latitude, longitude } = route.params as any;

  const postoCompleto: Posto | undefined = postos.find((p) => p.id === id);

  const { profile, soc } = useContext(VehicleContext);

  const [selectedCharge, setSelectedCharge] = useState<
    "lenta" | "media" | "rapida" | null
  >(null);
  const [calculatedTime, setCalculatedTime] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [canReach, setCanReach] = useState<boolean>(false);

  // pega localização do usuário para cálculo de alcance
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setUserLocation(null);
        } else {
          const loc = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Highest,
          });
          if (loc?.coords)
            setUserLocation({
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
            });
        }
      } catch (e) {
        console.warn("erro location", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // calcula se é alcançável (com vehicle context). fallback se profile não existir.
  useEffect(() => {
    if (!userLocation || !postoCompleto) {
      setCanReach(false);
      return;
    }
    // se profile ausente (usuário sem carro), usamos fallback de carro fictício
    const usedProfile = profile ?? {
      id: "default",
      name: "Fictício",
      range_km: 300,
      battery_kwh: 75,
    };
    const usedSoc = soc === undefined || soc === null ? 80 : soc;

    const distKm = haversineKm(
      userLocation.latitude,
      userLocation.longitude,
      postoCompleto.latitude,
      postoCompleto.longitude
    );
    const availableKm = availableRangeKm(usedProfile as any, usedSoc);
    setCanReach(distKm <= availableKm);
  }, [userLocation, profile, soc, postoCompleto]);

  // cálculo da fila (mantive sua lógica)
  useEffect(() => {
    if (!selectedCharge || !postoCompleto?.fila) {
      setCalculatedTime(null);
      return;
    }

    const filaInfo = postoCompleto.fila[selectedCharge];

    const temposTotais = { lenta: 660, media: 300, rapida: 30 };
    const temposRestantes = { lenta: 420, media: 180, rapida: 20 };

    const tempoTotal = temposTotais[selectedCharge];
    const tempoRestante = temposRestantes[selectedCharge];

    const vagasTotais = filaInfo.vagas;
    const pessoasNaFila = filaInfo.fila;

    const vagasOcupadas = vagasTotais;
    const tempoOcupados = vagasOcupadas * tempoRestante;
    const tempoFila =
      pessoasNaFila > 0 ? (pessoasNaFila / vagasTotais) * tempoTotal : 0;

    const tempoFinal = tempoOcupados + tempoFila;
    setCalculatedTime(tempoFinal);
  }, [selectedCharge, postoCompleto]);

  // util haversine (km)
  function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  function navigateToMapSafe(
    navigation: any,
    rotaDestino: any,
    chargeType?: string
  ) {
    const params = { rotaDestino, chargeType };

    // 1) tentativa direta (nome simples 'Map')
    try {
      navigation.navigate("Map", params);
      return;
    } catch (e) {
      /* ignore */
    }

    // 2) tentar com nome alternativo comum
    try {
      navigation.navigate("MapScreen", params);
      return;
    } catch (e) {
      /* ignore */
    }

    // 3) se Map está dentro de um navigator filho (ex.: Root -> MainStack)
    // ajuste 'Root' e 'Main' para os nomes dos seus stacks, se houver
    try {
      navigation.navigate("Root", { screen: "Map", params });
      return;
    } catch (e) {
      /* ignore */
    }

    // 4) tentar navegar pelo parent (quando PostoDetails está em um stack filho)
    const parent = navigation.getParent && navigation.getParent();
    if (parent && typeof parent.navigate === "function") {
      try {
        parent.navigate("Map", params);
        return;
      } catch (e) {
        /* ignore */
      }
      try {
        parent.navigate("MapScreen", params);
        return;
      } catch (e) {
        /* ignore */
      }
    }

    Alert.alert(
      "Erro de Navegação",
      "Nome da tela Map não encontrado no navigator. Verifique o arquivo de rotas (Stack.Screen name)."
    );
  }
  function navigateToMapFromDetails(
    navigation: any,
    rotaDestino: any,
    chargeType?: string
  ) {
    const params = { rotaDestino, chargeType };

    // Caso mais comum: Map dentro de Main (MainTabs)
    try {
      navigation.navigate("Main", {
        screen: "Map",
        params,
      });
      return;
    } catch {}

    // fallback
    try {
      navigation.navigate("Map", params);
      return;
    } catch {}

    const parent = navigation.getParent && navigation.getParent();
    if (parent && typeof parent.navigate === "function") {
      try {
        parent.navigate("Main", { screen: "Map", params });
        return;
      } catch {}
    }

    alert(
      "Rota 'Map' não encontrada. Verifique se o name da screen no MainTabs é realmente 'Map'."
    );
  }

  const onCreateRoutePress = () => {
    if (!postoCompleto) {
      Alert.alert("Erro", "Posto não encontrado.");
      return;
    }

    if (!userLocation) {
      Alert.alert("Localização", "Não foi possível obter sua localização.");
      return;
    }

    if (!canReach) {
      Alert.alert(
        "Impossível",
        "Com o SOC atual o veículo não alcança esse posto."
      );
      return;
    }

    if (!selectedCharge) {
      Alert.alert(
        "Escolher tipo",
        "Escolha o tipo de recarga antes de criar a rota."
      );
      return;
    }

    // navegar para a tela Map que está dentro de MainTabs (tenta via helper que faz fallbacks)
    navigateToMapFromDetails(
      navigation,
      {
        latitude: postoCompleto.latitude,
        longitude: postoCompleto.longitude,
        nome: postoCompleto.nome,
      },
      selectedCharge
    );
  };

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  if (!postoCompleto)
    return (
      <View style={styles.center}>
        <Text>Posto não encontrado</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{postoCompleto.nome}</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Fila de Espera</Text>

        {!postoCompleto?.fila ? (
          <Text>Nenhuma informação disponível.</Text>
        ) : (
          <>
            <Text style={styles.sectionLabel}>
              Selecione o tipo de carregamento:
            </Text>

            <Picker
              selectedValue={selectedCharge}
              onValueChange={(value) => setSelectedCharge(value)}
              style={styles.picker}
            >
              <Picker.Item label="Escolher..." value={null} />
              <Picker.Item label="🔋 Lenta (10–12h)" value="lenta" />
              <Picker.Item label="⚡ Média (4–6h)" value="media" />
              <Picker.Item label="🚀 Rápida (~30 min)" value="rapida" />
            </Picker>

            {selectedCharge && (
              <View style={styles.infoBox}>
                <Text style={styles.resultTitle}>
                  {selectedCharge === "lenta" && "🔋 Carga Lenta"}
                  {selectedCharge === "media" && "⚡ Carga Média"}
                  {selectedCharge === "rapida" && "🚀 Carga Rápida"}
                </Text>

                {(() => {
                  const filaInfo = postoCompleto.fila[selectedCharge];

                  const vagasTotais = filaInfo.vagas;
                  const vagasOcupadas = vagasTotais;
                  const pessoasNaFila = filaInfo.fila;
                  const vagasDisponiveis = Math.max(
                    vagasTotais - vagasOcupadas,
                    0
                  );

                  return (
                    <>
                      <Text style={styles.resultText}>
                        Vagas totais: {vagasTotais}
                      </Text>
                      <Text style={styles.resultText}>
                        Vagas ocupadas (carregando): {vagasOcupadas}
                      </Text>
                      <Text style={styles.resultText}>
                        Pessoas esperando na fila: {pessoasNaFila}
                      </Text>
                      <Text style={styles.resultText}>
                        Vagas disponíveis agora: {vagasDisponiveis}
                      </Text>
                      <Text style={styles.resultText}>
                        Tempo estimado até sua vez:{" "}
                        {calculatedTime !== null
                          ? calculatedTime > 60
                            ? `${Math.ceil(calculatedTime / 60)}h`
                            : `${Math.ceil(calculatedTime)} min`
                          : "-"}
                      </Text>
                    </>
                  );
                })()}
              </View>
            )}
          </>
        )}
      </View>

      {/* botão Criar rota: - disabled se inalcançável; - se alcançável, disabled até escolher tipo */}
      <View style={{ marginTop: 12 }}>
        <TouchableOpacity
          style={[
            styles.createButton,
            !canReach || !selectedCharge
              ? styles.buttonDisabled
              : styles.buttonPrimary,
          ]}
          disabled={!canReach || !selectedCharge}
          onPress={onCreateRoutePress}
        >
          <Text style={{ color: "#fff", fontWeight: "700" }}>
            {!canReach
              ? "Impossível com SOC atual"
              : !selectedCharge
              ? "Escolha tipo de recarga"
              : "Criar rota"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* FavoriteButton (mantive sua posição) */}
      <View style={{ marginTop: 18 }}>
        <FavoriteButton posto={{ id, nome, latitude, longitude }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  card: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    borderRadius: 10,
    marginBottom: 25,
  },
  cardTitle: { fontSize: 18, fontWeight: "600" },
  sectionLabel: { marginTop: 10, fontWeight: "500" },
  picker: { backgroundColor: "#fff", borderRadius: 8, marginTop: 10 },
  infoBox: {
    marginTop: 15,
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  resultTitle: { fontWeight: "700", fontSize: 16, marginBottom: 8 },
  resultText: { marginTop: 3, color: "#333" },
  createButton: { padding: 14, borderRadius: 10, alignItems: "center" },
  buttonPrimary: { backgroundColor: "#007AFF" },
  buttonDisabled: { backgroundColor: "#cccccc" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});

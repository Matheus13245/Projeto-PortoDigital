// src/screens/MapScreen.tsx
import React, { useEffect, useState, useRef, useContext } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import MapView, {
  Marker,
  Callout,
  Region,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import * as Location from "expo-location";
import MapViewDirections from "react-native-maps-directions";
import mapStyle from "../../config/mapStyle.json";
import { postos, Posto } from "../../data/postos";
import FloatingButton from "../../components/FloatingButton";
import { useNavigation, useRoute } from "@react-navigation/native";
import { VehicleContext } from "../../context/VehicleContext";
import {
  simulateChargeThenReach,
  recommendStationsForAuthUser,
} from "../../utils/autonomyHelpers";
import { availableRangeKm, consumptionKwhPerKm } from "../../utils/vehicle";

const GOOGLE_MAPS_APIKEY = "AIzaSyBp1V7-y6aMDOj2-wRBNFdjpGb47QrSjCY";

export default function MapScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const params: any = route.params;

  const { profile, soc } = useContext(VehicleContext);

  const [location, setLocation] =
    useState<Location.LocationObjectCoords | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [destino, setDestino] = useState<{
    latitude: number;
    longitude: number;
    nome?: string;
  } | null>(null);
  const [waypoints, setWaypoints] = useState<
    { latitude: number; longitude: number }[]
  >([]);
  const [directionsKey, setDirectionsKey] = useState<number>(Date.now());

  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    // se PostoDetails navegou para cá com rotaDestino, cria rota
    if (params?.rotaDestino) {
      setDestino({
        latitude: params.rotaDestino.latitude,
        longitude: params.rotaDestino.longitude,
        nome: params.rotaDestino.nome,
      });
      setDirectionsKey(Date.now());
      mapRef.current?.animateToRegion(
        {
          latitude: params.rotaDestino.latitude,
          longitude: params.rotaDestino.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      );
    }
  }, [params]);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permissão de localização negada");
          setLoading(false);
          return;
        }
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        });
        if (loc?.coords) setLocation(loc.coords);
        else setErrorMsg("Não foi possível obter coordenadas válidas.");
      } catch (err) {
        console.error("Erro ao obter localização:", err);
        setErrorMsg("Erro ao obter localização: " + String(err));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const region: Region | undefined = location
    ? {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }
    : undefined;

  const calcularDistanciaKm = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const canReachPostoFromLocation = (posto: Posto) => {
    if (!location || !profile) return false;
    const distKm = calcularDistanciaKm(
      location.latitude,
      location.longitude,
      posto.latitude,
      posto.longitude
    );
    const availableKm = availableRangeKm(profile, soc);
    return distKm <= availableKm;
  };

  const createRouteToPosto = (posto: Posto) => {
    const newDestino = {
      latitude: posto.latitude,
      longitude: posto.longitude,
      nome: posto.nome,
    };
    setDestino(newDestino);
    setWaypoints([]);
    setDirectionsKey(Date.now());
    setTimeout(() => {
      mapRef.current?.animateToRegion(
        {
          latitude: posto.latitude,
          longitude: posto.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        700
      );
    }, 200);
    Alert.alert("Rota criada", `Rota criada até ${posto.nome}.`);
  };

  const handlePostoMaisProximo = () => {
    if (!location) return;
    let menorDistancia = Infinity;
    let postoMaisProximo: Posto | null = null;
    for (const posto of postos) {
      const dist = calcularDistanciaKm(
        location.latitude,
        location.longitude,
        posto.latitude,
        posto.longitude
      );
      if (dist < menorDistancia) {
        menorDistancia = dist;
        postoMaisProximo = posto;
      }
    }
    if (postoMaisProximo) createRouteToPosto(postoMaisProximo);
  };

  // Recomendar (botão verde à esquerda, pequeno)
  const onRecommendLeftPress = () => {
    if (!location || !profile) {
      Alert.alert("Erro", "Localização ou perfil do veículo não disponíveis.");
      return;
    }

    const userCar = {
      bateriaPercent: soc,
      batteryKwh: profile.battery_kwh,
      range_km: profile.range_km,
      connectors: (profile as any)?.connectors ?? ["ccs"],
      modelo: profile.name,
    };

    const userLocation = {
      latitude: location.latitude,
      longitude: location.longitude,
    };

    const opts = {
      consumptionKwhPerKm: consumptionKwhPerKm(profile),
      avgServiceMinutes: 12,
      travelSpeedKmh: 40,
    };

    let rec;
    try {
      rec = recommendStationsForAuthUser(userCar, userLocation, postos, opts);
    } catch (e) {
      console.error("Erro recommendStationsForAuthUser:", e);
      Alert.alert("Erro", "Falha ao calcular recomendações.");
      return;
    }

    if (!rec || !rec.results || rec.results.length === 0) {
      Alert.alert(
        "Nenhuma recomendação",
        "Não foram encontradas estações recomendadas."
      );
      return;
    }

    const top = rec.results[0];
    const stationObj = postos.find((p) => p.id === top.postoId) as
      | Posto
      | undefined;

    const sim = stationObj
      ? simulateChargeThenReach(
          { lat: location.latitude, lon: location.longitude },
          { lat: stationObj.latitude, lon: stationObj.longitude },
          destino
            ? { lat: destino!.latitude, lon: destino!.longitude }
            : { lat: location.latitude, lon: location.longitude },
          profile,
          soc,
          1.1
        )
      : null;

    const messageLines = [
      `Recomendado: ${top.nome} — ${top.distKm.toFixed(1)} km`,
      `Alcançável: ${top.canReach ? "Sim" : "Não"}`,
      `Tempo total estimado (min): ${
        Number.isFinite(top.scoreMinutes) ? top.scoreMinutes : "—"
      }`,
      `Espera média: ${
        top.waiterMinutes >= 0 ? top.waiterMinutes + " min" : "—"
      }`,
      `Tempo de carga estimado: ${
        top.chargeMinutes ??
        (sim ? Math.round(sim.chargeMinutes) + " min" : "—")
      }`,
    ];

    Alert.alert(
      "Posto recomendado",
      messageLines.join("\n"),
      [
        {
          text: "Criar rota",
          onPress: () => stationObj && createRouteToPosto(stationObj),
        },
        {
          text: "Navegar até posto",
          onPress: () =>
            stationObj &&
            mapRef.current?.animateToRegion(
              {
                latitude: stationObj.latitude,
                longitude: stationObj.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              },
              800
            ),
        },
        { text: "Cancelar", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  if (errorMsg)
    return (
      <View style={styles.center}>
        <Text>{errorMsg}</Text>
      </View>
    );
  if (!location || !region)
    return (
      <View style={styles.center}>
        <Text>Localização não encontrada</Text>
      </View>
    );

  const markerColorFor = (posto: Posto) =>
    canReachPostoFromLocation(posto) ? "green" : "red";

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        showsUserLocation
        followsUserLocation
        customMapStyle={mapStyle}
        initialRegion={region}
      >
        {postos.map((posto) => (
          <Marker
            key={posto.id}
            coordinate={{
              latitude: posto.latitude,
              longitude: posto.longitude,
            }}
            title={posto.nome}
            onPress={() =>
              navigation.navigate("PostoDetails", {
                id: posto.id,
                nome: posto.nome,
                latitude: posto.latitude,
                longitude: posto.longitude,
              })
            }
          >
            <Image
              source={require("../../assets/gas-station.png")}
              style={{
                width: 35,
                height: 35,
                tintColor: markerColorFor(posto),
              }}
            />
            <Callout tooltip>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>{posto.nome}</Text>
                <Text style={styles.calloutAddress}>{posto.endereco}</Text>
                <View style={styles.calloutButtons}>
                  <TouchableOpacity
                    style={[
                      styles.calloutButton,
                      canReachPostoFromLocation(posto)
                        ? styles.buttonPrimary
                        : styles.buttonDisabled,
                    ]}
                    disabled={!canReachPostoFromLocation(posto)}
                    onPress={() => createRouteToPosto(posto)}
                  >
                    <Text style={styles.calloutButtonText}>
                      {canReachPostoFromLocation(posto)
                        ? "Criar rota"
                        : "Não alcançável"}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.calloutButton, styles.buttonSecondary]}
                    onPress={() =>
                      navigation.navigate("PostoDetails", {
                        id: posto.id,
                        nome: posto.nome,
                        latitude: posto.latitude,
                        longitude: posto.longitude,
                      })
                    }
                  >
                    <Text style={styles.calloutButtonText}>Detalhes</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Callout>
          </Marker>
        ))}

        {destino && location && (
          <MapViewDirections
            key={directionsKey}
            origin={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            destination={{
              latitude: destino.latitude,
              longitude: destino.longitude,
            }}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={5}
            strokeColor="blue"
            waypoints={waypoints}
            optimizeWaypoints={false}
            onReady={(result) => {
              try {
                if (result?.coordinates?.length) {
                  mapRef.current?.fitToCoordinates(result.coordinates, {
                    edgePadding: { top: 100, right: 50, bottom: 100, left: 50 },
                    animated: true,
                  });
                }
              } catch (e) {
                console.warn("onReady error", e);
              }
            }}
            onError={(err) => {
              console.warn("MapViewDirections error:", err);
              Alert.alert(
                "Erro Directions API",
                JSON.stringify(err).slice(0, 800)
              );
            }}
          />
        )}
      </MapView>

      {/* FloatingButton (Favorito) - posicionado onde o botão azul estava */}
      <View style={styles.fabContainer}>
        <FloatingButton />
      </View>

      {/* Botão 'Recomendar rota' pequeno (verde) - um pouquinho acima do 'Posto mais próximo' */}
      <TouchableOpacity
        style={[styles.leftSmallButton, { left: 20 }]}
        onPress={onRecommendLeftPress}
      >
        <Text style={styles.smallButtonText}>Recomendar rota</Text>
      </TouchableOpacity>

      {/* botão "Posto mais próximo" (esquerda inferior) */}
      <TouchableOpacity
        style={[styles.button, { left: 20 }]}
        onPress={handlePostoMaisProximo}
      >
        <Text style={styles.buttonText}>Posto mais próximo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  leftSmallButton: {
    position: "absolute",
    bottom: 90,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    elevation: 4,
    backgroundColor: "#28A745",
  },
  smallButtonText: { color: "#fff", fontWeight: "600", fontSize: 13 },

  button: {
    position: "absolute",
    bottom: 30,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 25,
    elevation: 4,
    backgroundColor: "#007AFF",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },

  calloutContainer: {
    width: 220,
    padding: 8,
    backgroundColor: "white",
    borderRadius: 8,
    alignItems: "flex-start",
  },
  calloutTitle: { fontWeight: "700", marginBottom: 4 },
  calloutAddress: { fontSize: 12, color: "#444", marginBottom: 8 },
  calloutButtons: {
    flexDirection: "row",
    alignSelf: "stretch",
    justifyContent: "space-between",
  },
  calloutButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    minWidth: 90,
    alignItems: "center",
  },
  buttonPrimary: { backgroundColor: "#007AFF" },
  buttonSecondary: { backgroundColor: "#eee" },
  buttonDisabled: { backgroundColor: "#cccccc" },
  calloutButtonText: { color: "#fff", fontWeight: "600" },

  fabContainer: { position: "absolute", right: 20, bottom: 30, zIndex: 10 },
});

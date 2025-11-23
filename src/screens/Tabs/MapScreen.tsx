// src/screens/MapScreen.tsx
import React, { useEffect, useState, useRef, useContext, useMemo } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import MapView, { Marker, Region, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import MapViewDirections from "react-native-maps-directions";
import mapStyle from "../../config/mapStyle.json";
import { postos, Posto } from "../../data/postos";
import FloatingButton from "../../components/FloatingButton";
import { useNavigation, useRoute } from "@react-navigation/native";
import { VehicleContext } from "../../context/VehicleContext";
import { simulateChargeThenReach } from "../../utils/autonomyHelpers";

const GOOGLE_MAPS_APIKEY = "AIzaSyBp1V7-y6aMDOj2-wRBNFdjpGb47QrSjCY";

type MapRouteParams = {
  rotaDestino?: {
    latitude: number;
    longitude: number;
    nome: string;
  };
};

export default function MapScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const params = route.params as MapRouteParams | undefined;

  const { profile, soc } = useContext(VehicleContext);

  // evita cliques rápidos/duplicados em postos
  const [processingPostoId, setProcessingPostoId] = useState<number | null>(null);
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [destino, setDestino] = useState<{
    latitude: number;
    longitude: number;
    nome?: string;
  } | null>(null);

  // waypoints (postos inseridos no roteiro)
  const [waypoints, setWaypoints] = useState<{ latitude: number; longitude: number }[]>([]);

  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (params?.rotaDestino) {
      setDestino(params.rotaDestino);
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
        const { status } =
          await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          setErrorMsg("Permissão de localização negada");
          setLoading(false);
          return;
        }

        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        });

        if (loc?.coords) {
          setLocation(loc.coords);
        } else {
          setErrorMsg("Não foi possível obter coordenadas válidas.");
        }
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

  // distância haversine (km)
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
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handlePressPosto = (posto: Posto) => {
    setDestino({
      latitude: posto.latitude,
      longitude: posto.longitude,
      nome: posto.nome,
    });
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

    if (postoMaisProximo) {
      setDestino({
        latitude: postoMaisProximo.latitude,
        longitude: postoMaisProximo.longitude,
        nome: postoMaisProximo.nome,
      });

      mapRef.current?.animateToRegion(
        {
          latitude: postoMaisProximo.latitude,
          longitude: postoMaisProximo.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.center}>
        <Text>{errorMsg}</Text>
      </View>
    );
  }

  if (!location || !region) {
    return (
      <View style={styles.center}>
        <Text>Localização não encontrada</Text>
      </View>
    );
  }

  // handler chamado ao tocar no marcador de posto
  
  // Handler seguro para evitar múltiplos cliques rápidos que causam crashes
  const onMarkerPressSafe = (posto: Posto) => {
    if (processingPostoId !== null) {
      // já processando outro posto — ignora clique
      return;
    }
    setProcessingPostoId(posto.id);

    try {
      navigation.navigate("PostoDetails", {
        id: posto.id,
        nome: posto.nome,
        latitude: posto.latitude,
        longitude: posto.longitude,
        userLocation: location ? { latitude: location.latitude, longitude: location.longitude } : undefined
      });
    } catch (err) {
      console.error("Erro ao navegar para PostoDetails:", err);
      Alert.alert("Erro", "Não foi possível abrir detalhes do posto.");
    } finally {
      // pequeno delay para prevenir double-clicks em sequência
      setTimeout(() => setProcessingPostoId(null), 700);
    }
  };

const onStationPress = async (posto: Posto) => {
    try {
      const origin = { lat: location.latitude, lon: location.longitude };
      const target = destino ? { lat: destino.latitude, lon: destino.longitude } : origin;

      // simulateChargeThenReach retorna vários dados úteis
      const result = simulateChargeThenReach(
        origin,
        { lat: posto.latitude, lon: posto.longitude ?? {} },
        target,
        profile,
        soc,
        1.1
      );

      if (!result.canReachStation) {
        Alert.alert(
          "Impossível alcançar",
          "Com o SOC atual o veículo não alcança esse posto.",
          [{ text: "OK" }]
        );
        return;
      }

      const minutes = Math.round(result.chargeMinutes);
      const driveToStationMin = Math.round((result.distToStationKm / 40) * 60); // 40 km/h média urbana
      const canContinueText = result.canReachTargetAfterCharge ? "Sim" : "Não";

      const message =
        `Distância até posto: ${result.distToStationKm.toFixed(1)} km\n` +
        `Distância do posto ao destino: ${result.distStationToTargetKm.toFixed(1)} km\n` +
        `Carga necessária: ${result.kwhToAdd.toFixed(2)} kWh\n` +
        `Tempo estimado de recarga: ${minutes} min\n` +
        `Consegue continuar até o destino após carga? ${canContinueText}`;

      Alert.alert(
        "Verificação de autonomia",
        message,
        [
          {
            text: "Inserir no roteiro",
            onPress: () => {
              // adiciona waypoint (posto) antes do destino
              setWaypoints((prev) => [
                ...prev,
                { latitude: posto.latitude, longitude: posto.longitude },
              ]);
              // centraliza no posto
              mapRef.current?.animateToRegion(
                {
                  latitude: posto.latitude,
                  longitude: posto.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                },
                800
              );
            },
          },
          {
            text: "Navegar até posto",
            onPress: () => {
              mapRef.current?.animateToRegion(
                {
                  latitude: posto.latitude,
                  longitude: posto.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                },
                800
              );
            },
          },
          { text: "Cancelar", style: "cancel" },
        ],
        { cancelable: true }
      );
    } catch (err) {
      console.error("Erro onStationPress:", err);
      Alert.alert("Erro", "Falha ao verificar autonomia: " + String(err));
    }
  };

  // função para decidir cor do marcador (verde se alcançável até o posto com soc atual)

  // compute marker colors consistently with simulateChargeThenReach (memoized)
  
  // marker color based on simple distance check to avoid calling simulateChargeThenReach during render
  const markerColorFor = (posto: Posto) => {
    if (!location || !profile) return 'gray';
    const origin = { lat: location.latitude, lon: location.longitude };
    const distKm = calcularDistanciaKm(origin.lat, origin.lon, posto.latitude, posto.longitude);
    const availableKm = profile ? profile.range_km * (soc / 100) : 0;
    return distKm <= availableKm ? 'green' : 'red';
  };



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
            description={posto.endereco}
            onPress={() =>
              // abertura do modal de detalhes preservada para navegação direta
              onMarkerPressSafe(posto)
            }
            onCalloutPress={() => onStationPress(posto)} // ao abrir callout, chama verificação
          >
            <View style={[styles.markerWrap]}>
              <Image
                source={require("../../assets/gas-station.png")}
                style={{ width: 35, height: 35, tintColor: markerColorFor(posto) }}
              />
            </View>
          </Marker>
        ))}

        {destino && (
          <MapViewDirections
            origin={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            destination={destino}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={5}
            strokeColor="blue"
            waypoints={waypoints}
            optimizeWaypoints={false}
            onReady={(result) => {
              // ajusta viewport para incluir toda rota
              mapRef.current?.fitToCoordinates(result.coordinates, {
                edgePadding: {
                  top: 100,
                  right: 50,
                  bottom: 100,
                  left: 50,
                },
                animated: true,
              });
            }}
            onError={(err) => {
              console.warn("MapViewDirections error:", err);
            }}
          />
        )}
      </MapView>

      <FloatingButton />

      <TouchableOpacity style={styles.button} onPress={handlePostoMaisProximo}>
        <Text style={styles.buttonText}>Posto mais próximo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  button: {
    position: "absolute",
    bottom: 30,
    left: 20,
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 25,
    elevation: 4,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },

  markerWrap: { alignItems: "center", justifyContent: "center" },
});

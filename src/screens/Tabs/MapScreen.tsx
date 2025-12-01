// src/screens/Tabs/MapScreen.tsx
import React, { useEffect, useState, useRef, useContext } from "react";
import {
  View,
  ActivityIndicator,
  Text,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import MapView, { Marker, Region, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import MapViewDirections from "react-native-maps-directions";
import { useNavigation, useRoute } from "@react-navigation/native";

import mapStyle from "../../config/mapStyle.json";
import { postos, Posto } from "../../data/postos";
import FloatingButton from "../../components/FloatingButton";
import { VehicleContext } from "../../context/VehicleContext";
import { simulateChargeThenReach } from "../../utils/autonomyHelpers";
import { styles } from "./MapScreen.styles";

const GOOGLE_MAPS_APIKEY = "AIzaSyBp1V7-y6aMDOj2-wRBNFdjpGb47QrSjCY";

// ------------------------------
// MOCK visual: postos fora de alcance
// ------------------------------
const MOCK_OUT_OF_RANGE = [1, 4, 5, 6, 7, 12, 13];

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

  const [processingPostoId, setProcessingPostoId] = useState<number | null>(null);
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
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

  const mapRef = useRef<MapView>(null);

  // Se veio rota pré-definida de outra tela
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

  // Obter localização
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
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  if (!location || !region) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Localização não encontrada</Text>
      </View>
    );
  }

  // -------------------------------------------------------------
  // 🔥 Agora SEM bloqueio — SEMPRE abre detalhes do posto
  // -------------------------------------------------------------
  const onMarkerPressOpenDetails = (posto: Posto) => {
    if (processingPostoId !== null) return;

    setProcessingPostoId(posto.id);

    navigation.navigate("PostoDetails", {
      id: posto.id,
      nome: posto.nome,
      latitude: posto.latitude,
      longitude: posto.longitude,
      userLocation: location
        ? { latitude: location.latitude, longitude: location.longitude }
        : undefined,
    });

    setTimeout(() => setProcessingPostoId(null), 700);
  };

  // -------------------------------------------------------------
  // 🔥 CalloutPress agora também NÃO bloqueia mais nada
  // -------------------------------------------------------------
  const onStationPress = async (posto: Posto) => {
    try {
      const origin = { lat: location.latitude, lon: location.longitude };
      const target = destino
        ? { lat: destino.latitude, lon: destino.longitude }
        : origin;

      const result = simulateChargeThenReach(
        origin,
        { lat: posto.latitude, lon: posto.longitude ?? {} },
        target,
        profile,
        soc,
        1.1
      );

      const minutes = Math.round(result.chargeMinutes);

      Alert.alert(
        "Informações do posto",
        `Distância até posto: ${result.distToStationKm.toFixed(1)} km\n` +
          `Carga necessária estimada: ${result.kwhToAdd.toFixed(2)} kWh\n` +
          `Tempo estimado de recarga: ${minutes} min`,
        [
          {
            text: "Ver detalhes",
            onPress: () =>
              navigation.navigate("PostoDetails", {
                id: posto.id,
                nome: posto.nome,
                latitude: posto.latitude,
                longitude: posto.longitude,
                userLocation: location
                  ? { latitude: location.latitude, longitude: location.longitude }
                  : undefined,
              }),
          },
          { text: "Fechar", style: "cancel" },
        ]
      );
    } catch (err) {
      console.error("Erro onStationPress:", err);
      Alert.alert("Erro", "Falha ao obter dados: " + String(err));
    }
  };

  const markerColorFor = (posto: Posto) => {
    if (!location || !profile) return "gray";

    const distKm = calcularDistanciaKm(
      location.latitude,
      location.longitude,
      posto.latitude,
      posto.longitude
    );

    const availableKm = profile.range_km * (soc / 100);

    return distKm <= availableKm ? "green" : "red";
  };

  // =====================================================================
  // RENDER
  // =====================================================================
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
        {postos.map((posto) => {
          const isOut = MOCK_OUT_OF_RANGE.includes(posto.id);

          return (
            <Marker
              key={posto.id}
              coordinate={{
                latitude: posto.latitude,
                longitude: posto.longitude,
              }}
              title={posto.nome}
              description={posto.endereco}
              onPress={() => onMarkerPressOpenDetails(posto)}
              onCalloutPress={() => onStationPress(posto)}
            >
              <View style={styles.markerWrap}>
                <Image
                  source={require("../../assets/gas-station.png")}
                  style={{
                    width: 35,
                    height: 35,
                    tintColor: isOut ? "#999" : markerColorFor(posto),
                    opacity: isOut ? 0.45 : 1,
                  }}
                />
              </View>
            </Marker>
          );
        })}

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
              mapRef.current?.fitToCoordinates(result.coordinates, {
                edgePadding: { top: 100, right: 50, bottom: 100, left: 50 },
                animated: true,
              });
            }}
            onError={(err) => console.warn("MapViewDirections error:", err)}
          />
        )}
      </MapView>

      <FloatingButton />

      <TouchableOpacity
        style={styles.nearestButton}
        onPress={handlePostoMaisProximo}
        activeOpacity={0.8}
      >
        <Text style={styles.nearestButtonText}>Posto mais próximo</Text>
      </TouchableOpacity>
    </View>
  );
}
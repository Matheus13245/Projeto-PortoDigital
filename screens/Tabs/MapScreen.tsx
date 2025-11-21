import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, ActivityIndicator, Text, Image, TouchableOpacity } from "react-native";
import MapView, { Marker, Region, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import MapViewDirections from "react-native-maps-directions";
import mapStyle from "../../config/mapStyle.json";
import { postos, Posto } from "../../data/postos";
import FloatingButton from "../../components/ButtonPosto";
import { useNavigation, useRoute } from "@react-navigation/native";

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

  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [destino, setDestino] = useState<{ latitude: number; longitude: number; nome?: string } | null>(null);

  const mapRef = useRef<MapView>(null);

  /** Carrega destino vindo do PostoDetailsScreen */
  useEffect(() => {
    if (params?.rotaDestino) {
      setDestino(params.rotaDestino);

      // Move a câmera direto para o posto
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

  /** Obtém localização do usuário */
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

  /** Região inicial do mapa */
  const region: Region | undefined = location
    ? {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }
    : undefined;

  /** Clicar no ícone do posto */
  const handlePressPosto = (posto: Posto) => {
    setDestino({
      latitude: posto.latitude,
      longitude: posto.longitude,
      nome: posto.nome,
    });
  };

  /** Calcula distância entre 2 pontos (Haversine) */
  const calcularDistancia = (lat1: number, lon1: number, lat2: number, lon2: number) => {
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

  /** Encontra posto mais próximo */
  const handlePostoMaisProximo = () => {
    if (!location) return;

    let menorDistancia = Infinity;
    let postoMaisProximo: Posto | null = null;

    for (const posto of postos) {
      const dist = calcularDistancia(
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

  /** Tratamento de loading e erros */
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
        {/* Marcadores dos postos */}
        {postos.map((posto) => (
          <Marker
            key={posto.id}
            coordinate={{ latitude: posto.latitude, longitude: posto.longitude }}
            title={posto.nome}
            description={posto.endereco}
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
              style={{ width: 35, height: 35 }}
            />
          </Marker>
        ))}

        {/* Rota */}
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
            onReady={(result) => {
              mapRef.current?.fitToCoordinates(result.coordinates, {
                edgePadding: { top: 100, right: 50, bottom: 100, left: 50 },
                animated: true,
              });
            }}
          />
        )}
      </MapView>

      {/* Botão flutuante */}
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
    right: 20,
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 25,
    elevation: 4,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
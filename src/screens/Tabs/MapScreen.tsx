import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, ActivityIndicator, Text, Image, TouchableOpacity } from "react-native";
import MapView, { Marker, Region, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import MapViewDirections from "react-native-maps-directions";
import mapStyle from "../../config/mapStyle.json";
import { postos, Posto } from "../../data/postos";
import FloatingButton from "../../components/ButtonPosto";

const GOOGLE_MAPS_APIKEY = "AIzaSyBp1V7-y6aMDOj2-wRBNFdjpGb47QrSjCY";

export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [destino, setDestino] = useState<{ latitude: number; longitude: number } | null>(null);
  const mapRef = useRef<MapView>(null);

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

  const handlePressPosto = (posto: Posto) => {
    setDestino({ latitude: posto.latitude, longitude: posto.longitude });
  };

  // Função para calcular o posto mais próximo
  const calcularDistancia = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371; // raio da Terra em km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // distância em km
  };

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
  <FloatingButton
  title="Posto mais próximo"
  onPress={handlePostoMaisProximo}
  />

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        showsUserLocation
        customMapStyle={mapStyle}
        followsUserLocation
        initialRegion={region}
      >
        {postos.map((posto) => (
          <Marker
            key={posto.id}
            coordinate={{ latitude: posto.latitude, longitude: posto.longitude }}
            title={posto.nome}
            description={posto.endereco}
            onPress={() => handlePressPosto(posto)}
          >
            <Image
              source={require("../../assets/gas-station.png")}
              style={{ width: 35, height: 35 }}
              resizeMode="contain"
            />
          </Marker>
        ))}

        {destino && location && (
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
            onError={(err) => console.log("Erro no Directions:", err)}
          />
        )}
      </MapView>

      {/* Botão flutuante para encontrar o posto mais próximo */}
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
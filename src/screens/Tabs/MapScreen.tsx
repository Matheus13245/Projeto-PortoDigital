import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, ActivityIndicator, Text, Image } from "react-native";
import MapView, { Marker, Region, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import MapViewDirections from "react-native-maps-directions";
import mapStyle from "../../config/mapStyle.json";
import { postos, Posto } from "../../data/postos";

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

  if (!location) {
    return (
      <View style={styles.center}>
        <Text>Localização não encontrada</Text>
      </View>
    );
  }

  const region: Region = {
    latitude: location.latitude,
    longitude: location.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  // Função chamada ao clicar em um posto
  const handlePressPosto = (posto: Posto) => {
    setDestino({
      latitude: posto.latitude,
      longitude: posto.longitude,
    });
  };

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
        {/* Marcadores dos postos */}
        {postos.map((posto) => (
          <Marker
            key={posto.id}
            coordinate={{
              latitude: posto.latitude,
              longitude: posto.longitude,
            }}
            title={posto.nome}
            description={posto.endereco}
            onPress={() => handlePressPosto(posto)} // 👈 Gera rota ao clicar
          >
            <Image
              source={require("../../assets/gas-station.png")}
              style={{ width: 35, height: 35 }}
              resizeMode="contain"
            />
          </Marker>
        ))}

        {/* Desenha rota automaticamente quando há destino */}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
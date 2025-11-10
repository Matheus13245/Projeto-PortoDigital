import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Text, Image } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import * as Location from "expo-location";
import mapStyle from "../../config/mapStyle.json";
import { postos, Posto } from "../../data/postos";

export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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

        console.log("Localização retornada:", loc);

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

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        showsUserLocation={true}
        customMapStyle={mapStyle}
        followsUserLocation={true}
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
    >
      <Image
        source={require("../../assets/gas-station.png")}
        style={{ width: 35, height: 35 }}
        resizeMode="contain"
      />
    </Marker>
  ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});


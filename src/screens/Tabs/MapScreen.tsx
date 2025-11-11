import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Text, Image, Alert } from "react-native";
import MapView, { Marker, Region, Polyline } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import * as Location from "expo-location";
import Constants from "expo-constants";
import mapStyle from "../../config/mapStyle.json";
import { postos, Posto } from "../../data/postos";

const GOOGLE_API_KEY =
  // @ts-ignore
  (globalThis as any)?.GOOGLE_API_KEY ||
  // @ts-ignore
  (process as any)?.env?.GOOGLE_API_KEY ||
  (Constants as any)?.expoConfig?.extra?.GOOGLE_API_KEY ||
  (Constants as any)?.manifest?.extra?.GOOGLE_API_KEY ||
  "";

function haversineDistance(a: { latitude: number; longitude: number }, b: { latitude: number; longitude: number }) {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLon = Math.sin(dLon / 2);
  const aHarv = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon;
  const c = 2 * Math.atan2(Math.sqrt(aHarv), Math.sqrt(1 - aHarv));
  return R * c;
}

/** Decodificador de polyline (Google) */
function decodePolyline(encoded: string) {
  let index = 0;
  const len = encoded.length;
  let lat = 0;
  let lng = 0;
  const coordinates: { latitude: number; longitude: number }[] = [];

  while (index < len) {
    let b = 0;
    let shift = 0;
    let result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = (result & 1) ? ~(result >> 1) : (result >> 1);
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = (result & 1) ? ~(result >> 1) : (result >> 1);
    lng += dlng;

    coordinates.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
  }

  return coordinates;
}

export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [nearestPosto, setNearestPosto] = useState<Posto | null>(null);
  const [routeCoords, setRouteCoords] = useState<{ latitude: number; longitude: number }[] | null>(null);
  const mapRef = useRef<MapView | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permissão de localização negada.");
          setLoading(false);
          return;
        }
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
        if (loc?.coords) setLocation(loc.coords);
        else setErrorMsg("Não foi possível obter coordenadas.");
      } catch (err) {
        console.warn("Erro obter localização:", err);
        setErrorMsg("Erro ao obter localização: " + String(err));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!location) return;
    const nearest = postos.reduce((prev, curr) => {
      const dPrev = haversineDistance(location, { latitude: prev.latitude, longitude: prev.longitude });
      const dCurr = haversineDistance(location, { latitude: curr.latitude, longitude: curr.longitude });
      return dCurr < dPrev ? curr : prev;
    }, postos[0]);
    setNearestPosto(nearest);
  }, [location]);

  async function fetchDirectionsFallback(origin: { latitude: number; longitude: number }, destination: { latitude: number; longitude: number }) {
    if (!GOOGLE_API_KEY) {
      const msg = "Fallback: GOOGLE_API_KEY vazia. Verifique sua variável.";
      console.warn(msg);
      Alert.alert("Rota (fallback)", msg);
      return;
    }

    const originStr = `${origin.latitude},${origin.longitude}`;
    const destStr = `${destination.latitude},${destination.longitude}`;
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originStr}&destination=${destStr}&key=${GOOGLE_API_KEY}&mode=driving`;

    try {
      console.log("Fallback directions fetch:", url);
      const res = await fetch(url);
      const json = await res.json();
      console.log("Directions API response (fallback):", json);

      if (!res.ok) {
        const text = `HTTP ${res.status} - ${JSON.stringify(json)}`;
        console.warn(text);
        Alert.alert("Directions API erro", text);
        return;
      }

      if (!json.routes || json.routes.length === 0) {
        console.warn("Nenhuma rota retornada (fallback)", json);
        Alert.alert("Rota", "Nenhuma rota retornada pelo Directions API (fallback).");
        return;
      }

      const poly = json.routes[0].overview_polyline?.points;
      if (!poly) {
        console.warn("overview_polyline ausente (fallback)", json.routes[0]);
        Alert.alert("Rota", "overview_polyline ausente na resposta do Directions API.");
        return;
      }

      const coords = decodePolyline(poly);
      setRouteCoords(coords);
      // ajusta câmera
      setTimeout(() => {
        mapRef.current?.fitToCoordinates(
          [origin, destination, ...coords],
          { edgePadding: { top: 80, right: 40, bottom: 120, left: 40 }, animated: true }
        );
      }, 300);
    } catch (err) {
      console.warn("Erro fallback directions fetch:", err);
      Alert.alert("Erro", "Erro ao buscar rota (fallback): " + String(err));
    }
  }

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
        <Text>Localização indisponível.</Text>
      </View>
    );
  }

  const origin = { latitude: location.latitude, longitude: location.longitude };

  const region: Region = {
    latitude: location.latitude,
    longitude: location.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={(r) => {
          mapRef.current = r;
        }}
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
          >
            <Image source={require("../../assets/gas-station.png")} style={{ width: 35, height: 35 }} resizeMode="contain" />
          </Marker>
        ))}

        {nearestPosto && (
          <>
            <Marker
              coordinate={{ latitude: nearestPosto.latitude, longitude: nearestPosto.longitude }}
              title={`Mais próximo: ${nearestPosto.nome}`}
              pinColor="blue"
            />

            {GOOGLE_API_KEY ? (
              <MapViewDirections
                origin={origin}
                destination={{ latitude: nearestPosto.latitude, longitude: nearestPosto.longitude }}
                apikey={GOOGLE_API_KEY}
                strokeWidth={6}
                strokeColor="blue"
                mode="DRIVING"
                optimizeWaypoints={false}
                onReady={(result) => {
                  console.log("MapViewDirections onReady:", result);
                  if (result?.coordinates && result.coordinates.length > 0) {
                    setRouteCoords(result.coordinates);
                    mapRef.current?.fitToCoordinates(result.coordinates, {
                      edgePadding: { top: 80, right: 40, bottom: 120, left: 40 },
                      animated: true,
                    });
                  }
                }}
                onError={(err) => {
                  console.warn("MapViewDirections onError:", err);
                  // tenta fallback manual
                  Alert.alert("MapViewDirections", "Erro no MapViewDirections, tentando fallback manual. Veja logs.");
                  fetchDirectionsFallback(origin, { latitude: nearestPosto.latitude, longitude: nearestPosto.longitude });
                }}
              />
            ) : (
              // sem chave: tenta fallback direto
              <View />
            )}
          </>
        )}

        {/* Desenha a polilinha azul caso tenhamos coords (fetched ou MapViewDirections) */}
        {routeCoords && routeCoords.length > 0 && (
          <Polyline coordinates={routeCoords} strokeWidth={6} strokeColor="blue" lineCap="round" />
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

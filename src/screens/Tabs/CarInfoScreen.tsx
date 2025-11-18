import React from "react";
import { View, StyleSheet, Image, StatusBar } from "react-native";
import { Text, Card, ProgressBar } from "react-native-paper";
import { useAuth } from "../../context/AuthContext";

export default function CarInfoScreen() {
  const { user } = useAuth();

  if (!user) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#fff" }}>
          Faça login para ver a telemetria do veículo.
        </Text>
      </View>
    );
  }

  const { car, name, role } = user;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* TOPO - ÁREA DO CARRO */}
      <View style={styles.topArea}>
        {/* Se depois você adicionar uma imagem, coloca aqui */}
        {/* <Image source={CarImage} style={styles.carImage} resizeMode="contain" /> */}
        <Text style={styles.carModel}>{car.model}</Text>
        <Text style={styles.carOwner}>{name}</Text>
        <Text style={styles.carRole}>{role}</Text>
        <Text style={styles.carWarning}>{car.warning}</Text>
      </View>

      {/* CARDS DE INFORMAÇÃO */}
      <View style={styles.cardsRow}>
        {/* Card de Bateria */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Bateria</Text>
            <Text style={styles.cardSubtitle}>{car.lastChargeInfo}</Text>

            <View style={styles.batteryRow}>
              <Text style={styles.batteryKm}>{car.batteryKm} km</Text>
              <View style={styles.batteryRight}>
                <Text style={styles.batteryPercent}>
                  {car.batteryPercent}%
                </Text>
                <Text style={styles.batteryKw}>{car.batteryPowerKw} kW</Text>
              </View>
            </View>

            <ProgressBar
              progress={car.batteryPercent / 100}
              style={styles.progress}
            />
          </Card.Content>
        </Card>

        {/* Card de Clima */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Clima</Text>
            <Text style={styles.cardSubtitle}>Interior</Text>

            <View style={styles.temperatureWrapper}>
              <Text style={styles.temperatureValue}>
                {car.interiorTemp}°
              </Text>
              <ProgressBar
                progress={Math.min(car.interiorTemp / 40, 1)}
                style={styles.progress}
              />
            </View>
          </Card.Content>
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050711",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 24,
  },
  center: {
    flex: 1,
    backgroundColor: "#050711",
    alignItems: "center",
    justifyContent: "center",
  },
  topArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 16,
  },
  carImage: {
    width: "100%",
    height: 160,
    marginBottom: 12,
  },
  carModel: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  carOwner: {
    color: "#E0E0E0",
    fontSize: 16,
    fontWeight: "500",
  },
  carRole: {
    color: "#A0A0A0",
    fontSize: 14,
    marginBottom: 8,
  },
  carWarning: {
    color: "#B0FFB0",
    fontSize: 14,
  },
  cardsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 8,
  },
  card: {
    flex: 1,
    backgroundColor: "#111522",
    borderRadius: 16,
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  cardSubtitle: {
    color: "#AAAAAA",
    fontSize: 12,
    marginBottom: 12,
  },
  batteryRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  batteryKm: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
  },
  batteryRight: {
    alignItems: "flex-end",
  },
  batteryPercent: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  batteryKw: {
    color: "#AAAAAA",
    fontSize: 12,
  },
  progress: {
    height: 6,
    borderRadius: 4,
    marginTop: 4,
  },
  temperatureWrapper: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  temperatureValue: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 8,
  },
});

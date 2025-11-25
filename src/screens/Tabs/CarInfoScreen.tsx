import React from "react";
import { View, Text, StyleSheet, StatusBar } from "react-native";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";

export default function CarInfoScreen() {
  const { user } = useAuth();

  if (!user) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <Text style={{ color: "#ffffff", textAlign: "center" }}>
          Faça login para ver as informações do veículo.
        </Text>
      </View>
    );
  }

  const { carro } = user;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f1216" />

      {/* Ícone do carro */}
      <View style={styles.carPlaceholder}>
        <MaterialCommunityIcons
          name="car-electric"
          size={90}
          color="#00eaff"
        />
      </View>

      {/* Modelo e status */}
      <View style={styles.centerText}>
        <Text style={styles.modelTitle}>{carro.modelo}</Text>
        <Text style={styles.modelSub}>
          {carro.autonomiaKm} km • {carro.status}
        </Text>
      </View>

      {/* Info Boxes */}
      <View style={styles.infoContainer}>
        {/* Bateria */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Bateria</Text>
          <Text style={styles.infoSmall}>Última recarga 4 dias atrás</Text>

          <View style={styles.batteryRow}>
            <View style={styles.batteryBar}>
              <View style={styles.batteryLevel} />
            </View>

            <View>
              <Text style={styles.kmText}>{carro.autonomiaKm} km</Text>
              <Text style={styles.percentText}>
                {carro.bateriaPercent}% • elétrico
              </Text>
            </View>
          </View>
        </View>

        {/* Clima */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Clima</Text>
          <Text style={styles.infoSmall}>Interior 22°</Text>

          <View style={styles.climateCircle}>
            <Text style={styles.climateValue}>18°</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

/* ------------------------ STYLES ------------------------ */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f1216",
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerRight: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  carPlaceholder: {
    width: "100%",
    height: 180,
    borderRadius: 20,
    backgroundColor: "#161b22",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  centerText: {
    alignItems: "center",
    marginBottom: 24,
  },
  modelTitle: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "700",
  },
  modelSub: {
    color: "#9ca3af",
    fontSize: 14,
    marginTop: 4,
  },
  infoContainer: {
    flexDirection: "row",
    gap: 16,
  },
  infoBox: {
    flex: 1,
    backgroundColor: "#161b22",
    borderRadius: 20,
    padding: 16,
  },
  infoTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  infoSmall: {
    color: "#9ca3af",
    fontSize: 12,
    marginTop: 4,
    marginBottom: 12,
  },
  batteryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  batteryBar: {
    width: 26,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#0d4d0d",
    justifyContent: "flex-end",
    padding: 2,
  },
  batteryLevel: {
    width: "100%",
    height: "80%",
    backgroundColor: "#4dff4d",
    borderRadius: 6,
  },
  kmText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },
  percentText: {
    color: "#9ca3af",
    fontSize: 12,
  },
  climateCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: "#00eaff",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  climateValue: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
  },
});

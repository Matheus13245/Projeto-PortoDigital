import React from "react";
import { View, Text, StyleSheet, StatusBar } from "react-native";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f1216" />

      {/* Header */}
      <View style={styles.header}>
      </View>

      {/* Car placeholder box */}
      <View style={styles.carPlaceholder}>
        <MaterialCommunityIcons
          name="car-electric"
          size={90}
          color="#00eaff"
        />
      </View>

      {/* Model Info */}
      <View style={styles.centerText}>
        <Text style={styles.modelTitle}>Tesla Model X</Text>
        <Text style={styles.modelSub}>200 km • recarregue</Text>
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
              <Text style={styles.kmText}>212 km</Text>
              <Text style={styles.percentText}>85% • 117 kW</Text>
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
    padding: 20,
    paddingTop: 45,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerRight: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },

  carPlaceholder: {
    width: "100%",
    height: 180,
    backgroundColor: "#1a1f25",
    borderRadius: 18,
    marginTop: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#00eaff33",
  },

  centerText: {
    alignItems: "center",
    marginTop: 15,
  },

  modelTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "600",
  },

  modelSub: {
    color: "#9ca3af",
    marginTop: 3,
  },

  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
  },

  infoBox: {
    width: "47%",
    padding: 18,
    backgroundColor: "#171c22",
    borderRadius: 18,
  },

  infoTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },

  infoSmall: {
    color: "#7d7d7d",
    fontSize: 12,
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
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },

  percentText: {
    color: "#aaa",
    fontSize: 12,
  },

  climateCircle: {
    width: 74,
    height: 74,
    backgroundColor: "#1d242b",
    borderRadius: 50,
    borderWidth: 5,
    borderColor: "#00eaff55",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 10,
  },

  climateValue: {
    color: "#00d4ff",
    fontSize: 21,
    fontWeight: "700",
  },

  bottomMenu: {
    position: "absolute",
    bottom: 22,
    left: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 40,
  },

  menuCenterBtn: {
    width: 65,
    height: 65,
    backgroundColor: "#00d4ff",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});

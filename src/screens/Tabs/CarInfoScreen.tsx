import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
} from "react-native";
import { useAuth } from "../../context/AuthContext";

// certifique-se de ter o arquivo: assets/car-hero.png
import carHero from "../../../assets/car-hero.png";

export default function CarInfoScreen() {
  const { user } = useAuth();

  if (!user) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={{ color: "#fff" }}>
          Faça login para visualizar os dados do veículo.
        </Text>
      </View>
    );
  }

  const { carro } = user;

  // frase abaixo do modelo, baseada na autonomia
  let statusLine = `${carro.autonomiaKm} km • ${carro.status}`;
  if (!carro.status) {
    statusLine =
      carro.bateriaPercent < 30
        ? `${carro.autonomiaKm} km • recarregue em breve`
        : `${carro.autonomiaKm} km • autonomia confortável`;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f1216" />

      {/* HERO DO CARRO */}
      <View style={styles.heroCard}>
        {/* faixa diagonal branca */}
        <View style={styles.diagonalStripe} />

        {/* imagem do carro */}
        <Image source={carHero} style={styles.carImage} resizeMode="contain" />
      </View>

      {/* Modelo e status */}
      <View style={styles.modelBox}>
        <Text style={styles.modelTitle}>{carro.modelo}</Text>
        <Text style={styles.modelStatus}>{statusLine}</Text>
      </View>

      {/* Seção de cards */}
      <View style={styles.cardsRow}>
        {/* Card BATERIA */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Bateria</Text>
          <Text style={styles.cardSubtitle}>Última recarga 4 dias atrás</Text>

          <View style={styles.batteryRow}>
            <View style={styles.batteryBarOuter}>
              <View
                style={[
                  styles.batteryBarInner,
                  { height: `${Math.max(carro.bateriaPercent, 8)}%` },
                ]}
              />
            </View>

            <View>
              <Text style={styles.batteryKm}>{carro.autonomiaKm} km</Text>
              <Text style={styles.batteryPercent}>
                {carro.bateriaPercent}% • elétrico
              </Text>
            </View>
          </View>
        </View>

        {/* Card CLIMA */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Clima</Text>
          <Text style={styles.cardSubtitle}>Interior 22º</Text>

          <View style={styles.climateCircleOuter}>
            <View style={styles.climateCircleInner}>
              <Text style={styles.climateTemp}>18°</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

/* ----------------- STYLES ----------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f1216",
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },

  /* HERO */
  heroCard: {
    width: "100%",
    height: 220,
    borderRadius: 32,
    backgroundColor: "#161b22",
    overflow: "hidden",
    marginBottom: 20,
    justifyContent: "flex-end",
  },
  diagonalStripe: {
    position: "absolute",
    top: -80,
    left: -40,
    width: 260,
    height: 160,
    backgroundColor: "#ffffff",
    transform: [{ rotate: "-25deg" }],
  },
  carImage: {
    width: "115%",
    height: 160,
    alignSelf: "flex-end",
    marginRight: -30,
  },

  modelBox: {
    alignItems: "center",
    marginBottom: 20,
  },
  modelTitle: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "700",
  },
  modelStatus: {
    color: "#9ca3af",
    fontSize: 13,
    marginTop: 4,
  },

  /* CARDS */
  cardsRow: {
    flexDirection: "row",
    gap: 14,
  },
  infoCard: {
    flex: 1,
    backgroundColor: "#161b22",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  cardTitle: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
  cardSubtitle: {
    color: "#9ca3af",
    fontSize: 11,
    marginTop: 2,
    marginBottom: 14,
  },

  /* BATERIA */
  batteryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  batteryBarOuter: {
    width: 30,
    height: 70,
    borderRadius: 10,
    backgroundColor: "#0b2310",
    borderWidth: 2,
    borderColor: "#00f060",
    justifyContent: "flex-end",
    padding: 3,
  },
  batteryBarInner: {
    width: "100%",
    borderRadius: 6,
    backgroundColor: "#00ff5f",
  },
  batteryKm: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },
  batteryPercent: {
    color: "#9ca3af",
    fontSize: 12,
    marginTop: 2,
  },

  /* CLIMA */
  climateCircleOuter: {
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 4,
    borderColor: "#00eaff",
    alignItems: "center",
    justifyContent: "center",
  },
  climateCircleInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#0b1117",
    alignItems: "center",
    justifyContent: "center",
  },
  climateTemp: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
  },
});

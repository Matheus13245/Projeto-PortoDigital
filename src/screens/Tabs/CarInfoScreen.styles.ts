// src/screens/Tabs/CarInfoScreen.styles.ts
import { StyleSheet } from "react-native";
import { COLORS } from "../../styles/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.solidBackground, // #22252D
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 20,
  },

  center: {
    justifyContent: "center",
    alignItems: "center",
  },

  loginWarning: {
    color: COLORS.textPrimary,
    fontSize: 14,
    textAlign: "center",
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

  /* Modelo */
  modelBox: {
    alignItems: "center",
    marginBottom: 20,
  },
  modelTitle: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: "700",
  },
  modelStatus: {
    color: COLORS.textMuted,
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
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: "700",
  },
  cardSubtitle: {
    color: COLORS.textMuted,
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
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: "700",
  },
  batteryPercent: {
    color: COLORS.textMuted,
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
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: "700",
  },
});

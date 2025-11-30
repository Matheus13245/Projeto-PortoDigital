// src/screens/Info/PostoDetailsScreen.styles.ts
import { StyleSheet } from "react-native";
import { COLORS } from "../../styles/theme";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.solidBackground,
  },

  container: {
    flex: 1,
    backgroundColor: COLORS.solidBackground,
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 20,
  },

  // ---------- HEADER ----------
  title: {
    color: COLORS.textPrimary,
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 20,
    textAlign: "left",
  },

  // ---------- CARD ----------
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 18,
    padding: 18,
    marginTop: 4,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },

  cardTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },

  sectionLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginTop: 4,
    marginBottom: 10,
  },

  infoBox: {
    marginTop: 10,
    paddingVertical: 8,
  },

  resultTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
  },

  resultText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginBottom: 6,
  },

  // ---------- BOTÃO PRINCIPAL ----------
  primaryButton: {
    marginTop: 22,
    backgroundColor: COLORS.primaryButton,
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
  },

  primaryButtonText: {
    color: COLORS.primaryButtonLabel,
    fontWeight: "700",
    fontSize: 16,
  },

  // ---------- BOTÃO SECUNDÁRIO ----------
  secondaryButton: {
    marginTop: 16,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: COLORS.primaryButton,
    backgroundColor: "transparent",
  },

  secondaryButtonText: {
    color: COLORS.primaryButton,
    fontWeight: "700",
    fontSize: 16,
  },

  // ---------- ERRO ----------
  errorText: {
    color: COLORS.error ?? "#FF5555",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 40,
  },
});
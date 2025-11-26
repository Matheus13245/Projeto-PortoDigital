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
    backgroundColor: COLORS.solidBackground, // fundo escuro padrão
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 24,
  },

  title: {
    color: COLORS.textPrimary, // branco
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 16,
  },

  card: {
    backgroundColor: COLORS.cardBackground, // ex: #1B1E24
    borderRadius: 18,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },

  cardTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },

  sectionLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginTop: 4,
    marginBottom: 10,
  },

  pickerWrapper: {
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: 12,
  },

  picker: {
    color: COLORS.textPrimary,
    backgroundColor: "transparent",
  },

  infoBox: {
    marginTop: 8,
    paddingVertical: 8,
  },

  resultTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },

  resultText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginBottom: 4,
  },

  // Botão verde principal (Criar rota até o posto)
  primaryButton: {
    marginTop: 18,
    backgroundColor: COLORS.primaryButton, // verde AX
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
  },

  primaryButtonText: {
    color: COLORS.primaryButtonLabel,
    fontWeight: "700",
    fontSize: 16,
  },

  // (opcional) estilos para um botão secundário verde — caso queira
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
});

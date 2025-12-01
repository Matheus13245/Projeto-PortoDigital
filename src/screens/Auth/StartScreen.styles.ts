// src/screens/Auth/StartScreen.styles.ts
import { StyleSheet } from "react-native";
import { COLORS } from "../../styles/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
    justifyContent: "flex-start",
  },

  header: {
    alignItems: "center",
    marginTop: 16,
  },

  carGlow: {
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.primaryButton,
    shadowColor: COLORS.primaryButton,
    shadowOpacity: 0.6,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },

  carImage: {
    width: 160,
    height: 110,
  },

  title: {
    marginTop: 26,
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 3,
    color: COLORS.textPrimary,
  },

  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: COLORS.textSecondary,
  },

  actions: {
    marginTop: 40,
    gap: 16,
  },

  buttonPrimary: {
    backgroundColor: COLORS.primaryButton,
    borderRadius: 999,
    paddingVertical: 10,
  },

  buttonPrimaryLabel: {
    color: COLORS.primaryButtonText,
    fontWeight: "700",
    fontSize: 16,
  },

  buttonSecondary: {
    borderWidth: 1.8,
    borderColor: "rgba(255,255,255,0.85)",
    borderRadius: 999,
    paddingVertical: 10,
  },

  buttonSecondaryLabel: {
    color: COLORS.textPrimary,
    fontWeight: "700",
    fontSize: 16,
  },
});

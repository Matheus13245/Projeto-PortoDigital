// src/screens/Auth/LoginScreen.styles.ts
import { StyleSheet } from "react-native";
import { COLORS } from "../../styles/theme";

export const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 32,
    justifyContent: "space-between",
  },
  header: {
    alignItems: "center",
    marginTop: 16,
  },
  carGlow: {
    width: 180,
    height: 180,
    borderRadius: 90,
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
    width: 150,
    height: 100,
  },
  title: {
    marginTop: 24,
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.textPrimary,
    letterSpacing: 2,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  formContainer: {
    backgroundColor: "rgba(12, 17, 24, 0.92)",
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 16,
  },
  input: {
    backgroundColor: COLORS.inputBackground,
    borderRadius: 12,
  },
  button: {
    marginTop: 8,
    borderRadius: 999,
    backgroundColor: COLORS.primaryButton,
  },
  buttonLabel: {
    color: COLORS.primaryButtonText,
    fontWeight: "700",
  },
  footerText: {
    marginTop: 12,
    textAlign: "center",
    color: COLORS.textMuted,
    fontSize: 13,
  },
  footerLink: {
    color: COLORS.primaryButton,
    fontWeight: "600",
  },
});

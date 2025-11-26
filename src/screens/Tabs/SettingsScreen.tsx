// src/screens/Tabs/SettingsScreen.styles.ts
import { StyleSheet } from "react-native";
import { COLORS } from "../../styles/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.solidBackground, // #22252D
  },

  header: {
    paddingVertical: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#2A2E36",
  },

  headerTitle: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 1,
  },

  optionsWrapper: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    gap: 14,
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.cardBackground, // #1B1E24
    padding: 16,
    borderRadius: 14,
    justifyContent: "space-between",
  },

  optionText: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
    color: COLORS.textPrimary,
    fontWeight: "500",
  },

  logoutButton: {
    marginTop: 20,
    backgroundColor: "#E53935",
    paddingVertical: 16,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});

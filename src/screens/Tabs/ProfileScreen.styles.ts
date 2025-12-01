// src/screens/Tabs/ProfileScreen.styles.ts
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
  },
  contentContainer: {
    paddingTop: 24,
    paddingHorizontal: 16,
    paddingBottom: 32, // evita colar na tab bar
  },
  center: {
    flex: 1,
    backgroundColor: COLORS.solidBackground,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    color: COLORS.textPrimary,
    fontSize: 14,
  },

  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    backgroundColor: COLORS.accentCyan,
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 12,
    color: COLORS.textPrimary,
  },
  userEmail: {
    fontSize: 15,
    marginTop: 4,
    color: COLORS.textSecondary,
  },

  divider: {
    backgroundColor: COLORS.cardBorder,
    height: 1,
    marginVertical: 12,
  },

  sectionTitle: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginBottom: 6,
  },

  listItem: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    marginBottom: 10,
  },
  listTitle: {
    color: COLORS.textPrimary,
  },
  listDescription: {
    color: COLORS.textSecondary,
  },

  logoutButton: {
    marginTop: 30,
    backgroundColor: "#d62828",
    borderRadius: 12,
  },
  logoutButtonLabel: {
    fontWeight: "bold",
    color: "#ffffff",
  },

  versionText: {
    textAlign: "center",
    marginTop: 24,
    marginBottom: 10,
    color: "#6b7280",
    fontSize: 12,
  },
});

// src/screens/Info/FavoritePostsScreen.styles.ts
import { StyleSheet } from "react-native";
import { COLORS } from "../../styles/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.solidBackground, // #22252D
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 16,
  },

  emptyText: {
    color: COLORS.textMuted,
    marginTop: 8,
    fontSize: 14,
  },

  listContent: {
    paddingBottom: 24,
    gap: 10,
  },

  item: {
    backgroundColor: COLORS.cardBackground, // #1B1E24
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
  },

  itemTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "600",
  },

  itemSubtitle: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
});
